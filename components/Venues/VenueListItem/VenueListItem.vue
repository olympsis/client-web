<template>
    <div class="wrapper">
        <img :src="image" class="image" @click="visible = true"/>
        <div class="bottom">
            <div class="info">
                <div class="location">
                {{ city }}, {{ state }}
                </div>
                <div class="name">
                    {{ name }}
                </div>
            </div>
            
            <picture @click="openMaps" >
                <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/car/car.svg" class="directions">
            </picture>
        </div>
    </div>

    <Dialog 
        v-model:visible="visible" 
        position="center" 
        blockScroll
        :showHeader="false" 
        :style="{ 'top': '10px', 'height': '80vh', 'overflow-y': 'hidden'}"
    >
        <template #container="{ closeCallback }">
            <VenueDetailCard :venue="venue" :events="[]" @close="closeCallback"/>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import Dialog from 'primevue/dialog';
import { getDirections } from '~/utils/map-helpers';
import { Venue } from '@/data/models/VenueModels';
import { generateImageURL } from '~/utils/image-extensions';
import VenueDetailCard from '@/components/Venues/VenueDetailCard/VenueDetailCard.vue';

const props = defineProps({
    venue: { type: Venue, required: true }
});

const visible = ref(false);

const name = computed(() => {
    return props.venue.name
});

const city = computed(() => {
    return props.venue.city;
});

const state = computed(() => {
    return props.venue.state
});

const image = computed(() => {
    const images = props.venue.images
    if (images) {
        return generateImageURL(images[0]);
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
.wrapper {
    margin: 0rem 1rem;
    
    .image {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }

    .bottom {
        display: flex;
        align-items: end;
        justify-content: space-between;
        margin: 0.3rem 0rem;
        
        .info {
            display: flex;
            flex-direction: column;
            .location {
                color: gray;
            }
            .name {
                font-weight: 600;
                font-size: 1.2rem;
                font-style: normal;
                margin: unset;
                color: var(--primary-label-color);
            }
        }
        .directions {
            width: 2rem;
            cursor: pointer;
        }
    }
}

@media (max-width: 940px) {
    .wrapper {
        .image {
            border-radius: 10px;
        }
    }
}
</style>