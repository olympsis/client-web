<template>
    <NavigationBar/>
    <main id="group-settings-view">
        <!-- Group Header -->
        <div id="header">
            <button @click="router.push('/groups')">
                <picture>
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg"
                </picture>
            </button>

            <h1> {{ groupName }}</h1>
        </div>

        <!-- Group Logo & Banner -->
        <ClubLogoAndBanner :club="selectedClub" />

        <!-- Group Info -->
        <div id="info">
            <div id="visibility">
                <picture>
                    <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)"/>
                    <img src="@/assets/icons/globe/globe.svg"/>
                </picture>
                <div id="content">{{ visibility  }}</div>
            </div>
            <a>{{ membersCount + ' members' }}</a>
        </div>

        <!-- Group Settings Actions -->
        <div id="actions">
            <button @click="showEditDialog"> Edit Club </button>
            <button @click="router.push('/groups/applications')"> Applications </button>
            <button @click="router.push('/groups/reports')"> Reports </button>
            <button @click="showGroupPickerDialog"> Change Organization </button>
            <button @click="showNewGroupDialog"> Create a New Group </button>
            <button @click="router.push('/groups/search')"> Search for clubs </button>
            <button @click="showMembersDialog"> Members </button>
            <button v-if="canLeaveGroup" class="destructive" @click="showLeaveModal"> Leave Club </button>
            <button v-if="canDeleteGroup" class="destructive" @click="showDeleteModal"> Delete Club </button>
        </div>

        <!-- Edit Dialog -->
        <dialog ref="edit-dialog" id="edit-dialog" class="dialog">

        </dialog>

        <!-- Group Picker Dialog -->
        <dialog ref="group-picker-dialog" id="group-picker-dialog" class="dialog">
            <GroupSelector 
                @selectedGroupChanged="handleSelectedGroupChanged"
            />
        </dialog>

        <!-- Members Dialog -->
        <dialog ref="members-dialog" id="members-dialog" class="dialog">
            <div id="members-dialog-container">
                <button id="cancel-button" @click="hideMembersDialog">Close</button>
                <input id="search-bar" type="text" v-model="membersSearchText"/>
                <div id="member-list">
                    <MemberListItem 
                        v-for="member in members" 
                        :member="member" 
                        style="margin: 1rem;"
                        @change-rank="handleChangeRank"
                        @report-user=""
                        @remove-user="handleRemoveUser"
                        @leave-group="handleLeaveGroup"
                    />
                </div>
            </div>
        </dialog>

        <!-- Leave Group Dialog -->
        <dialog ref="leave-modal" id="leave-modal" class="dialog" v-if="selectedGroup">
            <GroupLeaveModal :group="selectedGroup" @close="hideLeaveModal" @success="handleLeaveGroup"/>
        </dialog>

        <!-- Delete Group Dialog -->
        <dialog ref="delete-modal" id="delete-modal" class="dialog" v-if="selectedGroup">
            <GroupDeleteModal :group="selectedGroup" @close="hideDeleteModal" @success="handleLeaveGroup"/>
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

