<template>
    <NavigationBar/>
    <main id="group-view">
        <!-- Selected Group Info -->
        <div v-if="selectedGroup" class="info" :style="{ 'margin-top': '1rem' }">
            <GroupIcon :type="groupType" :image="groupLogo" :size="4"/>
            <a class="name">{{ selectedGroup.club?.name ?? selectedGroup.organization?.name }}</a>
        </div>

        <!-- Next Event Card -->
        <NextEventCard :event="nextEvent" class="event" @create-event="handleShowNewEventModal"/>

        <!-- Navigation Card -->
        <NavigationCard class="nav-card" :state="state"/>

        <!-- Feed -->
        <div id="feed-container">
            <div id="mobile-header" v-if="selectedGroup">
                <h1 class="name">
                    {{ selectedGroup.club?.name ?? selectedGroup.organization?.name }}
                </h1>

                <div id="mobile-actions">
                    <button @click="menu?.toggle">
                        <img class="action-button" src="@/assets/icons/plus/plus.white.svg">
                    </button>
                    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"></Menu>

                    <button @click="handleGroupSharing">
                        <img class="action-button" src="@/assets/icons/share/share.white.svg">
                    </button>

                    <button @click="router.push('/groups/settings')">
                        <img src="@/assets/icons/gear/gear.white.svg">
                    </button>
                </div>
            </div>

            <NextEventCard :event="nextEvent" @create-event="handleShowNewEventModal"/>
            <PostFeed ref="feed"/>
        </div>

        <!-- Group Actions -->
        <div class="actions">
            <img class="action-button" src="@/assets/icons/plus/plus.white.svg" @click="menu?.toggle">
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"></Menu>

            <img
                class="action-button"
                src="@/assets/icons/share/share.white.svg" 
                :style="{ 'margin-top': '0.3rem' }"
                @click="handleGroupSharing"
            >

            <img 
                class="action-button" 
                src="@/assets/icons/gear/gear.white.svg" 
                @click="router.push('/groups/settings')"
            >
        </div>
        
        <!-- Groups Selector -->
        <div class="groups">
            <h2>Groups</h2>
            <GroupSelector 
                :state="state"
                @selectedGroupChanged="handleSelectedGroupChanged" 
            />
        </div>

        <!-- Members Card -->
        <div class="members" v-if="state !== VIEW_STATE.LOADING">
            <h2>Members</h2>
            <MembersListCard :members="members"/>
        </div>
        
        <!-- New Post Modal -->
        <dialog id="new-post-modal" ref="new-post-modal" class="dialog">
            <NewPostView  @close="postCardModalRef?.close()" @created="handleNewPost"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { ref, computed, useTemplateRef } from 'vue';
import { GROUP_TYPE, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { useGroupsViewModel } from '@/stores/groups-view-model';

import Menu from 'primevue/menu';
import PostFeed from '@/components/Posts/PostFeed/PostFeed.vue';
import GroupIcon from '@/components/Groups/GroupIcon/GroupIcon.vue';
import NewPostView from '@/components/Posts/NewPostView/NewPostView.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import NavigationCard from '@/components/NavigationCard/NavigationCard.vue';
import NextEventCard from '@/components/Events/NextEventCard/NextEventCard.vue';
import GroupSelector from '@/components/Groups/GroupSelector/GroupSelector.vue';
import MembersListCard from '@/components/Groups/MembersListCard/MembersListCard.vue';

const toast = useToast();
const router = useRouter();

const sessionStore = useSessionStore();
const viewModel = useGroupsViewModel();

const menu = useTemplateRef('menu');
const feed = useTemplateRef<typeof PostFeed>('feed');

const items = ref([
    {
        label: 'Create a New?',
        items: [
            {
                label: 'Post',
                icon: 'pi pi-plus',
                command: () => {
                    postCardModalRef.value?.show();
                }
            },
            {
                label: 'Event',
                icon: 'pi pi-calendar',
                command: () => {
                    handleShowNewEventModal()
                }
            }
        ]
    }
]);

/**
 * I truly do want it to fetch post data on anytime we navigate here.
 * Eventually I will be more tactful about only fetching more instead of invalidating our client side data.
 */
onMounted(() => {
    viewModel.loadNextPosts();
});

const showGroupSelector = ref(false);

const postCardModalRef = useTemplateRef<HTMLDialogElement>('new-post-modal');
const eventCardModalRef = useTemplateRef<HTMLDialogElement>('new-event-modal');

const selectedGroup = computed(() => {
    return sessionStore.selectedGroup
});

const state = computed<VIEW_STATE>(() => {
    return viewModel.state;
});

const nextEvent = computed<Event | undefined>(() => {
    return sessionStore.events
        .filter((e) => e.participants?.find((p) => p.user?.uuid === sessionStore.user?.uuid))
        .sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))
        [0];
});

const groups = computed(() => {
    return sessionStore.groups
});

const groupType = computed(() => {
    return sessionStore.selectedGroup?.type ?? GROUP_TYPE.CLUB;
});

const groupLogo = computed(() => {
    const group = sessionStore.selectedGroup?.club ?? sessionStore.selectedGroup?.organization;
    const image = group?.logo;
    return image ?? '';
});

const members = computed(() => {
    return (selectedGroup.value?.club?.members ?? selectedGroup.value?.organization?.members) ?? [];
});

const groupName = computed<string>(() => {
    const group = sessionStore.selectedGroup?.club ?? sessionStore.selectedGroup?.organization;
    return group?.name ?? 'Group';
});

function handleSelectedGroupChanged(event: any) {
    showGroupSelector.value = false
    viewModel.changeSelectedGroup(event.group);
}

function handleShowNewEventModal() {
    router.push('/events/new');
}

