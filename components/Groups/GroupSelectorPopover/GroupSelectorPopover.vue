<template>
    <div id="group-selector-popover">
        <ul id="group-list">
            <li 
                v-for="group in groups" 
                :key="group.id" 
                :class="{ 'group-view': true, selected: sessionStore.selectedGroup?.id === group.id }" 
                @click="selectGroup(group)"
            >
                <GroupIcon :type="group.type" :image="group.club?.logo ?? group.organization?.logo" :size=3 />
                <a class="name">{{ group.club?.name ?? group.organization?.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import GroupIcon from '../GroupIcon/GroupIcon.vue';
import { GroupSelection } from '~/data/models/GenericModels';

const sessionStore = useSessionStore();

const emit = defineEmits({
  selectedGroupChanged(payload: { group: GroupSelection }) {
     if (payload.group) {
        return true;
     } else {
        return false;
     }
  }
});

const groups = computed<GroupSelection[]>(() => {
    return sessionStore.groups.sort((a, b) => {
        if (a.id == sessionStore.selectedGroup?.id) { return -1; }
        if (b.id == sessionStore.selectedGroup?.id) { return 1; }
        return 0;
    })
});

function selectGroup(group: GroupSelection){
    sessionStore.selectedGroup = group;
    emit('selectedGroupChanged', { group: group });
}
</script>

<style scoped>
#group-selector-popover {
    width: 25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    
    #group-list {
        padding: 0;
        width: 100%; 
        height: 13rem;
        overflow-y: scroll;
        list-style-type: none;
    }

    .group-view {
        display: flex;
        cursor: pointer;
        flex-direction: row;
        align-items: center;
        margin: 1rem 1rem;

        .name {
            margin: 0rem 1rem;
            font-weight: 600;
            font-style: normal;
            font-size: 1rem;
            color: var(--primary-label-color);
        }
    }

    .selected {
        padding: 0.25rem;
        border-radius: 13px;
        border: var(--primary-label-color) solid 1px;
    }
}
</style>