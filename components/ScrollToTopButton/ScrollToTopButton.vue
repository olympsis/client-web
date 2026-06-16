<!--
    ScrollToTopButton.vue

    A floating "jump back to top" button for a long scroll container, ported
    from the iOS ScrollToTopButton. Pass the scroll element via `target`; the
    button reveals once that element is scrolled past `threshold` px and, on
    click, smooth-scrolls it back to the top.

    Positioned bottom-left, absolute — the host must be `position: relative`.
-->
<template>
    <Transition name="stt-fade">
        <button
            v-if="visible"
            class="scroll-to-top"
            type="button"
            aria-label="Scroll to top"
            @click="scrollToTop"
        >
            <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
            >
                <path d="M12 19V5"/>
                <path d="M5 12l7-7 7 7"/>
            </svg>
        </button>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    /** The scroll container to watch and scroll to top. */
    target?: HTMLElement | null;
    /** Scroll distance (px) the container must pass before the button reveals. */
    threshold?: number;
}>();

const visible = ref(false);
let el: HTMLElement | null = null;

const onScroll = () => {
    visible.value = !!el && el.scrollTop > (props.threshold ?? 150);
};

const scrollToTop = () => {
    el?.scrollTo({ top: 0, behavior: 'smooth' });
};

// (Re)bind the scroll listener whenever the target element changes — the host's
// template ref is null until mounted, so this fires once it resolves.
const attach = (next?: HTMLElement | null) => {
    if (el) el.removeEventListener('scroll', onScroll);
    el = next ?? null;
    if (el) {
        el.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    } else {
        visible.value = false;
    }
};

watch(() => props.target, (t) => attach(t), { immediate: true });
onUnmounted(() => { if (el) el.removeEventListener('scroll', onScroll); });
</script>

<style scoped>
.scroll-to-top {
    position: absolute;
    left: 1.25rem;
    bottom: 1.25rem;
    z-index: 5;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    color: var(--primary-label-color);
    border: var(--component-border-color) solid 1px;
    background-color: var(--secondary-background-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    transition: transform 0.15s ease, background-color 0.15s ease;
}
.scroll-to-top:hover {
    transform: scale(1.06);
    background-color: var(--tertiary-background-color);
}

/* Reveal/hide animation. */
.stt-fade-enter-active, .stt-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.stt-fade-enter-from, .stt-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>
