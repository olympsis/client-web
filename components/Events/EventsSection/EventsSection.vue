<template>
    <div id="events-section">
        <div id="header">
            <h3> {{ title }} </h3>
        </div>
        <ul id="list">
            <EventListItem2 v-for="event in events" :event="event" @selected="router.push(`/events/${event.id}`)"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';
import EventListItem2 from '../EventListItem-v2/EventListItem2.vue';

defineProps({
    title: { type: String, default: "Next Events" },
    events: { type: Array<Event>, required: true }
});

const router = useRouter();
</script>

<style scoped>
#events-section {
    width: 100%;
    margin: 1rem 0rem;

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
        overflow-x: scroll;
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
}
</style>