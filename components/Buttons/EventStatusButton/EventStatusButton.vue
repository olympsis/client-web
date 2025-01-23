<template>
    <button id="event-status-button" @click="$emit('click')">
        <div v-if="eventState === EVENT_STATE.LIVE" id="stop">
            <div v-if="state === VIEW_STATE.PENDING" class="pending">
                <img :src="imageURL">
                <div class="text"> Stop Event </div>
            </div>
            <div v-if="state === VIEW_STATE.LOADING" class="event-status-loader loading"/>
        </div>
        <div v-else id="start">
            <div v-if="state === VIEW_STATE.PENDING" class="pending">
                <img :src="imageURL">
                <div class="text"> Start Event </div>
            </div>
            <div v-if="state === VIEW_STATE.LOADING" class="event-status-loader loading"/>
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Event } from '@/data/models/EventModels';
import { VIEW_STATE } from '@/data/Enums';
import { EVENT_STATE } from '@/data/Enums';

const props = defineProps({ 
    event: { type: Event, required: true }
});
const state = defineModel<VIEW_STATE>(
    { default: VIEW_STATE.LOADING, required: true }
);
const emits = defineEmits(
    [
        'click'
    ]
);
const imageURL = computed<string>(() => {
    return eventState.value === EVENT_STATE.LIVE ? '/icons/stop/stop.white.svg':'/icons/play/play.white.svg';
})
const eventState = computed<EVENT_STATE>(() => {
    // Current timestamp in seconds (Unix timestamp)
    const timestamp = Math.floor(new Date().getTime() / 1000);
    
    // Convert time differences to seconds
    const thirtyMinutesAgo = timestamp - (30 * 60);
    const twoHoursAgo = timestamp - (2 * 60 * 60);
    
    // Get start and stop times, ensuring they're treated as seconds
    const startTime = (props.event?.startTime ?? 0);
    const stopTime = (props.event?.stopTime ?? 0);

    if (
        (stopTime !== 0 && stopTime < timestamp) ||
        (startTime !== 0 && startTime < twoHoursAgo)
    ) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== 0 && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});
</script>

<style scoped>
#event-status-button {
    padding: 0;
    border: unset;
    height: 2.5rem;
    border-radius: 10px;

    &:hover {
        transform: scale(1.025);
    }

    #start {
        height: 100%;
        display: flex;
        padding: 0rem 1rem;
        border-radius: 10px;
        align-items: center;
        background-color: var(--olympsis-green);
    }

    #stop {
        height: 100%;
        display: flex;
        padding: 0rem 1rem;
        border-radius: 10px;
        align-items: center;
        background-color: var(--olympsis-red);
    }

    .pending {
        width: 100%;
        display: flex;
        cursor: pointer;
        align-items: center;
    }

    .loading {
        cursor: progress;
    }

    .text {
        color: white;
        font-weight: 900;
        font-size: 1.25rem;
        font-style: italic;
        text-transform: uppercase;
    }
    
}
</style>