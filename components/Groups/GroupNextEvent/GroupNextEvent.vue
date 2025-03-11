<template>
    <div id="group-next-event">
        <h2>Next Event</h2>
        <EventListItem2 v-if="model" :event="model" @click="router.push(`/events/${model.id}`)"/>
        <div v-else id="no-event">
            <div>No Upcoming Events</div>
            <button @click="router.push('/events/new')">CREATE AN EVENT</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Event } from '~/data/models/EventModels';
import EventListItem2 from '~/components/Events/EventListItem-v2/EventListItem2.vue';

const model = defineModel<Event | undefined>('event', {
    required: true
});

const router = useRouter();
</script>

<style scoped>
#group-next-event {
    padding: 1rem;
    grid-area: event;
    border-radius: 10px;
    border: var(--component-border) solid 1px;
    background-color: var(--secondary-background-color);

    h2 {
        margin-bottom: 1rem;
    }
}

#no-event {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    button {
        border: unset;
        color: white;
        cursor: pointer;
        margin: 1rem 0rem;
        font-weight: bold;
        font-style: italic;
        border-radius: 16px;
        padding: 0.5rem 1rem;
        background-color: var(--primary-brand-color);
    }
}
</style>