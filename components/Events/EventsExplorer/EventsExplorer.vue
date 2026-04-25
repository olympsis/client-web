<template>
    <!--
        Top-level explorer layout:
          - Desktop (≥940px): Map | List side-by-side. Toggle in list panel header.
          - Mobile (<940px):  Map full-bleed with a peek-able BottomSheet on top.
        The toggle drives both pin source on the map and the list contents.
    -->
    <div class="events-explorer" :class="{ 'mode-events': mode === 'events', 'mode-venues': mode === 'venues' }">
        <!-- Map (always rendered; just resized by CSS at the breakpoint) -->
        <div class="map-pane">
            <EventsMap
                ref="mapRef"
                :mode="mode"
                :events="events"
                :venues="venues"
                :center="initialCenter"
                @select-event="handleSelectEvent"
                @select-event-cluster="handleSelectEventCluster"
                @select-venue="handleSelectVenue"
            />
        </div>

        <!-- Desktop side panel -->
        <aside class="list-pane">
            <header class="panel-header">
                <MapListToggle v-model="mode"/>
                <div class="count">{{ resultCount }}</div>
            </header>
            <div class="list-body">
                <component :is="EventsExplorerListInline"
                    :mode="mode"
                    :events="events"
                    :venues="venues"
                    @select-event="handleSelectEvent"
                    @select-venue="handleSelectVenue"
                />
            </div>
        </aside>

        <!-- Mobile bottom sheet — replaces the side panel below the breakpoint.
             The sheet is absolutely positioned inside .events-explorer, which
             starts below the page's top bar, so full-snap can't cover it. -->
        <BottomSheet v-if="isMobile" class="mobile-sheet">
            <template #header>
                <MapListToggle v-model="mode"/>
            </template>
            <component :is="EventsExplorerListInline"
                :mode="mode"
                :events="events"
                :venues="venues"
                @select-event="handleSelectEvent"
                @select-venue="handleSelectVenue"
            />
        </BottomSheet>

        <!-- Cluster picker — opens when user taps a multi-event pin.
             modal renders the backdrop; dismissableMask makes clicking it close
             the dialog. PrimeVue's `modal` defaults to false, so we set it explicitly. -->
        <Dialog
            v-model:visible="showClusterPicker"
            position="center"
            modal
            blockScroll
            dismissableMask
            :showHeader="false"
            :pt="{ root: { style: { width: '90vw', maxWidth: '32rem', borderRadius: '20px' } } }"
        >
            <div class="cluster-picker">
                <h3>{{ t('events.clusterPicker.title', { count: clusterEvents.length }) }}</h3>
                <ul>
                    <li v-for="evt in clusterEvents" :key="evt.id" @click="goToEvent(evt)">
                        <SmallEventListItem :event="evt"/>
                    </li>
                </ul>
            </div>
        </Dialog>

        <!-- Venue detail modal — same one as the existing groups/map.vue uses.
             modal + dismissableMask: backdrop is rendered and clicking it closes
             the dialog (matches the cluster picker behavior). -->
        <Dialog
            v-model:visible="showVenueDetail"
            position="center"
            modal
            blockScroll
            dismissableMask
            :showHeader="false"
            :style="{ top: '10px', height: '80vh', overflowY: 'hidden' }"
        >
            <template #container="{ closeCallback }">
                <VenueDetailCard
                    v-if="selectedVenue"
                    :venue="selectedVenue"
                    :events="venueEvents(selectedVenue)"
                    @close="closeCallback"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';

import Dialog from 'primevue/dialog';
import EventsMap from '@/components/Events/EventsMap/EventsMap.vue';
import EventListItem from '@/components/Events/EventListItem/EventListItem.vue';
import VenueListItem from '@/components/Venues/VenueListItem/VenueListItem.vue';
import VenueDetailCard from '@/components/Venues/VenueDetailCard/VenueDetailCard.vue';
import SmallEventListItem from '@/components/Events/SmallEventListItem/SmallEventListItem.vue';
import MapListToggle, { type ExplorerMode } from '@/components/MapListToggle/MapListToggle.vue';
import BottomSheet from '@/components/BottomSheet/BottomSheet.vue';

const { t } = useI18n();
const router = useRouter();

const props = defineProps({
    events: { type: Array as () => Event[], default: () => [] },
    venues: { type: Array as () => Venue[], default: () => [] },
    initialCenter: { type: Array as () => number[], default: () => [-73.9776, 40.7655] },
    /**
     * Pixels to leave at the top of the viewport when the mobile bottom sheet
     * is fully extended. Pass the parent's top bar height so the search row
     * stays visible above the sheet at full snap.
     */
    topOffset: { type: Number, default: 0 },
});

const mode = ref<ExplorerMode>('events');
const mapRef = ref<InstanceType<typeof EventsMap> | null>(null);

// ── Result count (shown in the panel header — "23 events" / "8 venues") ────

const resultCount = computed<string>(() => {
    if (mode.value === 'events') {
        return t('events.toggle.eventsCount', { count: props.events.length });
    }
    return t('events.toggle.venuesCount', { count: props.venues.length });
});

// ── Mobile breakpoint detection ─────────────────────────────────────────────
// We can't rely on CSS alone because BottomSheet and side-panel content are
// rendered conditionally to avoid duplicate scroll containers and double DOM.

const isMobile = ref(false);
let mediaQuery: MediaQueryList | null = null;
const onMqChange = (e: MediaQueryListEvent) => { isMobile.value = e.matches; };

onMounted(() => {
    mediaQuery = window.matchMedia('(max-width: 940px)');
    isMobile.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', onMqChange);
});

onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', onMqChange);
});

