<template>
    <NavigationBar/>
    <main id="chats-view">
        <!-- Header -->
         <div id="header">
            <div id="leading">
                <button @click="router.back()">
                    <picture>
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg"/>
                    </picture>
                </button>

                <h1> Group Chats </h1>
            </div>
            <div id="trailing">
                <button>
                    <picture>
                        <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/plus/plus.svg"/>
                    </picture>
                </button>
            </div>
            
        </div>
        
        <ul id="chats-list">
            <li v-for="room in chatRooms">
                <ChatListItem :room="room" @click="router.push(`/rooms/${room.id}`)"/>
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChatRoom } from '@/data/models/ChatModels';
import { computed, type ComputedRef, type Ref, ref } from 'vue';
import { useSessionStore } from '@/stores/session-store';

import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import ChatListItem from '@/components/Chats/ChatListItem/ChatListItem.vue';

const router = useRouter();
const session = useSessionStore();
const chatRooms: Ref<ChatRoom[]> = ref([]);

const groupIDs: ComputedRef<string[]> = computed(() => {
    const array: string[] = [];
    session.groups.forEach((g) => {
        const id = g.club?.id ?? g.organization?.id;
        if (id) {
            array.push(id);
        }
    });
    return array;
});

async function getGroupChats() {
    let rooms: ChatRoom[] = [];
    const promises: Promise<ChatRoom[]>[] = [];
    groupIDs.value.forEach(id => {
        promises.push(
            session.chatService.getChatRooms(id)
        )
    });

    Promise.allSettled(promises)
        .then((results) => {
            results.forEach((r) => {
                if (r.status === 'fulfilled') {
                    rooms = rooms.concat(r.value);
                }
            });
            chatRooms.value = rooms;
            session.chatRooms = rooms;
        });
}

if (session.chatRooms.length === 0) {
    getGroupChats();
} else {
    chatRooms.value = session.chatRooms;
}
</script>

<style scoped>
#chats-view {
    width: 100%;
    margin: 1rem 0rem;

    #header {
        width: 100%;
        display: flex;
        max-width: 32rem;
        margin: 0rem auto;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        #leading {
            display: flex;
            flex-direction: row;

            button {
                all: unset;
                cursor: pointer;
                margin-left: 1rem;
                margin-right: 0.5rem;

                * {
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            h1 {
                font-size: 1.5rem;
                color: var(--primary-label-color);
            }
        }

        #trailing {
            display: flex;
            align-items: center;
            justify-content: center;

            button {
                all: unset;
                cursor: pointer;
                margin: 0rem 1rem;

                * {
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }

    #chats-list {
        padding: 0;
        margin-top: 1rem;
        max-width: 32rem;
        margin: 0rem auto;
        overflow-y: scroll;
        list-style-type: none;

        li {
            margin: 0.5rem 0rem;
        }
    }
}
</style>