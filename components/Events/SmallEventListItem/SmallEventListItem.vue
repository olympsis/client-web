<template>
    <li class="small-event-list-item" @click="$emit('selected', { event: event })">
        <img class="image" :src="image">
        <div class="body">
            <div class="title">{{ event.title }}</div>
            <div class="start-date">{{ eventDateDisplay }}</div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';

const props = defineProps({
    event: { type: Event, required: true }
});
const image = computed(() => {
    return props.event.mediaURL ? generateImageURL(props.event.mediaURL) : undefined;
});

const eventDateDisplay = computed<string>(() => {
    const startTime = props.event.startTime;
    if (isThisWeek(startTime, new Date())) {
        return dateToString(startTime) + ' at ' + timeToString(startTime);
    }
    return dateToString(startTime) + ' at ' + timeToString(startTime);
});
</script>

<style scoped>
.small-event-list-item {
    display: flex;
    cursor: pointer;
    list-style: none;
    align-items: center;

    padding: 1rem;
    border-radius: var(--outer-border-radius);
    background-color: var(--secondary-background-color);

    .image {
        width: 5rem;
        height: 5rem;
        min-width: 5rem;
        border-radius: var(--inner-border-radius);
    }

    .body {
        margin-left: 1rem;

        .title {
            font-size: 1.2rem;
            font-weight: bold;
        }
        .start-date {
            color: gray;
        }

        @media (max-width: 350px) {
            .title {
                font-size: 1rem;
            }
            .start-date {
                font-size: 0.8rem;
            }
        }
    }
}
</style>