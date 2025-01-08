<template>
    <div>
        <div v-if="state !== VIEW_STATE.LOADING" class="fields">
            <div class="header">
                <h2>Nearby Venues</h2>
                <h3>View All</h3>
            </div>
            <VenueListItem v-if="venues.length > 0" :venue="venues[0]"/>
            <div v-if="venues.length === 0" class="no-fields"> No venues nearby 😔 </div>
        </div>
        <div v-if="state === VIEW_STATE.LOADING" class="fields">
            <div class="header">
                <h2>Nearby Fields</h2>
                <h3>View All</h3>
            </div>
            <Skeleton class="mb-2 skeleton" style="width: 25rem; height: 18rem;"></Skeleton>
            <Skeleton class="mb-2 skeleton" style="width: 20rem; height: 1rem; margin-top: 0.5rem;"></Skeleton>
            <Skeleton class="mb-2 skeleton" style="width: 15rem; height: 1rem; margin-top: 0.5rem;"></Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Skeleton from 'primevue/skeleton';
import { VIEW_STATE } from '@/data/Enums';
import { Venue } from '@/data/models/VenueModels';
import VenueListItem from '../VenueListItem/VenueListItem.vue';

const props = defineProps<{
    venues: Venue[],
    state: VIEW_STATE
}>()

const venues = computed<Venue[]>(() => {
    return props.venues
});

</script>

<style scoped>
.fields {
    width: 100%;
    height: auto;
    align-self: flex-start;

    .header {
        margin: 1rem;
        display: flex;
        align-items: end;
        flex-direction: row;
        justify-content: space-between;
        color: var(--primary-label-color);
        font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
        
        h3 {
            font-weight: 200;
        }
    }

    .no-fields {
        display: flex;
        margin: 0rem 1rem;
        min-height: 15rem;
        border-radius: 10px;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-background-color);
    }

    .skeleton {
        border-radius: 10px;
        background-color: var(--secondary-background-color);
    }
}

</style>