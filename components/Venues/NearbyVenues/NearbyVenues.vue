<template>
    <div id="nearby-venues">
        <div id="header">
            <h3> Nearby Venues </h3>
        </div>
        <ul id="list">
            <VenueListItem v-for="venue in venues" :venue="venue"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Venue } from '~/data/models/VenueModels';
import VenueListItem from '../VenueListItem/VenueListItem.vue';

defineProps({
    venues: { type: Array<Venue>, required: true }
});
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

    @media (max-width: 970px) {
        width: 100vw;
    }
}
</style>