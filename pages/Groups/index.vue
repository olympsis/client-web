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
        <GroupSmallSection v-if="group" :group="group" :style="{ marginBottom: '2rem' }"/>

        <!-- Feed -->
        <GroupFeed v-if="group" :group="group"/>
        
        <!-- New Post Modal -->
        <dialog id="new-post-modal" ref="new-post-modal" class="dialog">
            <NewPostView  @close="postCardModalRef?.close()" @created="handleNewPost"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">
import { type Group } from '~/types/group';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { ref, computed, useTemplateRef } from 'vue';
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
const modelStore = useModelStore();
const sessionStore = useSessionStore();
const viewModel = useGroupsViewModel();

const feed = useTemplateRef<typeof PostFeed>('feed');
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
    return group.value?.logo;
});

const groupBannerURL = computed<string | undefined>(() => {
    return group.value?.banner;
});

const groupSports = computed<Array<string>>(() => {
    return group.value?.sports ?? [];
});

const nextEvent = computed<Event | undefined>(() => {
    const clubId = group.value?.id ?? '';
    return modelStore.getAllEvents()
        .mostRecentForClub(clubId);
});

const groupName = computed<string>(() => {
    return group.value?.name ?? 'Olympsis Group';
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
    }

    #group-selector {
        display: none;
    }

    #group-next-event {
        display: none;
    }

    #group-small-section {
        display: none;
    }

}
</style>