// ── Inline list renderer ────────────────────────────────────────────────────
// A tiny render-fn component that switches between EventListItem grid and
// VenueListItem grid based on `mode`. Defining it as a render fn (not a
// separate .vue file) keeps the explorer self-contained — both the desktop
// panel and the bottom sheet share this exact rendering, ensuring they stay
// visually in sync as we iterate on density/styling.

const EventsExplorerListInline = {
    props: {
        mode: { type: String as () => ExplorerMode, required: true },
        events: { type: Array as () => Event[], default: () => [] },
        venues: { type: Array as () => Venue[], default: () => [] },
    },
    emits: ['select-event', 'select-venue'],
    setup(p: any, { emit }: any) {
        return () => {
            if (p.mode === 'events') {
                if (p.events.length === 0) {
                    return h('div', { class: 'empty' }, t('events.noEventsFound'));
                }
                return h(
                    'ul',
                    { class: 'list-grid events-grid' },
                    p.events.map((evt: Event) =>
                        h(EventListItem, {
                            key: evt.id,
                            event: evt,
                            showFullTime: true,
                            onSelected: () => emit('select-event', evt),
                        })
                    )
                );
            }
            if (p.venues.length === 0) {
                return h('div', { class: 'empty' }, t('events.noVenuesFound'));
            }
            return h(
                'ul',
                { class: 'list-grid venues-grid' },
                p.venues.map((venue: Venue) =>
                    h(VenueListItem, {
                        key: venue.id,
                        venue,
                        onSelected: () => emit('select-venue', { venue }),
                    })
                )
            );
        };
    },
};

// ── Selection handlers ─────────────────────────────────────────────────────

const showVenueDetail = ref(false);
const selectedVenue = ref<Venue | undefined>(undefined);

const showClusterPicker = ref(false);
const clusterEvents = ref<Event[]>([]);

function handleSelectEvent(arg: Event | { event: Event }) {
    // Two call sites: direct event (from map) and `{ event }` (from EventListItem).
    const evt = (arg as any)?.event ?? arg;
    if (evt) goToEvent(evt);
}

function handleSelectEventCluster(events: Event[]) {
    clusterEvents.value = events;
    showClusterPicker.value = true;
}

function handleSelectVenue(arg: Venue | { venue: Venue }) {
    const v = (arg as any)?.venue ?? arg;
    if (!v) return;
    selectedVenue.value = v;
    showVenueDetail.value = true;
}

function goToEvent(evt: Event) {
    showClusterPicker.value = false;
    router.push(`/events/${evt.id}`);
}

// Build the events-at-this-venue list for VenueDetailCard. Matches by venueId
// against the descriptor reference on each event.
function venueEvents(v: Venue): Event[] {
    return props.events.filter((e) =>
        e.venues?.some((d) => d.venueId === v.id)
    );
}
</script>

<style scoped>
.events-explorer {
    display: grid;
    width: 100%;
    height: 100%;
    /* Positioning ancestor for the absolute-positioned BottomSheet on mobile.
       The explorer fills the area below the page's top bar, so the sheet —
       anchored to bottom: 0 here — can never extend above the search row. */
    position: relative;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'map list';
}

.map-pane {
    grid-area: map;
    height: 100%;
    overflow: hidden;
}

.list-pane {
    grid-area: list;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    border-left: 1px solid var(--component-border-color);
    background-color: var(--primary-background-color);
}

.panel-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--component-border-color);
    background-color: var(--primary-background-color);

    .count {
        font-size: 0.9rem;
        color: var(--secondary-label-color, gray);
    }
}

.list-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1rem;
    /* Establish a size container so the grid below can switch to 2 columns
       based on the panel's actual width (not the viewport). The desktop
       layout splits the viewport 50/50, so a viewport-level media query
       wouldn't know how wide the panel is. */
    container-type: inline-size;
    container-name: list-panel;
}

/* Shared list grid used by both the side panel and the bottom sheet.
   Defaults to a single column; the desktop panel upgrades to 2 columns once
   it's wide enough (see @container query below). The mobile sheet always
   stays single column. */
.list-body :deep(.list-grid),
.mobile-sheet :deep(.list-grid) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr);
}

/* When the side panel itself is wide enough for two cards (44rem ≈ 704px)
   switch to a 2-column grid. The container query reacts to panel width,
   not viewport width — so resizing the window or future split adjustments
   work without further tweaks. */
@container list-panel (min-width: 44rem) {
    .list-body :deep(.list-grid) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/*
   The card components were originally designed for a wider 3-col grid (events
   page) and a horizontal scroller (nearby venues), so they ship with hardcoded
   min/max widths (20–23rem for events, 22–25rem for venues). Inside this
   panel/sheet we need them to follow the grid's `minmax(0, 1fr)` columns —
   otherwise they spill out of their cells and overlap. Reset the constraints.
*/
.list-body :deep(.list-grid > *),
.mobile-sheet :deep(.list-grid > *) {
    min-width: 0;
    max-width: 100%;
    width: 100%;
}

.list-body :deep(.empty),
.mobile-sheet :deep(.empty) {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--secondary-label-color, gray);
}

.cluster-picker {
    padding: 1rem 1.25rem 1.25rem 1.25rem;
    background-color: var(--primary-background-color);

    h3 {
        margin: 0 0 0.75rem 0;
        color: var(--primary-label-color);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 60vh;
        overflow-y: auto;
    }

    li {
        cursor: pointer;
    }
}

/* Mobile: hide the side panel, let the map fill, BottomSheet is rendered separately. */
@media (max-width: 940px) {
    .events-explorer {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas: 'map';
    }
    .list-pane {
        display: none;
    }
}

/* Mobile sheet padding (grid is already single-column above). */
.mobile-sheet :deep(.list-grid) {
    padding: 0 1rem 1rem 1rem;
}
</style>
