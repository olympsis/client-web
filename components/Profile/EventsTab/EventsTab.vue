<template>
    <div id="events-tab">
        <ul id="list">
            <EventListItem2 v-for="event in events" :event="event" @click="router.push(`/events/${event.id}`)"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';
import EventListItem2 from '~/components/Events/EventListItem-v2/EventListItem2.vue';

defineProps({
    events: { type: Array<Event>, required: true }
});

const router = useRouter();
</script>

<style scoped>
#events-tab {
    #list {
        gap: 1rem;
        padding: 0rem;
        display: flex;
        overflow-y: scroll;
    }
}
</style>