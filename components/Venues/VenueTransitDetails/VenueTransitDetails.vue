<template>
    <!--
        Transit sub-section, designed to be embedded inside VenueCourtDetails
        (no card frame — that's the parent's job). Lists every transit line
        attached to the venue with a colored route badge + line type/system.
        Renders nothing when the venue has no transit_lines so the parent
        section doesn't show an orphan heading.
    -->
    <div v-if="lines.length > 0" class="venue-transit">
        <h4>{{ $t('venue.transit.title') }}</h4>

        <ul class="transit-list">
            <li
                v-for="line in lines"
                :key="line.id ?? line.name"
                class="transit-item"
            >
                <span
                    class="transit-badge"
                    :style="{ backgroundColor: line.color || '#888' }"
                >{{ line.name }}</span>
                <div class="transit-text">
                    <span v-if="line.type" class="transit-type">{{ titleize(line.type) }}</span>
                    <span v-if="line.system" class="transit-system">{{ line.system }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Venue } from '@/data/models/VenueModels';

const props = defineProps({
    venue: { type: Venue, required: true }
});

const lines = computed(() => props.venue.transitLines ?? []);

/** "subway" → "Subway"; bare passthrough for already-cased values. */
function titleize(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
</script>

<style scoped>
/*
   No card frame — this component is meant to be embedded inside another
   section (currently VenueCourtDetails). The parent provides the card
   chrome; we just contribute a sub-heading + the transit list, separated
   from the preceding content by a top margin.
*/
.venue-transit {
    margin-top: 1rem;
}

h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--primary-label-color);
}

.transit-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.transit-item {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    color: var(--primary-label-color);
}

/*
   Colored route bullet. Uses the line's brand color from the model and
   white text inside. Auto-widens when names are longer than one character —
   width: auto with min-width: 1.6rem keeps NYC-style 1-char circles compact
   while still accommodating longer names (e.g. "M5", "RER A").
*/
.transit-badge {
    flex-shrink: 0;
    height: 1.6rem;
    min-width: 1.6rem;
    padding: 0 0.45rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.transit-text {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    min-width: 0;
}

.transit-type {
    font-weight: 600;
    color: var(--primary-label-color);
}

.transit-system {
    font-size: 0.85rem;
    color: var(--olympsis-gray);
}
</style>
