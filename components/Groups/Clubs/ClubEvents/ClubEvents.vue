<template>
    <div id="club-events">
        <ul id="list">
            <EventListItem2 v-for="event in events" :event="event" @click="router.push(`/events/${event.id}`)"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';

import EventListItem2 from '~/components/Events/EventListItem-v2/EventListItem2.vue';

const props = defineProps({
    club: { type: Club, required: true }
});

const router = useRouter();
const session = useSessionStore();
const events = ref<Array<Event>>([]);

onMounted(() => {
    events.value = session.events.filter((e) => e.organizers.find((o) => o.id == props.club.id));
});
</script>

<style scoped>
#club-events {
    #list {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }
}
</style>