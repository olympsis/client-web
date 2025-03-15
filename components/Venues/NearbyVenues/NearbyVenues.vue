<template>
    <div id="nearby-venues">
        <div id="header">
            <h3> Nearby Venues </h3>
        </div>
        <ul v-if="state !== VIEW_STATE.LOADING" id="list">
            <VenueListItem v-for="venue in venues" :venue="venue" @selected="handleSelectedVenue"/>
        </ul>

        <ul v-else id="list">
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
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
import { VIEW_STATE } from '~/data/Enums';
import { Venue } from '~/data/models/VenueModels';

import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import VenueListItem from '../VenueListItem/VenueListItem.vue';
import VenueDetailCard from '../VenueDetailCard/VenueDetailCard.vue';

defineProps({
    venues: { type: Array<Venue>, required: true }
});

const state = defineModel<VIEW_STATE>('state', {
    default: VIEW_STATE.LOADING,
    required: true,
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
        border-radius: 10px;
        list-style-type: none;
        padding: 0rem 0rem 0.5rem 0rem;

        li {
            margin: 0.5rem;
        }

        li:last-child {
            margin-right: 1rem;
        }
    }

    @media (max-width: 970px) {
        width: 100vw;
    }

    .skeleton {
        min-width: 22rem;
        max-width: 25rem;
        margin: 0rem 1rem;
        border-radius: 10px;
        height: 20rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}
</style>