async function handleGroupSharing() {
    const groupID = selectedGroup.value?.club?.id ?? selectedGroup.value?.organization?.id ?? '';
    await navigator.clipboard.writeText(`https://olympsis.com/groups/search/${groupID}`);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this group!', life: 3000 });
}

function handleNewPost(event: any) {
    feed.value?.handleNewPost(event.newPost);
    postCardModalRef.value?.close();
}

useSeoMeta({
    title: () => `${groupName.value} | Olympsis`,
    ogTitle: () => `${groupName.value} | Olympsis`,
    description: 'Join groups around the sports you love!',
    ogDescription: 'Join groups around the sports you love'
});

definePageMeta({
    key: route => route.fullPath
});

</script>

<style scoped>
#group-view {
    display: grid;
    overflow: hidden;
    width: fit-content;
    grid-template-areas:
    'name feed actions'
    'event feed groups'
    'chats feed members'
    'footer feed members'
    ;
    
    gap: 2rem;
    margin: 0 auto;
    cursor: pointer;
    padding: 0rem 3rem;
    height: calc(100dvh - 60px);
    grid-template-rows: 6rem 16rem 23rem;
    grid-template-columns: 25rem 35rem 25rem;

    .info {
        grid-area: name;
        display: flex;
        align-items: center;
        flex-direction: row;
        
        a {
            margin: 0rem 1rem;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-label-color);
        }
    }

    .event {
        grid-area: event;
    }

    .chats {
        grid-area: chats;

        h2 {
            margin-bottom: 1rem;
            color: var(--primary-label-color);
        }
        .list {
            width: 25rem;
            height: 15rem;
            border-radius: 10px;
            background-color: var(--secondary-background-color);
        }
    }

    .nav-card {
        margin-top: auto;
        grid-area: footer;
        margin-bottom: 4.5rem;
    }

    .feed {
        grid-area: feed;
    }
    #feed-container {
        height: 100dvh;
        grid-area: feed;
        overflow-y: scroll;

        #header {
            display: none;
        }

        #next-event {
            display: none;
        }
    }

    .actions {
        grid-area: actions;
        display: flex;
        width: 25rem;
        padding: 0.5rem;
        margin-top: 1rem;
        align-items: center;
        height: fit-content;
        border-radius: 10px;
        justify-content: space-around;
        background-color: var(--primary-brand-color);

        .action-button {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
        }
    }

    .groups {
        grid-area: groups;

        h2 {
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--primary-label-color);
        }
    }

    .members {
        grid-area: members;

        h2 {
            margin-bottom: 1rem;
            color: var(--primary-label-color);
        }
    }

    .button {
        display: none;
    }
}

#mobile-header {
    display: none;
    grid-area: header;

    h1 {
        max-width: 55vw;
        overflow: hidden;
        white-space: none;
        text-wrap: nowrap;
        text-overflow: ellipsis;
    }
}

#new-event-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #new-event-card {
        border-radius: 20px;
        max-width: 35rem;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);

        @media (max-width: 940px) {
            max-width: 25rem;
        }
    }
}

#new-post-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #new-post-card {
        border-radius: 20px;
        max-width: 35rem;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);

        @media (max-width: 940px) {
            max-width: 25rem;
        }
    }
}

@media (max-width: 1530px) {
    #group-view {
        display: grid;
        grid-template-areas:
        'name feed'
        'actions feed'
        'event feed'
        'groups feed'
        'footer feed';
        padding: 0rem 1rem;
        grid-template-columns: 25rem 30rem;
        grid-template-rows: 5rem 3.5rem 11rem 16rem auto;

        #feed-container {
            overflow-y: scroll;
            height: 100vh;

            #header {
                display: none;
                grid-area: header;
                justify-content: space-between;
                color: var(--primary-label-color);

                h1 {
                    font-weight: 900;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #trailing {
                    display: flex;
                    align-items: center;

                    #plus {
                        width: 2rem;
                        height: 2rem;
                        cursor: pointer;
                        margin: 0rem 0.5rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                        }
                    }

                    #chats {
                        width: 2rem;
                        height: 2rem;
                        cursor: pointer;
                        margin: 0rem 0.5rem;
                        margin-top: 0.2rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                        }
                    }

                    #settings {
                        width: 2rem;
                        height: 2rem;
                        cursor: pointer;
                        margin: 0rem 0.5rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                        }
                    }
                }
            }
        }

        .members {
            display: none;
        }

        .chats {
            display: none;
        }

        .button {
            display: none;
        }

        .actions {
            margin: unset;
        }
    }
}

@media (max-width: 940px) {
    #group-view {
        width: 100%;
        display: grid;
        grid-template-areas:
        'feed'
        'feed';
        padding-left: unset;
        padding-right: unset;
        grid-template-columns: unset;

        #feed-container {
            #header {
                display: flex;
                margin: 1rem 1rem;
            }

            #next-event {
                display: block;
                margin: 0rem 1rem;
            }
        }
        .info {
            display: none;
        }

        .actions {
            display: none;
        }

        .groups {
            display: none;
        }

        .nav-card {
            display: none;
        }

        .event {
            display: none;
        }

        .members {
            display: none;
        }

        .chats {
            display: none;
        }

        .button {
            display: inline-flex;
            width: 5rem;
            height: 5rem;
            z-index: 10;
        }
    }

    #mobile-header {
        display: flex;
        margin: 1rem;
        align-items: center;
        justify-content: space-between;

        h1 {
            color: var(--primary-label-color);
        }

        #mobile-actions {
            display: flex;
            border-radius: 15px;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            background-color: var(--primary-brand-color);

            button {
                all: unset;
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                margin: 0rem 0.5rem;

                img {
                    width: 2rem;
                    height: 2rem;
                    align-self: center;
                }
            }
        }
    }
}
</style>