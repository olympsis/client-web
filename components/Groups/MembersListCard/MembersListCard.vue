<template>
    <div id="members-list-card">
        <ul id="members-list" >
            <MemberListItem 
                v-for="member in members" 
                :member="member" 
                style="margin: 1rem 0rem;"
                @change-rank="handleChangeRank"
                @report-user=""
                @remove-user="handleRemoveUser"
                @leave-group="handleLeaveGroup"
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
    </div>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import MemberListItem from '../MemberListItem/MemberListItem.vue';
import ChangeRankModal from '~/components/Modals/Groups/ChangeRank/ChangeRankModal.vue';

import { Member } from '~/data/models/GenericModels';
import { GroupManager } from '~/data/managers/GroupManager';

defineProps({
    members: { type: Array<Member>, required: true }
});



const showDialog = ref(false);
const selectedMember = ref<Member | undefined>(undefined);

const manager = new GroupManager();
function handleChangeRank(event: { member: Member}) {
    selectedMember.value = event.member;
    showDialog.value = true;
}

async function handleRemoveUser(event: { member: Member}) {
    const isRemoved = await manager.kickMember(event.member);
    if (isRemoved) {
        const session = useSessionStore();
        const selectedGroup = session.selectedGroup?.club ?? session.selectedGroup?.organization;
        if (selectedGroup) {
            const idx = selectedGroup.members?.findIndex((m) => m.id === event.member.id);
            if (idx !== undefined && idx != -1) {
                selectedGroup.members?.splice(idx, 1);
            }
        }
    }
}

function handleLeaveGroup() {}

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