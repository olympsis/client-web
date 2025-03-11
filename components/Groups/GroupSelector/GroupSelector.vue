<template>
    <div id="group-selector">
        <div id="header">
            <h2>Your Groups</h2>

            <button class="button" @click="router.push('/groups/search')">
                <picture>
                    <source srcset="@/assets/icons/search/search.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/search/search.svg">
                </picture>
            </button>
        </div>
        <ul id="group-list" v-if="state != VIEW_STATE.LOADING">
            <div 
                v-for="group in groups" 
                :key="group.id" 
                :class="{ 'group-view': true, selected: sessionStore.selectedGroup?.id === group.id}" 
                @click="selectGroup(group)"
            >
                <GroupIcon :type="group.type" :image="group.club?.logo ?? group.organization?.logo" :size=3 />
                <a class="name">{{ group.club?.name ?? group.organization?.name }}</a>
            </div>
        </ul>
        <GroupSelectorSkeleton v-else/>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { useSessionStore } from '~/stores/session-store';
import { GroupSelection } from '~/data/models/GenericModels';

import GroupIcon from '../GroupIcon/GroupIcon.vue';
import GroupSelectorSkeleton from './GroupSelectorSkeleton.vue';

const router = useRouter();
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
#group-selector {
    padding: 1rem;
    grid-area: groups;
    border-radius: 10px;
    border: var(--component-border) solid 1px;
    background-color: var(--secondary-background-color);
    
    #header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #group-list {
        width: 100%; 
        height: 13rem;
        overflow-y: scroll;
        padding: 0;
        list-style-type: none;
    }

    .group-view {
        display: flex;
        cursor: pointer;
        flex-direction: row;
        align-items: center;
        margin: 1rem 0.5rem;

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