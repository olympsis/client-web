<template>
    <div id="group-info">
        <div id="header">
            <div id="title">
                <h1>{{ getGroupName(group) }}</h1>
                <picture v-if="isMember" ref="chevron" @click="toggleSelector">
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron">
                </picture>
                <Popover ref="selector">
                    <div class="flex flex-col gap-4">
                        <div>
                            <span class="font-medium block mb-2">Your Groups</span>
                            <GroupSelectorPopover @selected-group-changed="toggleSelector"/>
                        </div>
                    </div>
                </Popover>

                <button v-if="isMember" class="settings" @click="$emit('show-settings')">
                    <picture class="centered">
                        <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                        <img class="settings-icon" src="@/assets/icons/gear/gear.svg"/>
                    </picture>
                </button>
            </div>

            <div id="description">{{ getGroupDescription(group) }}</div>
        </div>

        <div id="sub-header">
             <div class="section">
                <div id="members">
                    <GroupMembersPeek :members="groupMembers"/>
                    <div :style="{ width: '100%', fontWeight: 'bold', marginLeft: '1rem', whiteSpace: 'nowrap' }">{{ groupMembersString }}</div>
                </div>

                <TextButton v-if="!isMember" text="Request to Join" success-text="Requested" failure-text="Failed" v-model="buttonState" @click="apply" class="action"/>
             </div>

             <div class="section">
                <div id="info" :style="{ display: 'flex', gap: '1rem', margin: '1rem 0rem' }">
                    <div id="foundation">
                        <picture class="icon">
                            <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/calendar/calendar.month.svg">
                        </picture>

                        <div :style="{ marginLeft: '0.5rem' }">{{ `Created ${getMonthAndYear(group?.createdAt ?? 0)}` }}</div>
                    </div>

                    <div v-if="isClub(group)" id="visibility" >
                        <picture class="icon">
                            <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/globe/globe.svg">
                        </picture>
                        <div :style="{ textTransform: 'capitalize', marginLeft: '0.5rem' }">{{ `${getGroupVisibility(group)} Community` }}</div>
                    </div>
                </div>
             </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { 
    type Group, 
    isClub,
    getGroupName,
    getGroupMembers,
    getGroupVisibility,
    getGroupDescription,
} from '~/types/group';
import { VIEW_STATE } from '~/data/Enums';
import { getMonthAndYear } from '#imports';
import { Member } from '~/data/models/GenericModels';

import Popover from 'primevue/popover';
import GroupMembersPeek from '../GroupMembersPeek/GroupMembersPeek.vue';
import GroupSelectorPopover from '../GroupSelectorPopover/GroupSelectorPopover.vue';
import TextButton from '~/components/Buttons/LoadingButtons/TextButton/TextButton.vue';
import { ClubService } from '~/data/services/ClubService';

const model = defineModel<Group>('group', {
    required: true
});

const emit = defineEmits([
    'show-auth',
    'show-settings'
]);

const auth = useAuth();
const selector = ref();
const session = useSessionStore();
const clubService = new ClubService();
const buttonState = ref(VIEW_STATE.PENDING);

const isMember = computed<Boolean>(() => {
    const uuid = session.user?.uuid;
    if (!uuid) return false;

    return groupMembers.value.find((m) => m.user?.uuid === uuid) !== undefined;
});

const groupMembers = computed<Member[]>(() => {
    return getGroupMembers(model.value);
});

const groupMembersString = computed<string>(() => {
    return groupMembers.value.length > 1 ? `${groupMembers.value.length} members` : `${groupMembers.value.length} member`;
});

const toggleSelector = (event: any) => {
    selector.value.toggle(event);
}

/**
 * Send an application to the group
 */
function apply() {
    if (!auth.isAuthenticated) {
        emit('show-auth');
        return;
    }

    if (buttonState.value === VIEW_STATE.LOADING) return;
    buttonState.value = VIEW_STATE.LOADING;

    clubService.applyToClub('')
        .then((hasApplied: boolean) => {
            if (hasApplied) {
                buttonState.value = VIEW_STATE.SUCCESS;
            } else {
                buttonState.value = VIEW_STATE.FAILURE;
            }
        })
        .catch(() => {
            buttonState.value = VIEW_STATE.FAILURE;
        });
}
</script>

<style scoped>
#group-info {
    grid-area: info;
}
#header {
    width: 100%;
    padding: 1rem;
    max-width: 58rem;

    #title {
        display: flex;
        align-items: end;
        margin-bottom: 0.5rem;
    }
}

#sub-header {
    width: 100%;
    padding: 1rem;
    max-width: 58rem;
    grid-area: sub-header;
}

.section {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;

    justify-content: space-between;
}

#members {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#foundation {
    opacity: 0.7;
    display: flex;
    align-items: center;
}

#visibility {
    opacity: 0.7;
    display: flex;
    align-items: center;
}

.action {
    cursor: pointer;
     max-width: 10rem;
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.chevron {
    rotate: -90deg;
    margin-left: 0.5rem;
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.settings {
    border: unset;
    cursor: pointer;
    margin-left: auto;
    background-color: unset;
}

.settings-icon {
    width: 2rem;
    height: 2rem;
}
</style>