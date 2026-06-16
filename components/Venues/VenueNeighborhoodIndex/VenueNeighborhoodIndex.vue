<!--
    VenueNeighborhoodIndex.vue

    A neighborhood-grouped index of venues, ported from the iOS
    `VenueNeighborhoodIndex`: a row of quick-jump chips at the top (tap one to
    scroll its section into view) followed by one section per neighborhood — a
    header with the name + venue count, then the venues in it.

    Designed to drop inside an existing scroll container (the events explorer's
    list panel / bottom sheet). It does NOT add its own vertical scroll; the
    chips scroll the nearest scrollable ancestor via scrollIntoView. Each
    section's venues render in a `list-grid` so they inherit the explorer's
    responsive 1-/2-column layout and card width resets.
-->
<template>
    <div class="venue-neighborhood-index">
        <!-- Quick-jump chips: tap one to scroll its section into view. -->
        <div class="chips">
            <button
                v-for="hood in neighborhoods"
                :key="hood.name"
                class="chip"
                type="button"
                @click="scrollToSection(hood.name)"
            >
                {{ hood.name }} ({{ hood.venues.length }})
            </button>
        </div>

        <!-- One section per neighborhood. -->
        <div
            v-for="hood in neighborhoods"
            :key="hood.name"
            :ref="(el) => setSectionRef(hood.name, el)"
            class="section"
        >
            <header class="section-header">
                <span class="name">{{ hood.name }}</span>
                <span class="count">{{ hood.venues.length }}</span>
            </header>

            <ul class="list-grid">
                <VenueListItem
                    v-for="venue in hood.venues"
                    :key="venue.id"
                    :venue="venue"
                    @selected="(payload) => emit('select-venue', payload)"
                />
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Venue } from '~/data/models/VenueModels';
import VenueListItem from '~/components/Venues/VenueListItem/VenueListItem.vue';

const props = defineProps({
    venues: { type: Array as () => Venue[], default: () => [] },
});

const emit = defineEmits<{
    (e: 'select-venue', payload: { venue: Venue }): void;
}>();

/*
   Group venues by neighborhood, alphabetically. A venue's neighborhood is its
   subLocality (e.g. "Williamsburg"); fall back to its locality (city) and then
   an "Other" bucket so every venue still lands somewhere — mirrors iOS.
*/
const neighborhoods = computed<Array<{ name: string; venues: Venue[] }>>(() => {
    const groups = new Map<string, Venue[]>();

    for (const venue of props.venues) {
        const name = venue.subLocality?.trim()
            || venue.locality?.trim()
            || 'Other';
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name)!.push(venue);
    }

    return Array.from(groups.entries())
        .map(([name, venues]) => ({ name, venues }))
        .sort((a, b) => a.name.localeCompare(b.name));
});

// Section element refs (keyed by neighborhood name) for quick-jump scrolling.
const sectionRefs = new Map<string, HTMLElement>();
const setSectionRef = (name: string, el: unknown) => {
    if (el instanceof HTMLElement) {
        sectionRefs.set(name, el);
    } else {
        sectionRefs.delete(name);
    }
};

const scrollToSection = (name: string) => {
    // Scrolls the nearest scrollable ancestor (the explorer panel / sheet).
    sectionRefs.get(name)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style scoped>
.venue-neighborhood-index {
    display: flex;
    flex-direction: column;
}

/* Quick-jump chips — a horizontally scrollable row at the top of the index
   (scrolls with the list, like iOS). */
.chips {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.25rem 0 0.75rem;
    scrollbar-width: none; /* hide the scrollbar (Firefox) */
}
.chips::-webkit-scrollbar { display: none; }

.chip {
    flex: 0 0 auto;
    cursor: pointer;
    white-space: nowrap;
    padding: 0.4rem 0.85rem;
    font-size: 0.85rem;
    border-radius: 999px;
    color: var(--primary-label-color);
    border: var(--component-border) solid 1px;
    background-color: var(--secondary-background-color);

    &:hover { background-color: var(--tertiary-background-color); }
}

.section {
    /* Small breathing room above a section when a chip jumps to it. */
    scroll-margin-top: 0.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0 0.5rem;

    .name {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary-label-color);
    }

    .count {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.1rem 0.5rem;
        border-radius: 999px;
        color: var(--secondary-label-color);
        background-color: var(--secondary-background-color);
    }
}
</style>