import { useRouter } from 'vue-router';
import { Club } from '@/data/models/ClubModels';
import { computed, ref, useTemplateRef } from 'vue';
import { GROUP_TYPE, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { Organization } from '@/data/models/OrganizationModels';

import Dialog from 'primevue/dialog';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import GroupSelector from '@/components/Groups/GroupSelector/GroupSelector.vue';
import MemberListItem from '@/components/Groups/MemberListItem/MemberListItem.vue';
import ChangeRankModal from '~/components/Modals/Groups/ChangeRank/ChangeRankModal.vue';
import GroupLeaveModal from '@/components/Modals/Groups/GroupLeaveModal/GroupLeaveModal.vue';
import GroupDeleteModal from '@/components/Modals/Groups/GroupDeleteModal/GroupDeleteModal.vue';
import ClubLogoAndBanner from '@/components/Groups/Clubs/ClubLogoAndBanner/ClubLogoAndBanner.vue';
import { GroupManager } from '~/data/managers/GroupManager';
import { Member } from '~/data/models/GenericModels';

const router = useRouter();
const sessionStore = useSessionStore();
const manager = new GroupManager();

const showDialog = ref(false);
const selectedMember = ref<Member | undefined>(undefined);

const editDialogRef = useTemplateRef<HTMLDialogElement>('edit-dialog');
const groupPickerDialogRef = useTemplateRef<HTMLDialogElement>('group-picker-dialog');
const newGroupDialogRef = useTemplateRef<HTMLDialogElement>('new-group-dialog');
const membersDialogRef = useTemplateRef<HTMLDialogElement>('members-dialog');
const leaveModalRef = useTemplateRef<HTMLDialogElement>('leave-modal');
const deleteModalRef = useTemplateRef<HTMLDialogElement>('delete-modal');

const membersSearchText = ref('');
const groupPickerState = ref(VIEW_STATE.PENDING);

const groups = computed(() => {
    return sessionStore.groups
});

const selectedGroup = computed(() => {
    return sessionStore.selectedGroup;
});

const selectedClub = computed<Club | undefined>(() => {
    return selectedGroup.value?.club;
});

const selectedOrg = computed<Organization | undefined>(() => {
    return selectedGroup.value?.organization;
});

const groupName = computed(() => {
    return sessionStore.selectedGroup?.club?.name ?? sessionStore.selectedGroup?.organization?.name
});

const type = computed(() => {
    return selectedGroup.value?.type ?? GROUP_TYPE.CLUB
});

const visibility = computed(() => {
    const type = selectedGroup.value?.type
    if (type === 'club') {
        return selectedGroup.value?.club?.visibility === 'public' ? 'Public group' : 'Private group'
    } else {
        return 'Organization'
    }
});

const membersCount = computed(() => {
    const length = selectedGroup.value?.club?.members?.length ?? selectedGroup.value?.organization?.members?.length
    return length ? length : 0
});

const members = computed(() => {
    const array = (selectedGroup.value?.club?.members ?? selectedGroup.value?.organization?.members) ?? []
    return array
        .filter(m => m.user?.username?.toLowerCase().includes(membersSearchText.value.toLowerCase()));
});

const canLeaveGroup = computed<boolean>(() => {
    const user = sessionStore.user;
    if (user && members.value) {
        const member = members.value.find((m) =>
            m.user?.uuid === user.uuid
        );
        return member?.role !== 'owner';
    } else {
        return false;
    }
});

const canDeleteGroup = computed<boolean>(() => {
    const user = sessionStore.user;
    if (user && members.value) {
        const member = members.value.find((m) =>
            m.user?.uuid === user.uuid
        );
        return member?.role === 'owner';
    } else {
        return false;
    }
})

function showEditDialog() {
    if (editDialogRef.value) {
        hideNewGroupDialog();
        hideGroupPickerDialog();
        hideMembersDialog();
        hideLeaveModal();
        hideDeleteModal();
        editDialogRef.value.show();
    } else {
        console.error('Failed to find Edit Dialog template reference.');
    }
}

function hideEditDialog() {
    if (editDialogRef.value) {
        editDialogRef.value.close();
    } else {
        console.error('Failed to find Edit Dialog template reference.');
    }
}

function showGroupPickerDialog() {
    if (groupPickerDialogRef.value) {
        hideEditDialog();
        hideNewGroupDialog();
        hideMembersDialog();
        hideLeaveModal();
        hideDeleteModal();
        groupPickerDialogRef.value.show();
    } else {
        console.error('Failed to find Group Picker Dialog template reference.');
    }
}

function hideGroupPickerDialog() {
    if (groupPickerDialogRef.value) {
        groupPickerDialogRef.value.close();
    } else {
        console.error('Failed to find Group Picker Dialog template reference.');
    }
}

function showNewGroupDialog() {
    router.push('/groups/new');
}

function hideNewGroupDialog() {
    if (newGroupDialogRef.value) {
        newGroupDialogRef.value.close();
    } else {
        console.error('Failed to find New Group Dialog template reference.');
    }
}

function showMembersDialog() {
    if (membersDialogRef.value) {
        hideEditDialog();
        hideNewGroupDialog();
        hideGroupPickerDialog();
        hideLeaveModal();
        hideDeleteModal();
        membersDialogRef.value.show();
    } else {
        console.error('Failed to find Members Dialog template reference.');
    }
}

function hideMembersDialog() {
    if (membersDialogRef.value) {
        membersDialogRef.value.close();
    } else {
        console.error('Failed to find Members Dialog template reference.');
    }
}

function showLeaveModal() {
    if (leaveModalRef.value) {
        hideEditDialog();
        hideNewGroupDialog();
        hideGroupPickerDialog();
        hideMembersDialog();
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
        hideEditDialog();
        hideNewGroupDialog();
        hideGroupPickerDialog();
        hideMembersDialog();
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

function handleSelectedGroupChanged(event: any) {
    hideGroupPickerDialog();
}

function handleLeaveGroup() {
    sessionStore.removeGroup(selectedGroup.value?.id ?? '');
}

function handleChangeRank(event: { member: Member}) {
    selectedMember.value = event.member;
    showDialog.value = true;
}

function handleRemoveUser(event: { member: Member}) {
    
}


useSeoMeta({
    title: () => 'Group Settings | Olympsis',
    ogTitle: () => 'Group Settings | Olympsis',
    description: 'Join groups around the sports you love!',
    ogDescription: 'Join groups around the sports you love'
});

</script>

<style scoped>
#group-settings-view {
    width: 100%;
    display: flex;
    margin: 0 auto;
    overflow-y: scroll;
    align-items: center;
    flex-direction: column;
    
    #header {
        
        width: 100%;
        display: flex;
        max-width: 25rem;
        margin: 1rem 0rem;
        grid-area: header;
        flex-direction: row;
        align-items: center;

        .button {
            margin: 0rem 1rem;

            picture {
                width: 100%;
                height: 100%;
            }
        }

        button {
            all: unset;
            cursor: pointer;
        }

        h1 {
            margin: auto;
            max-width: 40vw;
            overflow: hidden;
            font-size: 1.2rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--primary-label-color);
        }
    }

    #club-logo-banner {
        max-width: 25rem;
    }

    #info {
        width: 100%;
        display: flex;
        max-width: 25rem;
        margin: 1rem 1rem;
        font-size: 0.8rem;
        padding: 0rem 1rem;
        flex-direction: column;
        color: var(--primary-label-color);

        #visibility {
            display: flex;
            align-items: center;

            #content {
                margin: 0rem 0.25rem;
            }
        }
    }

    #actions {
        width: 100%;
        display: flex;
        max-width: 25rem;
        padding: 0rem 1rem;
        margin-bottom: 2rem;
        flex-direction: column;

        * {
            border: unset;
            padding: 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--secondary-background-color);
        }

        .destructive {
            color: white;
            background-color: #8c1d1d;
        }
    }

    #edit-dialog {
        top: 0;
        border: unset;
        background: transparent;
        backdrop-filter: blur(5px);
        border-radius: var(--border-radius);
    }

    #group-picker-dialog {
        top: 0;
        border: unset;
        background: transparent;
        backdrop-filter: blur(5px);
        #group-selector {
            margin-top: 0rem;
            margin-bottom: 0rem;
            border-radius: var(--border-radius);
        }
    }

    #new-group-dialog {
        top: 0;
        border: unset;
        background: transparent;
        backdrop-filter: blur(5px);
        border-radius: var(--border-radius);

        #new-group-card {
            border-radius: var(--border-radius);
        }
    }
}

#members-dialog {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);


    #members-dialog-container {
        width: 100%;
        margin: 1rem;
        display: flex;
        max-width: 25rem;
        height: 25.75rem;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);

        #cancel-button {
            all: unset;
            margin: 1rem;
            cursor: pointer;
            color: var(--primary-label-color);
        }

        #search-bar {
            width: 95%;
            height: 2rem;
            border: unset;
            margin: 0rem auto;
            font-size: 1.4rem;
            max-width: 32.5rem;
            padding: 0rem 0.5rem;
            color: var(--primary-label-color);
            border-radius: var(--border-radius);
            background-color: var(--tertiary-background-color);
        }

        #member-list {
            width: 100%;
            max-height: 20rem;
            overflow-y: scroll;
            padding-bottom: 1rem;
        }
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
</style>