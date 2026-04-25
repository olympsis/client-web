<template>
    <!--
        Generic bottom sheet with three snap points: peek, half, full.
        Drag the grabber handle to resize, or tap the handle to cycle peek → half → full → peek.
        The sheet is `position: fixed` to the viewport so it floats above the map.
        The peek state shows just the header (toggle + a sliver of list); half and
        full progressively reveal more content, with the inner scroll area only
        being scrollable in the half/full states.
    -->
    <div
        ref="sheetRef"
        class="bottom-sheet"
        :class="['snap-' + snapPoint, { dragging: isDragging }]"
        :style="sheetStyle"
    >
        <!--
            Drag-zone wraps only the grabber pill. The header (toggle, etc.)
            sits in a sibling div so its clicks never bubble into the drag/tap
            handlers — the toggle can be interacted with without resizing the
            sheet. Tap the grabber pill to cycle peek → half → full.
        -->
        <div
            class="drag-zone"
            @pointerdown="onPointerDown"
            @click="onHandleClick"
        >
            <div class="grabber"/>
        </div>

        <div class="header">
            <slot name="header"/>
        </div>

        <!-- Body — only scrolls when sheet is at half or full snap point -->
        <div class="body" :class="{ scrollable: snapPoint !== 'peek' }">
            <slot/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';

type SnapPoint = 'peek' | 'half' | 'full';

const props = defineProps({
    /** Height (in viewport %) when at peek snap. */
    peekHeight: { type: Number, default: 18 },
    /** Height (in viewport %) when at half snap. */
    halfHeight: { type: Number, default: 55 },
    /** Height (in viewport %) when at full snap. */
    fullHeight: { type: Number, default: 95 },
    /**
     * Pixels to leave at the top of the viewport when the sheet is fully
     * extended. Use this to keep a top bar (e.g. search/filter row) visible
     * above the sheet — at full snap the sheet's top edge will not cross
     * this offset. Peek/half snaps are unaffected.
     */
    topOffset: { type: Number, default: 0 },
    /** Initial snap point. */
    initialSnap: { type: String as () => SnapPoint, default: 'peek' }
});

const snapPoint = ref<SnapPoint>(props.initialSnap as SnapPoint);

// Drag state — `dragHeightVh` is the live height during a drag, in vh units.
// While dragging, we override the snap-class height with this inline style;
// on release we snap to whichever break point is closest.
const isDragging = ref(false);
const dragHeightVh = ref<number | null>(null);

const sheetRef = ref<HTMLElement | null>(null);

let pointerStartY = 0;
let dragStartHeightVh = 0;

const sheetStyle = computed(() => {
    // While the user is actively dragging we override the snap-class height
    // with the live value. The parent's `max-height: 100%` still clamps it,
    // so the sheet can't be dragged above the parent's top edge.
    if (isDragging.value && dragHeightVh.value !== null) {
        return { height: `${dragHeightVh.value}vh` };
    }
    return undefined;
});

function snapHeightFor(point: SnapPoint): number {
    switch (point) {
        case 'peek': return props.peekHeight;
        case 'half': return props.halfHeight;
        case 'full': return props.fullHeight;
    }
}

function nearestSnap(heightVh: number): SnapPoint {
    const points: SnapPoint[] = ['peek', 'half', 'full'];
    let best: SnapPoint = 'peek';
    let bestDelta = Infinity;
    points.forEach((p) => {
        const delta = Math.abs(snapHeightFor(p) - heightVh);
        if (delta < bestDelta) {
            best = p;
            bestDelta = delta;
        }
    });
    return best;
}

function onPointerDown(e: PointerEvent) {
    // Only drag from the handle area; ignore right/middle clicks.
    if (e.button !== 0) return;
    isDragging.value = true;
    pointerStartY = e.clientY;
    dragStartHeightVh = snapHeightFor(snapPoint.value);
    dragHeightVh.value = dragStartHeightVh;

    // Capture the pointer so the drag continues even if the cursor leaves the handle.
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e: PointerEvent) {
    if (!isDragging.value) return;
    const deltaY = pointerStartY - e.clientY; // positive when dragging up
    const deltaVh = (deltaY / window.innerHeight) * 100;
    const next = dragStartHeightVh + deltaVh;
    // Clamp between peek and full so the sheet can't be dragged off-screen.
    dragHeightVh.value = Math.max(props.peekHeight, Math.min(props.fullHeight, next));
}

function onPointerUp() {
    if (!isDragging.value) return;
    const finalHeight = dragHeightVh.value ?? snapHeightFor(snapPoint.value);
    snapPoint.value = nearestSnap(finalHeight);
    isDragging.value = false;
    dragHeightVh.value = null;

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
}

// Tap (no drag): cycle through snap points so the sheet is keyboard/click-friendly.
let tapStartY = 0;
function onHandleClick(e: MouseEvent) {
    // Distinguish tap from drag by checking displacement; the pointerdown
    // recorded pointerStartY, so reuse it.
    const movedY = Math.abs(e.clientY - pointerStartY);
    if (movedY > 6) return; // it was a drag, not a tap

    const order: SnapPoint[] = ['peek', 'half', 'full'];
    const idx = order.indexOf(snapPoint.value);
    snapPoint.value = order[(idx + 1) % order.length];
}

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
});
</script>

<style scoped>
/*
   Sheet is absolutely positioned inside its parent (which the explorer marks
   `position: relative`). This means the parent's box defines how far up the
   sheet can extend — at full snap the sheet fills 100% of the parent, and
   nothing lets it cross above whatever the parent's top edge is. That's how
   the search bar stays visible: the explorer container already starts below
   the search bar, so the sheet physically can't reach it.
*/
.bottom-sheet {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: flex;
    position: absolute;
    flex-direction: column;
    max-height: 100%; /* never escape the parent */
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border: var(--component-border-color) solid 1px;
    background-color: var(--primary-background-color);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
    transition: height 240ms cubic-bezier(0.32, 0.72, 0, 1);
    overflow: hidden;
    touch-action: none; /* prevent the page from scrolling when dragging the sheet */
}

.bottom-sheet.dragging {
    transition: none; /* no animation while the user is actively dragging */
}

.bottom-sheet.snap-peek { height: 18vh; }
.bottom-sheet.snap-half { height: 55vh; }
/* Full snap fills the parent — `max-height: 100%` above already caps it,
   but setting height: 100% makes the transition target deterministic. */
.bottom-sheet.snap-full { height: 100%; }

.drag-zone {
    flex-shrink: 0;
    cursor: grab;
    padding: 0.5rem 1rem;
    user-select: none;
    touch-action: none;

    &:active { cursor: grabbing; }
}

.grabber {
    width: 2.5rem;
    height: 4px;
    margin: 0 auto;
    border-radius: 2px;
    background-color: var(--component-border-color);
}

.header {
    flex-shrink: 0;
    display: flex;
    padding: 0.25rem 1rem 0.5rem 1rem;
    align-items: center;
    justify-content: center;
}

.body {
    flex: 1;
    min-height: 0;
    overflow-y: hidden;

    &.scrollable {
        overflow-y: auto;
    }
}
</style>
