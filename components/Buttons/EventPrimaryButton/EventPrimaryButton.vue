<template>
    <button id="event-primary-button" @click="$emit('click')">
        <!-- Pending Button -->
        <div v-if="eventState === EVENT_STATE.PENDING" id="pending" class="action">
            <!-- rsvp -->
            <div v-if="pendingState === EVENT_PENDING_STATE.RSVP" id="rsvp" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/mail/mail.white.svg"/>
                    <div> RSVP </div>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>

            <!-- waitlist -->
            <div v-if="pendingState === EVENT_PENDING_STATE.WAITLIST" id="waitlist" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/hourglass/hourglass.white.svg"/>
                    <div> Waitlist </div>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>

            <!-- cancel -->
            <div v-if="pendingState === EVENT_PENDING_STATE.CANCEL" id="cancel" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/xmark/xmark.white.svg"/>
                    <div> Cancel </div>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>
        </div>

        <!-- Live Button -->
        <div v-if="eventState === EVENT_STATE.LIVE" id="live" class="action">
            <img class="icon" src="@/assets/icons/circle/circle.fill.white.svg" :style="{ 'width': '2rem' }">
            <div> Live </div>
        </div>

        <!-- Completed Button -->
        <div v-if="eventState === EVENT_STATE.COMPLETED" id="completed" class="action">
            <img class="icon" src="@/assets/icons/block/block.white.svg">
            <div> Ended </div>
        </div>
    </button>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { Event } from '@/data/models/EventModels';
import { useSessionStore } from '@/stores/session-store';
import { EVENT_PENDING_STATE, EVENT_STATE } from '@/data/Enums';

const session = useSessionStore();

const emits = defineEmits(
    ['click']
);

const state = defineModel<VIEW_STATE>(
    'state',
    { default: VIEW_STATE.PENDING, required: true }
);

const event = defineModel<Event | undefined>(
    'event',
    { default: undefined, required: true }
);

const eventState = computed<EVENT_STATE>(() => {
    // Current timestamp in seconds (Unix timestamp)
    const timestamp = Math.floor(new Date().getTime() / 1000);
    
    // Convert time differences to seconds
    const thirtyMinutesAgo = timestamp - (30 * 60);
    const twoHoursAgo = timestamp - (2 * 60 * 60);
    
    // Get start and stop times, ensuring they're treated as seconds
    const startTime = (event.value?.startTime ?? 0);
    const stopTime = (event.value?.stopTime ?? 0);

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

const pendingState = computed<EVENT_PENDING_STATE>(() => {
    const user = session.user;
    const participants = event.value?.participants;
    const waitlist = event.value?.waitList;
    if (user) {
        const participant = participants?.find((p) => p.user?.uuid === user?.uuid);
        if (participant !== undefined) {
            return EVENT_PENDING_STATE.CANCEL;
        }

        const listed = waitlist?.find((p) => p.user?.uuid === user?.uuid);
        if (listed !== undefined) {
            return EVENT_PENDING_STATE.CANCEL;
        }
    }
    if (event.value?.maxParticipants && (participants?.length ?? 0) >= event.value?.maxParticipants) {
        return EVENT_PENDING_STATE.WAITLIST;
    } else {
        return EVENT_PENDING_STATE.RSVP;
    }
});
</script>

<style scoped>
#event-primary-button {
    all: unset;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action {
    width: 100%;
    display: flex;
    height: 5.5rem;
    cursor: pointer;
    min-width: 4rem;
    max-width: 15rem;
    border-radius: 10px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: var(--primary-label-color);
    background-color: var(--secondary-background-color);

    div {
        color: white;
        font-size: 0.85rem;
    }
}

.body {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.icon {
    width: 2.5rem;
    height: 2.5rem;
}

#rsvp {
    background-color: var(--primary-brand-color);
}

#waitlist {
    background-color: var(--tertiary-brand-color);
}

#cancel {
    background-color: var(--olympsis-red);
}

#completed {
    background-color: var(--olympsis-gray);
}

#live {
    background-color: var(--olympsis-red);
}
</style>