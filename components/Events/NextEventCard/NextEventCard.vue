<template>
    <div id="next-event">
        <h2>Next Event</h2>
        
        <!-- Next Event -->
        <div v-if="event">
            <EventListItem :event="event" @click="router.push(`/events/${event.id}`)"/>
        </div>

        <!-- No Events -->
        <div v-else>
            <div class="holder">
                <a class="text"> No Upcoming Events </a>
                <button id="new-event" @click="$emit('create-event')">Create an Event</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Event } from '~/data/models/EventModels';
import EventListItem from '../EventListItem/EventListItem.vue';

const router = useRouter();
const props = defineProps({
    event: { type: Event }
})
</script>

<style scoped>
#next-event {
    h2 {
        font-weight: 500;
        font-size: 1.3rem;
        margin-bottom: 1rem;
        color: var(--primary-label-color);
    }
    .holder {
        display: flex;
        width: 100%;
        height: 8rem;
        padding: 1rem;
        align-items: center;
        border-radius: 10px;
        flex-direction: column;
        justify-content: center;
        background-color: var(--secondary-background-color);

        .text {
            font-weight: 300;
            font-size: 1rem;
            color: var(--primary-label-color);
        }

        #new-event {
            border: unset;
            cursor: pointer;
            margin-top: 0.5rem;
            border-radius: 10px;
            padding: 0.5rem 1rem;

            font-weight: bold;
            color: white;
            background-color: var(--primary-brand-color);
        }
    }
}
</style>