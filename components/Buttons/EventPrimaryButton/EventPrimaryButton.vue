<template>
    <button id="event-primary-button" @click="$emit('click')">
        <!-- Pending Button -->
        <div v-if="eventState === EVENT_STATE.PENDING" id="pending" class="action">
            <!-- rsvp -->
            <div v-if="pendingState === EVENT_PENDING_STATE.RSVP" id="rsvp" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/mail/mail.white.svg"/>
                    <p> RSVP </p>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>

            <!-- waitlist -->
            <div v-if="pendingState === EVENT_PENDING_STATE.WAITLIST" id="waitlist" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/hourglass/hourglass.white.svg"/>
                    <p> Waitlist </p>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>

            <!-- cancel -->
            <div v-if="pendingState === EVENT_PENDING_STATE.CANCEL" id="cancel" class="action">
                <div v-if="state === VIEW_STATE.PENDING" class="body">
                    <img class="icon" src="@/assets/icons/xmark/xmark.white.svg"/>
                    <p> Cancel </p>
                </div>
                <div v-if="state === VIEW_STATE.LOADING" class="body spinner-loader"/>
            </div>
        </div>

        <!-- Live Button -->
        <div v-if="eventState === EVENT_STATE.LIVE" id="live" class="action">
            <img class="icon" src="@/assets/icons/circle/circle.fill.white.svg" :style="{ 'width': '2rem' }">
            <p :style="{color:'white'}"> Live </p>
        </div>

        <!-- Completed Button -->
        <div v-if="eventState === EVENT_STATE.COMPLETED" id="completed" class="action">
            <img class="icon" src="@/assets/icons/block/block.white.svg">
            <p :style="{ color: 'white' }"> Ended </p>
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
    const timestamp = Math.floor(new Date().getTime());
    
    // Convert time differences to seconds
    const thirtyMinutesAgo = timestamp - (30 * 60);
    
    // Get start and stop times, ensuring they're treated as seconds
    const startTime = (event.value?.startTime.getTime() ?? 0);
    const stopTime = (event.value?.stopTime.getTime() ?? 0);

    if (stopTime !== 0 && stopTime < timestamp) {
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
    if (user) {
        const participant = participants?.find((p) => p.user?.uuid === user?.uuid);
        if (participant !== undefined) {
            return EVENT_PENDING_STATE.CANCEL;
        }
    }
    if (event.value?.participantsConfig?.maxParticipants && (participants?.length ?? 0) >= event.value?.participantsConfig?.maxParticipants) {
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

    p {
        font-weight: bold;
    }
}

.action {
    width: 100%;
    display: flex;
    height: 5.5rem;
    cursor: pointer;
    min-width: 4rem;
    max-width: 15rem;
    border-radius: 20px !important;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: var(--primary-label-color);
    border: var(--component-border-color) solid 1px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12);

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

/* #pending is just a wrapper — strip its glass so only the inner state div renders a border */
#pending {
    border: none;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
}

#rsvp {
    background: rgba(38, 46, 87, 0.85); /* --primary-brand-color with transparency */
}

#waitlist {
    background: rgba(247, 160, 7, 0.85); /* --tertiary-brand-color with transparency */
}

#cancel {
    background: rgba(213, 0, 32, 0.85); /* --olympsis-red with transparency */
}

#completed {
    background: rgba(118, 118, 118, 0.85); /* --olympsis-gray with transparency */
}

#live {
    background: rgba(213, 0, 32, 0.85); /* --olympsis-red with transparency */
}
</style>