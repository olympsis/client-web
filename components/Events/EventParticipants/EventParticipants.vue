<template>
    <div id="participants-peek">
        <h2>{{ event.participants.length + " " + displayString }}</h2>
        <ul id="participants">
            <li class="participant" v-for="participant in event.participants">
                <UserIcon 
                    :user="participant.user" 
                    :size="2" 
                    :style="{ 'height': '2.5rem' }"
                    :class="{ 'yes': participant.status === EVENT_RSVP_STATUS.YES, 'maybe': participant.status === EVENT_RSVP_STATUS.MAYBE }"
                />
                <div class="name">{{ participant.user?.username ?? 'olympsis-user' }}</div>
            </li>
        </ul>

        <div id="more" v-if="event.participants.length > 5" @click="$emit('show-participants')">{{ "+" + (event.participants.length - 5) + " More" }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { Event } from '@/data/models/EventModels';
import { EVENT_RSVP_STATUS, EVENT_STATE } from '~/data/Enums';

import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    event: { type: Event, required: true }
});

const eventState = computed<EVENT_STATE>(() => {
    const now = new Date().getTime();
    const thirtyMinutesAgo = now - (30 * 60 * 1000);
    const twoHoursAgo = now - (2 * 60 * 60 * 1000);

    const startTime = props.event?.startTime ? props.event.startTime.getTime() : 0;
    const stopTime = props.event?.stopTime ? props.event.stopTime.getTime() : 0;

    if (
        (stopTime !== 0 && stopTime < now) ||
        (startTime !== 0 && startTime < twoHoursAgo)
    ) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== 0 && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});

const displayString = computed<string>(() => {
    return eventState.value != EVENT_STATE.COMPLETED ? "Going" : "Went" ;
});

</script>

<style scoped>
#participants-peek {
    overflow-x: scroll;
    flex-direction: column;
    grid-area: participants;

    #participants {
        padding: 0rem;
        list-style-type: none;

        .participant {
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
                font-weight: bold;
                margin-left: 2rem;
            }
        }
    }

    #more {
        font-weight: bold;
    }

    * {
        width: fit-content;
        margin-top: 0.25rem;
        margin-right: -1.5rem;
    }

    .yes {
        border: 0.25rem solid var(--primary-brand-color);
    }

    .maybe {
        border: 0.25rem solid var(--secondary-brand-color);
    }
}
</style>