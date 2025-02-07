<template>
    <div id="change-rank-modal" class="modal">
        <div id="header" class="header">
            <button class="button" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
            <div id="title" class="title">
                Change Role
            </div>
        </div>

        <div id="body" class="body">
            <div id="section">
                <TextButton 
                    text="Owner" 
                    success-text="Changed" 
                    failure-text="Failed" 
                    :model-value="ownerLoading" 
                    :class="{ disabled: member.role === GROUP_ROLE.OWNER }"
                    @click="changeRole(GROUP_ROLE.OWNER)"
                />
                <div class="sub-section">All Previous privileges and the ability to demote other owners or delete the group.</div>
            </div>

            <div id="section">
                <TextButton 
                    text="Admin" 
                    success-text="Changed" 
                    failure-text="Failed" 
                    :model-value="adminLoading" 
                    :class="{ disabled: member.role === GROUP_ROLE.ADMIN }"
                    @click="changeRole(GROUP_ROLE.ADMIN)"
                />
                <div class="sub-section">Elevated privileges. Can create events on behalf of the group, access to user moderation features.</div>
            </div>

            <div id="section">
                <TextButton 
                    text="Member" 
                    success-text="Changed" 
                    failure-text="Failed" 
                    :model-value="memberLoading" 
                    :class="{ disabled: member.role === GROUP_ROLE.MEMBER }"
                    @click="changeRole(GROUP_ROLE.MEMBER)"
                />
                <div class="sub-section">Base privileges, can like and comment and create posts.</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Member } from '~/data/models/GenericModels';
import TextButton from '~/components/Buttons/LoadingButtons/TextButton/TextButton.vue';
import { GROUP_ROLE, VIEW_STATE } from '~/data/Enums';
import { GroupManager } from '~/data/managers/GroupManager';

const emit = defineEmits(['close']);
const props = defineProps({
    member: { type: Member, required: true }
});

const ownerLoading = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const adminLoading = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const memberLoading = ref<VIEW_STATE>(VIEW_STATE.PENDING);

async function changeRole(role: GROUP_ROLE) {
    if (props.member.role === role) return;
    const manager = new GroupManager();
    switch (role) {
        case GROUP_ROLE.OWNER:
            ownerLoading.value = VIEW_STATE.LOADING;
            break;
        case GROUP_ROLE.ADMIN:
            adminLoading.value = VIEW_STATE.LOADING;
            break;
        default:
            memberLoading.value = VIEW_STATE.LOADING;
            break;
    }

    const hasChanged = await manager.changeMemberRank(props.member, role);
    if (hasChanged) {
        switch (role) {
            case GROUP_ROLE.OWNER:
                props.member.role = GROUP_ROLE.OWNER;
                ownerLoading.value = VIEW_STATE.SUCCESS;
                break;
            case GROUP_ROLE.ADMIN:
                props.member.role = GROUP_ROLE.ADMIN;
                adminLoading.value = VIEW_STATE.SUCCESS;
                break;
            default:
                props.member.role = GROUP_ROLE.MEMBER;
                memberLoading.value = VIEW_STATE.SUCCESS;
                break;
        }

        emit('close');
    } else {
        switch (role) {
            case GROUP_ROLE.OWNER:
                ownerLoading.value = VIEW_STATE.FAILURE;
                setTimeout(() => {
                    ownerLoading.value = VIEW_STATE.PENDING;
                }, 500);
                break;
            case GROUP_ROLE.ADMIN:
                adminLoading.value = VIEW_STATE.FAILURE;
                setTimeout(() => {
                    adminLoading.value = VIEW_STATE.PENDING;
                }, 500);
                break;
            default:
                memberLoading.value = VIEW_STATE.FAILURE;
                setTimeout(() => {
                    memberLoading.value = VIEW_STATE.PENDING;
                }, 500);
                break;
        }
    }

}
</script>

<style scoped>
#change-rank-modal {
    #header {
        button {
            margin-left: 1rem;
        }

        #title {
            margin: 0 auto;
        }
    }

    #body {
        display: flex;
        margin: 0rem 1rem;
        flex-direction: column;

        #section {
            display: flex;
            margin: 1rem 0rem;
            flex-direction: column;

            .disabled {
                background-color: var(--olympsis-gray);
            }

            .sub-section {
                font-size: 0.9rem;
                margin: 0.5rem;
                color: var(--olympsis-gray);
            }
        }
    }
}
</style>
