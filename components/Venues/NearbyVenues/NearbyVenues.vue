<template>
    <div id="nearby-venues">
        <div id="header">
            <h3> Nearby Venues </h3>
        </div>
        <ul id="list">
            <VenueListItem v-for="venue in venues" :venue="venue" @selected="handleSelectedVenue"/>
        </ul>

        <Dialog 
            v-model:visible="visible" 
            position="center" 
            blockScroll
            :showHeader="false" 
            :style="{ 'top': '10px', 'height': '80vh', 'overflow-y': 'hidden'}"
        >
            <template #container="{ closeCallback }">
                <VenueDetailCard v-if="selectedVenue != undefined" :venue="selectedVenue" :events="[]" @close="closeCallback"/>
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { Venue } from '~/data/models/VenueModels';

import Dialog from 'primevue/dialog';
import VenueListItem from '../VenueListItem/VenueListItem.vue';
import VenueDetailCard from '../VenueDetailCard/VenueDetailCard.vue';

defineProps({
    venues: { type: Array<Venue>, required: true }
});

const visible = ref(false);
const selectedVenue = ref<Venue | undefined>(undefined);

function handleSelectedVenue(event: { venue: Venue }) {
    selectedVenue.value = event.venue;
    visible.value = true;
}
</script>

<style scoped>
#nearby-venues {
    #header {
        h3 {
            font-weight: 600;
            margin-left: 1rem;
            margin-bottom: 0.5rem;
        }
    }

    #list {
        width: 100%;
        display: flex;
        padding: unset;
        overflow-x: scroll;
        padding: 0.5rem 0rem;
        list-style-type: none;

        li {
            margin: 0.5rem;
        }

        li:last-child {
            margin-right: 1rem;
        }
    }

    #no-events {
        width: 100%;
        height: 24rem;
    }

    @media (max-width: 970px) {
        width: 100vw;
    }
}
</style>