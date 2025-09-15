<template>
    <div id="participants-peek">
        <h2>{{ event.participants.length + " " + displayString }}</h2>
        <ul v-if="!hideParticipants" id="participants">
            <ParticipantListItem 
                v-for="participant in event.participants.slice(0, 3)"
                :participant="participant" 
                :is-user="session.user?.uuid === participant.user?.uuid"
                :is-admin="isAdmin"
            />
        </ul>
        <div v-if="hideParticipants" id="hidden">
            <div>RSVP to see participants</div>
        </div>

        <div id="more" v-if="event.participants.length > 3" @click="$emit('open-participants')">{{ "+" + (event.participants.length - 3) + " More" }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Event } from '@/data/models/EventModels';
import { EVENT_STATE, GROUP_ROLE } from '~/data/Enums';
import ParticipantListItem from '../ParticipantListItem/ParticipantListItem.vue';

const session = useSessionStore();

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

const isAdmin = computed<boolean>(() => {
    const adminGroups = session.groups.filter((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return group.members?.find((m) => m.user?.uuid === session.user?.uuid && m.role !== GROUP_ROLE.MEMBER);
    });
    return adminGroups.find((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return props.event.organizers.find((o) => o.id === group.id);
    }) != undefined;
});

const hideParticipants = computed<boolean>(() => {
    if (isAdmin.value || props.event.participants.find((p) => p.user?.uuid == session.user?.uuid)) return false;
    return props.event.participantsConfig?.hideParticipants ?? false;
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

    #hidden {
        width: 100%;
        height: 15rem;
        display: flex;
        align-items: center;
        background-color: var(--secondary-background-color);

        div {
            width: 100%;
            height: 2rem;
            display: flex;
            color: black;
            font-weight: 500;
            align-items: center;
            justify-content: center;
            background-color: white;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
    }

    #more {
        cursor: pointer;
        font-weight: bold;
        margin-top: 0.5rem;
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