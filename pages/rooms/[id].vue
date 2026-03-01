<template>
    <main id="chat-room">
        <!-- Chat Room Header -->
        <div id="header">
            <div id="leading">
                <picture @click="router.push('/rooms')">
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg"/>
                </picture>

                <h1>{{ roomName }}</h1>
                <h2>{{ groupName }}</h2>
            </div>
            <div id="trailing">
                <picture>
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg"/>
                </picture>
            </div>
        </div>
        
        <!-- Chat Room Messages -->
        <ul id="body" ref="messageContainer">
            <li v-for="message in messages" :key="message.id">
                <MessageBubble :message="message" :is-user="message.sender === session.user?.uuid"/>
            </li>
        </ul>

        <!-- Chat Room Footer -->
        <div id="footer">
            <input id="message-input" type="text" v-model="text"/>
            <button @click="handleSend">
                <img src="@/assets/icons/send/send.white.svg"/>
            </button>
        </div>
    </main>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { VIEW_STATE } from '@/data/Enums';
import { Club } from '@/data/models/ClubModels';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session-store';
import { Organization } from '@/data/models/OrganizationModels';
import { ChatMessage, ChatRoom } from '@/data/models/ChatModels';
import { computed, type ComputedRef, nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue';

import MessageBubble from '@/components/Chats/MessageBubble/MessageBubble.vue';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

let socket: WebSocket;

const text: Ref<string> = ref('');
const messageContainer = ref<HTMLElement | null>(null);
const state: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);
const sendState: Ref<VIEW_STATE> = ref(VIEW_STATE.PENDING);

const messages: Ref<ChatMessage[]> = ref([]);
const room: Ref<ChatRoom | undefined> = ref(undefined);
const group: Ref<Club | Organization | undefined> = ref(undefined);

const roomID: ComputedRef<string> = computed(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id;
});

const roomName: ComputedRef<string> = computed(() => {
    return room.value?.name ?? 'Chat Room';
});

const groupName: ComputedRef<string> = computed(() => {
    return group.value?.name ?? 'Unknown';
});

async function fetchRoomData() {
    const local = session.chatRooms.find((r) => r.id === roomID.value);
    if (local) {
        room.value = local;
    } else {
        const resp = await session.chatService.getChatRoom(roomID.value)
        if (resp) {
            room.value = resp;
        }
    }
}

async function fetchGroupData() {
    const local = session.groups.find((g) => {
        const group = g.club ? g.club : g.organization;
        return group?.id == room.value?.group.id;
    });
    if (local) {
        group.value = local.club ? local.club : local.organization;
    } else {
        if (room.value?.group.type === 'club' && room.value.group.id) {
            const club = await session.clubService.getClub(room.value.group.id);
            group.value = club;
        } else if(group.value?.id) {
            // TODO: - Define organization service later
        }
    }
}

async function loadData() {
    state.value = VIEW_STATE.LOADING;
    await fetchRoomData()
    await fetchGroupData();
    messages.value = room.value?.history ?? [];
    state.value = VIEW_STATE.SUCCESS
}

async function scrollToBottom(){
    await nextTick();
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
};

async function initializeSocket() {
    const config = useRuntimeConfig();
    socket = new WebSocket(`wss://${config.public.API}/v1/chats/${roomID.value}/ws`);

    socket.addEventListener('open', () => {
        console.log('Websocket opened!');
        authenticateSocket();
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const message = ChatMessage.decode(data);
        messages.value.push(message);
    });

    socket.addEventListener('error', (error) => {
        debugger;
    });

    socket.addEventListener('close', () => {
        console.log('Websocket closed!')
    });
}

async function authenticateSocket() {
    if (socket) {
        const token = await getAuth().currentUser?.getIdToken() ?? '';
        socket.send(JSON.stringify({
            token: token
        }));
        console.log('Websocket authenticated!');
    }
}

function closeSocket() {
    socket.close(1000, 'leaving-view');
}

async function handleSend() {
    if (text.value.length == 0 || sendState.value === VIEW_STATE.LOADING) return;

    sendState.value = VIEW_STATE.LOADING;
    try {
        const message = {
            type: 'text',
            body: text.value.trim(),
            sender: session.user?.uuid,
        };

        socket.send(JSON.stringify(message));

        text.value = '';
        sendState.value = VIEW_STATE.SUCCESS;
    } catch (error) {
        console.error('Error sending message:', error);
        sendState.value = VIEW_STATE.FAILURE;
    }
}

onMounted(async () => {
    await loadData();
    await initializeSocket();
    scrollToBottom();
});

onUnmounted(() => {
    closeSocket();
});

</script>

<style scoped>
#chat-room {
    width: 100%;

    #header {
        display: flex;
        max-width: 32rem;
        margin: 1rem auto;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;

        #leading {
            display: flex;
            align-items: center;
            flex-direction: row;

            picture {
                height: 24px;
                cursor: pointer;
                margin-left: 1rem;
                margin-right: 0.5rem;
            }

            h1 {
                font-size: 1.5rem;
                color: var(--primary-label-color);
            }

            h2 {
                color: gray;
                font-size: 1rem;
                margin-left: 0.5rem;
            }
        }

        #trailing {
            display: flex;
            align-items: center;

            picture {
                height: 24px;
                cursor: pointer;
                margin: 0rem 1rem;
            }
        }
    }

    #body {
        height: 100%;
        padding: 0rem;
        max-width: 32rem;
        margin: 0rem auto;
        list-style-type: none;
        height: calc(100vh - 11rem);

        li {
            margin: 1rem 0.5rem;
        }
    }

    #footer {
        width: 100%;
        display: flex;
        max-width: 32rem;
        margin: 0rem auto;
        justify-content: space-around;

        input {
            width: 85%;
            border: unset;
            font-size: 1rem;
            padding: 0rem 0.5rem;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--secondary-background-color);
        }

        button {
            all: unset;
            height: 2rem;
            width: 2.2rem;
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            border-radius: var(--button-border-radius);
            background-color: var(--primary-brand-color);

            img {
                width: 1.5rem;
            }
        }
    }
}
</style>