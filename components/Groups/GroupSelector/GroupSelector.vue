<template>
    <div id="group-selector">
        <div id="group-list" v-if="state != VIEW_STATE.LOADING">
            <ul v-for="group in sessionStore.groups" :key="group.id">
                <div :class="{ 'group-view': true, selected: sessionStore.selectedGroup?.id === group.id}" @click="selectGroup(group)">
                    <GroupIcon :type="group.type" :image="group.club?.logo ?? group.organization?.logo" :size=3 />
                    <a class="name">{{ group.club?.name ?? group.organization?.name }}</a>
                </div>
            </ul>
        </div>
        <GroupSelectorSkeleton v-else/>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { useSessionStore } from '~/stores/session-store';
import { GroupSelection } from '~/data/models/GenericModels';
import { useGroupsViewModel } from '~/stores/groups-view-model';

import GroupIcon from '../GroupIcon/GroupIcon.vue';
import GroupSelectorSkeleton from './GroupSelectorSkeleton.vue';

const sessionStore = useSessionStore();

const state = computed(() => {
    return sessionStore.loadingState;
});

const emit = defineEmits({
  selectedGroupChanged(payload: { group: GroupSelection }) {
     if (payload.group) {
        return true;
     } else {
        return false;
     }
  }
})

function selectGroup(group: GroupSelection){
    sessionStore.selectedGroup = group;
    emit('selectedGroupChanged', { group: group });
}
</script>

<style scoped>
#group-selector {
    width: 25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    background-color: var(--secondary-background-color);
    
    #group-list {
        width: 100%; 
        height: 13rem;
        overflow-y: scroll;

        ul {
            padding: 0;
            list-style-type: none;
        }
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
            font-size: 1.3rem;
            color: var(--primary-label-color);
        }
    }

    .selected {
        padding: 0.25rem;
        border-radius: 13px;
        background-color: var(--tertiary-background-color);
    }
}
</style>