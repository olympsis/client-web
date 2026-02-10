<template>
    <div id="events-section">
        <div id="header">
            <h4> {{ title }} </h4>
        </div>
        <ul v-if="state != VIEW_STATE.LOADING" id="list">
            <EventListItem2 v-for="event in events" :event="event" @selected="router.push(`/events/${event.id}`)"/>
        </ul>

        <ul v-else id="list">
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
            <Skeleton class="skeleton"></Skeleton>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';
import { Event } from '~/data/models/EventModels';

import Skeleton from 'primevue/skeleton';
import EventListItem2 from '../EventListItem/EventListItem.vue';

defineProps({
    title: { type: String, default: "" },
    events: { type: Array<Event>, required: true }
});

const state = defineModel<VIEW_STATE>('state', {
    default: VIEW_STATE.LOADING,
    required: true,
});

const router = useRouter();
</script>

<style scoped>
#events-section {
    width: 100%;
    grid-area: next;
    margin: 1rem 0rem;

    #header {
        h4 {
            font-weight: 600;
            margin-left: 1rem;
            margin-bottom: 0.5rem;
        }
    }

    #list {
        width: 100%;
        display: flex;
        overflow-x: scroll;
        border-radius: 10px;
        padding: 0.5rem 0rem;

        li {
            margin: 0rem 0.5rem;
        }
    }

    #no-events {
        flex: 1;
        width: 100%;
        display: flex;
        height: 15rem;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        #action {
            cursor: pointer;
            margin-top: 1rem;
            font-weight: bold;
            font-style: italic;
            border-radius: 10px;
            padding: 0.5rem 1rem;
            font-family: 'Archivo';
            text-transform: uppercase;
            background-color: var(--primary-brand-color);
        }
    }

    @media (max-width: 970px) {
        width: 100vw;
    }

    .skeleton {
        min-width: 20rem;
        max-width: 23rem;
        border-radius: 10px;
        margin: 0rem 0.5rem;
        height: 25rem !important;
        box-shadow: var(--component-border) 0px 1px 4px;
    }
}
</style>