<template>
    <NavigationBar/>
    <main id="group-view">
        <GroupLogoAndBanner 
            :sports="groupSports"
            :logo-u-r-l="groupLogoURL" 
            :banner-u-r-l="groupBannerURL" 
            @clicked-share="handleGroupSharing"
        />

        <!-- Group Info -->
        <GroupInfo v-if="group" :group="group"/>

        <!-- Groups Selector -->
        <GroupSelector/>

        <!-- Next Event -->
        <GroupNextEvent :event="nextEvent" :style="{ margin: '2rem 0rem' }"/>

        <!-- Group small section -->
        <GroupSmallSection v-if="group" :group="group"/>

        <!-- Feed -->
        <GroupFeed v-if="selectedGroup" :group="selectedGroup.club! ?? selectedGroup.organization!"/>
        
        <!-- New Post Modal -->
        <dialog id="new-post-modal" ref="new-post-modal" class="dialog">
            <NewPostView  @close="postCardModalRef?.close()" @created="handleNewPost"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { type Group } from '~/types/group';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { ref, computed, useTemplateRef } from 'vue';
import { GROUP_TYPE, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { useGroupsViewModel } from '@/stores/groups-view-model';

import PostFeed from '@/components/Posts/PostFeed/PostFeed.vue';
import GroupInfo from '~/components/Groups/GroupInfo/GroupInfo.vue';
import GroupFeed from '~/components/Groups/GroupFeed/GroupFeed.vue';
import NewPostView from '@/components/Posts/NewPostView/NewPostView.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import GroupSelector from '@/components/Groups/GroupSelector/GroupSelector.vue';
import GroupNextEvent from '~/components/Groups/GroupNextEvent/GroupNextEvent.vue';
import GroupSmallSection from '~/components/Groups/GroupSmallSection/GroupSmallSection.vue';
import GroupLogoAndBanner from '~/components/Groups/GroupLogoAndBanner/GroupLogoAndBanner.vue';


const toast = useToast();
const router = useRouter();

const modelStore = useModelStore();
const sessionStore = useSessionStore();
const viewModel = useGroupsViewModel();

// const menu = useTemplateRef('menu');
const feed = useTemplateRef<typeof PostFeed>('feed');

const showGroupSelector = ref(false);
const postCardModalRef = useTemplateRef<HTMLDialogElement>('new-post-modal');

/**
 * I truly do want it to fetch post data on anytime we navigate here.
 * Eventually I will be more tactful about only fetching more instead of invalidating our client side data.
 */
onMounted(() => {
    viewModel.load();
});

const group = computed<Group | undefined>(() => {
    return selectedGroup?.value?.club ?? selectedGroup?.value?.organization;
});

const selectedGroup = computed(() => {
    return sessionStore.selectedGroup
});

const groupLogoURL = computed<string | undefined>(() => {
    return selectedGroup.value?.club?.logo ?? selectedGroup.value?.organization?.logo;
});

const groupBannerURL = computed<string | undefined>(() => {
    return selectedGroup.value?.club?.banner ?? selectedGroup.value?.organization?.banner;
});

const groupSports = computed<Array<string>>(() => {
    return (selectedGroup.value?.club?.sports ?? selectedGroup.value?.organization?.sports) ?? [];
});

const state = computed<VIEW_STATE>(() => {
    return viewModel.state;
});

const nextEvent = computed<Event | undefined>(() => {
    const clubId = (selectedGroup.value?.club?.id ?? selectedGroup.value?.organization?.id) ?? '';
    return modelStore.getAllEvents()
        .mostRecentForClub(clubId);
});

const groupName = computed<string>(() => {
    const group = sessionStore.selectedGroup?.club ?? sessionStore.selectedGroup?.organization;
    return group?.name ?? 'Group';
});

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
    grid-template-areas:
    'banner banner'
    'info groups'
    'feed event'
    'feed location'
    'feed location'
    ;
    
    width: 100%;
    cursor: pointer;
    padding-top: 1rem;
    overflow-y: scroll;
    justify-content: center;
    grid-template-columns: 35rem 23rem;

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

@media (max-width: 940px) {
    #group-view {
        display: grid;
        grid-template-areas:
        'banner'
        'info'
        'feed'
        'feed';
        margin: 1rem;
        max-width: 58rem;
        padding-left: unset;
        padding-right: unset;
        grid-template-columns: auto;

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