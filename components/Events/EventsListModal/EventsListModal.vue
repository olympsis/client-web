<template>
    <div class="container">
        <div class="header">
            <div class="button" @click="closeModal">
                <picture>
                    <source srcset="@assets/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@assets/xmark.svg">
                </picture>
            </div>

            <h4 class="title"> Nearby Events </h4>

            <div class="button" :style="{ 'margin-left': 'auto' }">
                <picture>
                    <source srcset="@assets/chevron.right.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@assets/chevron.right.svg">
                </picture>
            </div>
        </div>

        <!-- Events List -->
        <ScrollPanel :style="{ height: '19rem' }">
            <div class="events">
                <Suspense>
                    <EventListItem v-for="event in events" :key="event.id" :event="event" @selected="handleSelectedEvent"/>
                </Suspense>
            </div>
        </ScrollPanel>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Event } from '~/data/models/EventModels';

import ScrollPanel from 'primevue/scrollpanel';
import EventListItem from '../EventListItem/EventListItem.vue';

const router = useRouter();
const props = defineProps({
    events: { type: Array<Event>, required: true }
});

const emit = defineEmits([
    "close",
    "selected"
]);

const showSelectedEvent = ref(false);

let selectedEvent: Ref<Event>;

function closeModal() {
    emit("close");
};

function handleSelectedEvent(event: any) {
    router.push(`/events/${event.event.id}`);
}
</script>

<style scoped>
.container {
    height: 20rem;
    overflow: hidden;
    background-color: var(--primary-background-color);

    .header {
        display: flex;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        padding: 1rem;
        position: absolute;
        align-items: center;
        box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.5);
        background-color: var(--primary-background-color);

        .title {
            margin: 0rem 1rem;
            color: var(--primary-label-color);
        }

        .button {
            width: 1.5rem;
            height: 1.5rem;
            cursor: pointer;
        }
    }

    .events {
        gap: 10px;
        padding: 20px;
        display: grid;
        margin-top: 3rem;
        overflow-y: scroll;
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 70rem) {
        .events {
            grid-template-columns: 1fr;
        }
    }
}
</style>