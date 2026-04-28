<template>
    <main id="group-view">
        <GroupLogoAndBanner
            v-if="group"
            :group="group"
            :sports="groupSports"
            @clicked-share="handleGroupSharing"
        />

        <!-- Group Info -->
        <GroupInfo v-if="group" :group="group" @show-settings="showSettingsModal"/>

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
            <NewPostView @close="postCardModalRef?.close()" @created="handleNewPost"/>
        </dialog>

        <!-- Group Settings Modal -->
        <dialog id="settings-modal" ref="settings-modal" class="dialog">
            <GroupSettingsModal v-if="group" :group="group" @close="hideSettingsModal" @show-leave-modal="showLeaveModal" @show-delete-modal="showDeleteModal"/>
        </dialog>

        <!-- Leave Group Dialog -->
        <dialog ref="leave-modal" id="leave-modal" class="dialog" v-if="selectedGroup">
            <GroupLeaveModal :group="selectedGroup" @close="hideLeaveModal" @success="handleLeaveGroup"/>
        </dialog>

        <!-- Delete Group Dialog -->
        <dialog ref="delete-modal" id="delete-modal" class="dialog" v-if="selectedGroup">
            <GroupDeleteModal :group="selectedGroup" @close="hideDeleteModal" @success="handleLeaveGroup"/>
        </dialog>

        <!-- Kick Member Dialog -->
        <dialog ref="kick-modal" id="kick-modal" class="dialog">
            <GroupKickModal v-if="selectedMember" :member="selectedMember" @close="hideKickModal" @kicked="handleKickedUser"/>
        </dialog>

        <Dialog
            ref="op"
            v-if="selectedMember"
            id="change-rank-dialog"
            v-model:visible="showDialog"
            blockScroll
            position="center"
            :style="{'width': '100%', 'max-width': '32rem', 'overflow-y': 'scroll', 'background-color': 'var(--primary-background-color)'}"
        >
            <template #container>
                <ChangeRankModal :member="selectedMember" @close="showDialog = false"/>
            </template>
        </Dialog>
    </main>
</template>

<script setup lang="ts">
import { type Group } from '~/types/group';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { ref, computed, useTemplateRef } from 'vue';
import { Member } from '~/data/models/GenericModels';
import { useSessionStore } from '@/stores/session-store';
import { useGroupsViewModel } from '@/stores/groups-view-model';

import Dialog from 'primevue/dialog';
import PostFeed from '@/components/Posts/PostFeed/PostFeed.vue';
import GroupInfo from '~/components/Groups/GroupInfo/GroupInfo.vue';
import GroupFeed from '~/components/Groups/GroupFeed/GroupFeed.vue';
import NewPostView from '@/components/Posts/NewPostView/NewPostView.vue';
import GroupSelector from '@/components/Groups/GroupSelector/GroupSelector.vue';
import GroupNextEvent from '~/components/Groups/GroupNextEvent/GroupNextEvent.vue';
import ChangeRankModal from '~/components/Modals/Groups/ChangeRank/ChangeRankModal.vue';
import GroupKickModal from '~/components/Modals/Groups/GroupKickModal/GroupKickModal.vue';
import GroupSmallSection from '~/components/Groups/GroupSmallSection/GroupSmallSection.vue';
import GroupLeaveModal from '@/components/Modals/Groups/GroupLeaveModal/GroupLeaveModal.vue';
import GroupLogoAndBanner from '~/components/Groups/GroupLogoAndBanner/GroupLogoAndBanner.vue';
import GroupDeleteModal from '@/components/Modals/Groups/GroupDeleteModal/GroupDeleteModal.vue';
import GroupSettingsModal from '~/components/Modals/Groups/GroupSettings/GroupSettingsModal.vue';

const toast = useToast();
const modelStore = useModelStore();
const sessionStore = useSessionStore();
const viewModel = useGroupsViewModel();

const showDialog = ref(false);
const selectedMember = ref<Member | undefined>(undefined);

const feed = useTemplateRef<typeof PostFeed>('feed');
const kickModalRef = useTemplateRef<HTMLDialogElement>('kick-modal');
const leaveModalRef = useTemplateRef<HTMLDialogElement>('leave-modal');
const deleteModalRef = useTemplateRef<HTMLDialogElement>('delete-modal');
const settingsModalRef = useTemplateRef<HTMLDialogElement>('settings-modal');
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

async function handleGroupSharing() {
    const groupID = selectedGroup.value?.club?.id ?? selectedGroup.value?.organization?.id ?? '';
    await navigator.clipboard.writeText(`https://olympsis.com/groups/search/${groupID}`);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this group!', life: 3000 });
}

function handleNewPost(event: any) {
    feed.value?.handleNewPost(event.newPost);
    postCardModalRef.value?.close();
}

function showSettingsModal() {
    if (settingsModalRef.value) {
        settingsModalRef.value.show();
    } else {
        console.error('Failed to find settings dialog template reference.');
    }
}

function hideSettingsModal() {
    if (settingsModalRef.value) {
        settingsModalRef.value.close();
    } else {
        console.error('Failed to find settings dialog template reference.');
    }
}

function showLeaveModal() {
    if (leaveModalRef.value) {
        hideDeleteModal();
        leaveModalRef.value.show();
    } else {
        console.error('Failed to find Leave Dialog template reference.');
    }
}

function hideLeaveModal() {
    if (leaveModalRef.value) {
        leaveModalRef.value.close();
    } else {
        console.error('Failed to find Leave Dialog template reference.');
    }
}

function showDeleteModal() {
    if (deleteModalRef.value) {
        hideLeaveModal();
        deleteModalRef.value.show();
    } else {
        console.error('Failed to find Delete Dialog template reference.');
    }
}

function hideDeleteModal() {
    if (deleteModalRef.value) {
        deleteModalRef.value.close();
    } else {
        console.error('Failed to find Delete Dialog template reference.');
    }
}

function showKickModal() {
    if (kickModalRef.value) {
        kickModalRef.value.show();
    } else {
        console.error('Failed to find Kick Dialog template reference.');
    }
}

function hideKickModal() {
    if (kickModalRef.value) {
        kickModalRef.value.close();
    } else {
        console.error('Failed to find Kick Dialog template reference.');
    }
}

function handleLeaveGroup() {
    deleteModalRef.value?.close();
    settingsModalRef.value?.close();
    sessionStore.removeGroup(selectedGroup.value?.id ?? '');
}

function handleChangeRank(event: { member: Member}) {
    selectedMember.value = event.member;
    showDialog.value = true;
}

function handleRemoveUser(event: { member: Member}) {
    selectedMember.value = event.member;
    showKickModal();
}

function handleKickedUser() {
    hideKickModal();
    if (!selectedMember.value) return;
    const selectedGroup = sessionStore.selectedGroup?.club ?? sessionStore.selectedGroup?.organization;
    if (!selectedGroup) return;

    const idx = selectedGroup.members?.findIndex((m) => m.id === selectedMember.value?.id) ?? -1;
    if (idx != undefined && idx == -1) return;

    selectedGroup.members?.splice(idx, 1);
}

useSeoMeta({
    title: () => `${group.value?.name} | Olympsis`,
    ogTitle: () => `${group.value?.name} | Olympsis`,
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
    grid-template-rows: auto auto minmax(auto, 39rem) auto auto;
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

#settings-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #group-settings-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#leave-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #group-leave-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#delete-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #group-delete-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#kick-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #group-kick-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
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
        margin: 0rem 1rem;
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