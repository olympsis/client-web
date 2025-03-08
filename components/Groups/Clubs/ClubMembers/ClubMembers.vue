<template>
    <div id="club-members">
        <SearchBar v-model:value="searchText"/>
        <ul id="list">
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
import { Club } from '~/data/models/ClubModels';
import { Member } from '~/data/models/GenericModels';

import Dialog from 'primevue/dialog';
import SearchBar from '~/components/SearchBar/SearchBar.vue';
import MemberListItem from '../../MemberListItem/MemberListItem.vue';
import ChangeRankModal from '~/components/Modals/Groups/ChangeRank/ChangeRankModal.vue';
import GroupKickModal from '~/components/Modals/Groups/GroupKickModal/GroupKickModal.vue';

const props = defineProps({
    club: { type: Club, required: true }
});

const session = useSessionStore();

const showDialog = ref(false);
const showKickDialog = ref(false);
const searchText = ref<string>('');
const selectedMember = ref<Member | undefined>(undefined);

const members = computed<Member[]>(() => {
    return searchText.value === '' ? (props.club.members ?? []) : (props.club.members?.filter((m) => m.user?.username?.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())) ?? []);
});

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
#club-members {

}
</style>