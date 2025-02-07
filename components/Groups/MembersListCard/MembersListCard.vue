<template>
    <div id="members-list-card">
        <ul id="members-list" >
            <MemberListItem 
                v-for="member in members" 
                :member="member" 
                style="margin: 1rem 0rem;"
                @change-rank="handleChangeRank"
                @report-user=""
                @remove-user="handleKickUser"
                @leave-group=""
            />
        </ul>

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

        <Dialog
            ref="op"
            v-if="selectedMember"
            id="kick-member-dialog"
            v-model:visible="showKickDialog"
            blockScroll
            position="center"
            :style="{'width': '100%', 'max-width': '25rem', 'overflow-y': 'scroll', 'background-color': 'var(--primary-background-color)'}"
        >
            <template #container>
                <GroupKickModal v-if="selectedMember" :member="selectedMember" @close="showKickDialog = false" @kicked="handleKickedUser"/>
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import MemberListItem from '../MemberListItem/MemberListItem.vue';
import ChangeRankModal from '~/components/Modals/Groups/ChangeRank/ChangeRankModal.vue';
import GroupKickModal from '~/components/Modals/Groups/GroupKickModal/GroupKickModal.vue';

import { Member } from '~/data/models/GenericModels';
import { GroupManager } from '~/data/managers/GroupManager';
import GroupLeaveModal from '~/components/Modals/Groups/GroupLeaveModal/GroupLeaveModal.vue';

defineProps({
    members: { type: Array<Member>, required: true }
});

const session = useSessionStore();

const showDialog = ref(false);
const showKickDialog = ref(false);
const selectedMember = ref<Member | undefined>(undefined);

function handleChangeRank(event: { member: Member}) {
    selectedMember.value = event.member;
    showDialog.value = true;
}

function handleKickUser(event: { member: Member}) {
    selectedMember.value = event.member;
    showKickDialog.value = true;
}


function handleKickedUser() {
    showKickDialog.value = false;
    if (!selectedMember.value) return;
    const selectedGroup = session.selectedGroup?.club ?? session.selectedGroup?.organization;
    if (!selectedGroup) return;

    const idx = selectedGroup.members?.findIndex((m) => m.id === selectedMember.value?.id) ?? -1;
    if (idx != undefined && idx == -1) return;

    selectedGroup.members?.splice(idx, 1);
}

</script>

<style scoped>
#members-list-card {
    width: 25rem;
    height: 20rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background-color: var(--secondary-background-color);

    .group-view {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 1rem 0rem;

        .name {
            margin: 0rem 1rem;
            font-weight: 600;
        }
    }

    #members-list {
        width: 100%;
        margin: 0rem;
        height: 20rem;
        padding: 0rem 1rem;
        overflow-y: scroll;
        list-style-type: none;
    }
}
</style>