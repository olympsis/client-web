<template>
    <div id="group-info">
        <div id="header">
            <h1>{{ getGroupName(group) }}</h1>
            <div id="description">{{ getGroupDescription(group) }}</div>
        </div>

        <div id="sub-header">
             <div class="section">
                <div id="members">
                    <GroupMembersPeek :members="groupMembers"/>
                    <div :style="{ width: '100%', fontWeight: 'bold', marginLeft: '1rem' }">{{ groupMembersString }}</div>
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

                    <div v-if="getGroupType(group) === GROUP_TYPE.CLUB" id="visibility" >
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
    getGroupType,
    getGroupName,
    getGroupMembers,
    getGroupVisibility,
    getGroupDescription,
} from '~/types/group';
import { getMonthAndYear } from '#imports';
import { Member } from '~/data/models/GenericModels';
import { GROUP_TYPE, VIEW_STATE } from '~/data/Enums';

const props = defineProps<{
    group: Group
}>();

const session = useSessionStore();
const buttonState = ref(VIEW_STATE.PENDING);

const isMember = computed<Boolean>(() => {
    const uuid = session.user?.uuid;
    if (!uuid) return false;

    return groupMembers.value.find((m) => m.user?.uuid === uuid) !== undefined;
});

const groupMembers = computed<Member[]>(() => {
    return getGroupMembers(props.group);
});

const groupMembersString = computed<string>(() => {
    return groupMembers.value.length > 1 ? `${groupMembers.value.length} members` : `${groupMembers.value.length} member`;
});

/**
 * Send an application to the group
 */
function apply() {
    // if (!isAuthenticated.value) {
    //     showAuthModal();
    //     return;
    // }

    // if (viewState.value === VIEW_STATE.LOADING) return;
    // if (actionState.value === VIEW_STATE.LOADING) return;
    // actionState.value = VIEW_STATE.LOADING;

    // service.applyToClub('')
    //     .then((hasApplied: boolean) => {
    //         if (hasApplied) {
    //             actionState.value = VIEW_STATE.SUCCESS;
    //         } else {
    //             actionState.value = VIEW_STATE.FAILURE;
    //         }
    //     })
    //     .catch(() => {
    //         actionState.value = VIEW_STATE.FAILURE;
    //     });
}
</script>

<style scoped>
#header {
    width: 100%;
    padding: 1rem;
    max-width: 58rem;
    grid-area: header;

    h1 {
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
</style>