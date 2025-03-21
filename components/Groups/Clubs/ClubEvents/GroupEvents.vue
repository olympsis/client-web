<template>
    <div id="group-events">
        <ul id="list">
            <EventListItem2 v-for="event in events" :event="event" @click="router.push(`/events/${event.id}`)"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { Group } from '~/types/group';
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';

import EventListItem2 from '~/components/Events/EventListItem/EventListItem.vue';

const props = defineProps<{
    group: Group
}>();

const router = useRouter();
const session = useSessionStore();
const events = ref<Array<Event>>([]);

onMounted(() => {
    events.value = session.events.filter((e) => e.organizers.find((o) => o.id == props.group.id));
});
</script>

<style scoped>
#group-events {
    #list {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }
}
</style>