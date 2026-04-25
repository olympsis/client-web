<template>
    <li id="venue-list-item" @click="$emit('selected', { venue: venue })">
        <img :src="image" class="image"/>
        <div class="bottom">
            <div class="info">
                <div class="name">{{ name }}</div>

                <div class="location-wrapper">
                    <picture>
                        <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                        <img class="location-pin" src="@/assets/icons/pin-drop/pin.drop.svg">
                    </picture>
                    <div class="location">{{ locationLine }}</div>
                </div>
            </div>
            
            <picture @click="openMaps" >
                <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/car/car.svg" class="directions">
            </picture>
        </div>
    </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Venue } from '@/data/models/VenueModels';
import { getDirections } from '~/utils/map-helpers';
import { generateImageURL } from '~/utils/image-helpers';

import Dialog from 'primevue/dialog';
import VenueDetailCard from '@/components/Venues/VenueDetailCard/VenueDetailCard.vue';

const props = defineProps({
    venue: { type: Venue, required: true }
});



const name = computed(() => {
    return props.venue.name
});

// Server replaced the old city/state/country trio with locality /
// administrative_area / country_code — locality is the city-equivalent and
// administrative_area is the state-equivalent.
const locationLine = computed(() => {
    return [props.venue.locality, props.venue.administrativeArea].filter(Boolean).join(', ');
});

const image = computed(() => {
    const media = props.venue.media;
    if (media && media.length > 0) {
        return generateImageURL(media[0]);
    } else {
        return undefined;
    }
});

const openMaps = () => {
    if (props.venue.location) {
        const coordinates = props.venue.location?.coordinates;
        if (coordinates) {
            getDirections(coordinates);
        }
    }
};

</script>

<style scoped>
#venue-list-item {
    min-width: 22rem;
    max-width: 25rem;
    margin: 0rem 1rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    background-color: var(--secondary-background-color);

    .image {
        width: 100%;
        height: 15rem;
        object-fit: cover;
        border-radius: 10px 10px 0px 0px;
    }

    .bottom {
        height: 4rem;
        display: flex;
        align-items: end;
        padding: 0.25rem 1rem 0.75rem 1rem;
        justify-content: space-between;
        
        
        .info {
            display: flex;
            flex-direction: column;
            
            .name {
                margin: unset;
                font-weight: 600;
                font-size: 1.1rem;
                font-style: normal;
                color: var(--primary-label-color);
            }

            .location-wrapper {
                display: flex;
                margin-top: 0.25rem;
            }

            .location-pin {
                width: 1rem;
                height: 1rem;
                margin-right: 0.25rem;
            }

            .location {
                font-size: 0.9rem;
            }
        }
        .directions {
            width: 2rem;
            cursor: pointer;
        }
    }
}
</style>