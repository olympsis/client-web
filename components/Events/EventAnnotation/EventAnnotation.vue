<template>
    <div class="event-annotation" :class="{ cluster: count > 1 }">
        <!--
            Single event: show the event poster image.
            Cluster: show the count of overlapping events (the inner image is hidden by CSS).
            Reuses the same circular brand-colored frame as VenueAnnotation so
            map pins feel cohesive across the two modes.
        -->
        <img v-if="imageURL && !imageFailed" :src="imageURL" :onerror="handleFailedImage"/>
        <img v-else-if="count <= 1" src="@/assets/icons/calendar/calendar.white.svg" class="fallback"/>

        <span v-if="count > 1" class="count">{{ count }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Event } from '~/data/models/EventModels';
import { generateImageURL } from '~/utils/image-helpers';

const props = defineProps({
    /**
     * The first event in the cluster — its image is shown when this pin
     * represents a single event.
     */
    event: { type: Event, required: true },
    /**
     * How many events are stacked at (or near) this coordinate. 1 means a
     * single event; >1 toggles cluster styling + the count badge.
     */
    count: { type: Number, default: 1 }
});

const imageFailed = ref(false);

const imageURL = computed(() => {
    if (props.event.mediaURL) {
        return generateImageURL(props.event.mediaURL);
    }
    return undefined;
});

function handleFailedImage() {
    imageFailed.value = true;
}
</script>

<style scoped>
.event-annotation {
    width: 3rem;
    height: 3rem;
    display: flex;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-brand-color);
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

    img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .fallback {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 0;
    }

    /* Cluster mode: hide image, show count instead. */
    &.cluster {
        img {
            display: none;
        }
    }

    .count {
        color: white;
        font-weight: 700;
        font-size: 0.95rem;
        font-family: 'Archivo', 'Helvetica Nue', 'Roboto', sans-serif;
    }
}
</style>
