<template>
    <div id="chat-list-item">
        <div id="chat-header">
            <picture>
                <source srcset="@/assets/icons/dashboard/dashboard.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/dashboard/dashboard.svg"/>
            </picture>
        </div>
        <div id="chat-body">
            <div id="chat-group-name">{{ groupName }}</div>
            <div id="chat-name">{{ name }}</div>
        </div>
        <div v-if="!isMember" id="chat-trailing">
            <TextButton text="Join" success-text="Successful" failure-text="Failed" :model-value="joinButtonState" @click="joinRoom"/>
        </div>
    </div>
</template>

<script setup lang="ts">

import { VIEW_STATE } from '~/data/Enums';
import { Club } from '@/data/models/ClubModels';
import { ChatMember, ChatRoom } from '@/data/models/ChatModels';
import { computed, type ComputedRef, ref, type Ref } from 'vue';
import { useSessionStore } from '@/stores/session-store';
import { Organization } from '@/data/models/OrganizationModels';

import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const props = defineProps({
    room: ChatRoom
});

const session = useSessionStore();
const joinButtonState: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);
const group: Ref<Club | Organization | undefined> = ref(undefined);

const name: ComputedRef<string> = computed(() => {
    return props.room?.name ?? 'olympsis-chat';
});

const groupName: ComputedRef<string> = computed(() => {
    return group?.value?.name ?? 'Unknown';
});

const isMember: ComputedRef<boolean> = computed(() => {
    const userId = session.user?.userId;
    return props.room?.members.find((m) => m.userId == userId) !== undefined;
});

async function joinRoom() {
    if (props.room?.id) {
        joinButtonState.value = VIEW_STATE.LOADING;
        const hasJoined = await session.chatService.joinChatRoom(props.room?.id)
        if (hasJoined) {
            joinButtonState.value = VIEW_STATE.SUCCESS;
            props.room.members.push(
                new ChatMember(
                    '',
                    session.user?.userId ?? '',
                    'online',
                    Math.floor(Date.now() / 1000)
                )
            )
        } else {
            joinButtonState.value = VIEW_STATE.PENDING;
        }
    }
}

async function findGroup() {
    const local = session.groups.find((g) => {
        const group = g.club ? g.club : g.organization;
        return group?.id === props.room?.group.id;
    });
    if (local) {
        group.value = local.club ? local.club : local.organization;
    } else {
        if (props.room?.group.type === 'club' && props.room?.group.id) {
            const club = await session.clubService.getClub(props.room?.group.id);
            group.value = club;
        } else if(group.value?.id) {
            // TODO: - Define organization service later
        }
    }
}

findGroup();

</script>

<style scoped>
#chat-list-item {
    display: flex;
    cursor: pointer;
    flex-direction: row;
    align-items: center;

    #chat-header {
        width: 4rem;
        height: 4rem;
        display: flex;
        margin: 0rem 1rem;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-background-color);

        picture {
            height: 24px;
        }
    }

    #chat-body {
        margin-right: auto;
        
        #chat-group-name {
            color: gray;
        }

        #chat-name {
            font-size: 1.5rem;
            color: var(--primary-label-color);
        }
    }

    #chat-trailing {
        margin: 0rem 1rem;
        #loading-text-button {
            width: 4rem;
            height: 1.8rem;
        }
    }
}
</style>