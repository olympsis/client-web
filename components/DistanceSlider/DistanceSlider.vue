<!--
    DistanceSlider.vue

    A search-radius slider used in the events/venues filter popup.

    The bound model (`v-model`) is the radius in METERS so it can be passed
    straight to the events/venues services (which expect meters). The UI,
    however, works in whole miles because that's friendlier to read and gives
    clean slider steps — the component converts between the two:

        model (meters)  ⇄  miles (slider position)
-->
<template>
    <div id="distance-slider">
        <!-- Live readout of the selected radius. -->
        <div class="readout">{{ t('events.filter.withinMiles', { miles }) }}</div>

        <input
            class="range"
            type="range"
            :min="MIN_MILES"
            :max="MAX_MILES"
            :step="STEP_MILES"
            v-model.number="miles"
        />

        <!-- Min / max end labels so the scale is obvious. -->
        <div class="ticks">
            <span>{{ MIN_MILES }} mi</span>
            <span>{{ MAX_MILES }} mi</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    DEFAULT_SEARCH_RADIUS_METERS,
    milesToMeters,
    metersToMiles,
} from '~/utils/distance-helpers';

const { t } = useI18n();

// Radius in meters (what the API expects). Defaults to the shared 50-mi default.
const model = defineModel<number>({ default: DEFAULT_SEARCH_RADIUS_METERS });

// Slider bounds, in miles.
const MIN_MILES = 5;
const MAX_MILES = 100;
const STEP_MILES = 5;

/*
   Two-way bridge between the meters model and the miles the slider renders.
   - get: meters → whole miles (rounded so the thumb lands on a tick)
   - set: miles → meters (milesToMeters rounds to whole meters)
*/
const miles = computed<number>({
    get: () => Math.round(metersToMiles(model.value)),
    set: (value: number) => {
        model.value = milesToMeters(value);
    },
});
</script>

<style scoped>
#distance-slider {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.readout {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-label-color);
}

/* Native range input, restyled to match the brand. We reset the default
   appearance and draw our own track + thumb so it looks consistent across
   browsers (WebKit + Firefox pseudo-elements handled separately below). */
.range {
    width: 100%;
    height: 1.5rem;
    margin: 0;
    cursor: pointer;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
}

/* Track — tertiary surface so it stays visible on the secondary card it sits on. */
.range::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
    background: var(--tertiary-background-color);
    border: var(--component-border) solid 1px;
}
.range::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: var(--tertiary-background-color);
    border: var(--component-border) solid 1px;
}

/* Thumb — vertically centered on the 6px track. */
.range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: calc((6px - 1.25rem) / 2);
    border-radius: 50%;
    background: var(--primary-brand-color);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}
.range::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--primary-brand-color);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

.ticks {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--secondary-label-color);
}
</style>
