<template>
    <div id="event-participants-list-modal">

        <!-- List Header -->
        <div id="header">
            <h1>Participants</h1>

            <button class="button" @click="$emit('close')">
                <picture class="centered">
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>

        <SearchBar v-model:value="searchValue"/>
        
        <!-- Event Participants List -->
        <ul v-if="participants.length > 0" id="participants-list" >
            <ParticipantListItem 
                v-for="participant in participants" 
                :participant="participant" 
                :is-user="uuid === participant.user?.uuid"
                :is-admin="isAdmin"
                @kicked="handleKickParticipant"
            />
        </ul>

        <!-- Event WaitList -->
        <ul v-if="waitList.length > 0" id="wait-list" >
            <div id="label">Wait List</div>
            <ParticipantListItem 
                v-for="participant in waitList" 
                :participant="participant" 
                :is-user="uuid === participant.user?.uuid"
                :is-admin="isAdmin"
                @kicked="handleKickParticipant"
            />
        </ul>

        <!-- No Participants -->
        <div v-if="participants.length === 0 && waitList.length === 0" id="no-participants">
            No Participants
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '@/data/models/EventModels';
import { Participant } from '~/data/models/GenericModels';

import SearchBar from '~/components/SearchBar/SearchBar.vue';
import ParticipantListItem from '~/components/Events/ParticipantListItem/ParticipantListItem.vue';
import { GROUP_ROLE } from '~/data/Enums';
import { EventService } from '~/data/services/EventService';

const props = defineProps({
    event: { type: Event, required: true }
});

const session = useSessionStore();
const searchValue = ref<string>('');

const participants = computed<Participant[]>(() => {
    return props.event.participants.filter((p) => {
        return p.user?.username?.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase());
    });
});

const waitList = computed<Participant[]>(() => {
    return props.event.participantsWaitlist.filter((p) => {
        return p.user?.username?.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase())
    });
});

const uuid = computed<string | undefined>(() => {
    return session.user?.uuid;
});

const isAdmin = computed<boolean>(() => {
    const adminGroups = session.groups.filter((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return group.members?.find((m) => m.user?.uuid === uuid.value && m.role !== GROUP_ROLE.MEMBER);
    });
    return adminGroups.find((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return props.event.organizers.find((o) => o.id === group.id);
    }) != undefined;
});

async function handleKickParticipant(event: { participant: Participant }) {
    if (event.participant?.id == undefined) return;

    const service = new EventService();
    const isKicked = await service.removeParticipant(props.event.id, event.participant.id!);
    if (!isKicked) return;

    const idx = props.event.participants.findIndex((p) => p.id === event.participant.id);
    if (idx == -1) return;
    
    props.event.participants.splice(idx, 1);
}

</script>

<style scoped>
#event-participants-list-modal {
    min-width: 20rem;
    border-radius: 20px;
    max-width: var(--dialog-max-width);
    background-color: var(--primary-background-color);

    #header {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        justify-content: space-between;

        h1 {
            font-size: 1rem;
            font-weight: normal;
            white-space: nowrap;
            margin: auto;
            color: var(--primary-label-color);
        }
    }

    #search-bar {
        width: 90%;
        margin: 0 auto;
    }

    #participants-list {
        margin: 0rem;
        max-height: 25rem;
        overflow-y: scroll;
        padding: 0.5rem 0rem;
        list-style-type: none;

        li {
            margin: 1rem;
        }
    }

    #wait-list {
        margin: 0rem;
        max-height: 25rem;
        overflow-y: scroll;
        padding: 0.5rem 0rem;
        list-style-type: none;

        #label {
            width: 100%;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background-color: var(--tertiary-brand-color);
        }

        li {
            margin: 1rem;
        }
    }

    #no-participants {
        width: 100%;
        margin: auto;
        color: gray;
        margin: 1rem 0rem;
        text-align: center;
        font-style: italic;
        vertical-align: middle;
    }

    .centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>