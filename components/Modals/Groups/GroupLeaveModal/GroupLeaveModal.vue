<template>
    <div id="group-leave-modal">
        <div id="header">
            {{ headerText }}
        </div>
        <div id="body">
            <div id="title">{{ bodyText }}</div>
            <div id="sub-title">*You will have to re-apply to join this group again.</div>
        </div>
        <div id="footer">
            <TextButton
                text="Yes"
                success-text="Success" 
                failure-text="Failed"
                :model-value="state"
                class="button yes"
                @click="handleLeaveGroup"
            />
            <button class="button no" @click="$emit('close')">
                No
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { GROUP_TYPE } from '@/data/Enums';
import { ClubService } from '@/data/services/ClubService';
import { GroupSelection } from '@/data/models/GenericModels';
import { OrganizationService } from '@/data/services/OrganizationService';

import * as Sentry from '@sentry/nuxt';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const emit = defineEmits([
    'close',
    'success'
]);

const props = defineProps({
    group: { type: GroupSelection, required: true }
});

const headerText = computed<string>(() => {
    return props.group.type === GROUP_TYPE.CLUB ? 'Leaving Club' : 'Leaving Organization';
});

const bodyText = computed<string>(() => {
    const name = props.group.type === GROUP_TYPE.CLUB ? props.group.club?.name : props.group.organization?.name;
    return `Are you sure that you want to leave ${name ?? 'this group'}?`
});

const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);

function handleLeaveGroup() {
    switch (props.group.type) {
        case GROUP_TYPE.CLUB:
            if (props.group.club?.id) {
                state.value = VIEW_STATE.LOADING;
                const service = new ClubService();
                service.leaveClub(props.group.club?.id)
                    .then((hasLeft) => {;
                        if (hasLeft) {
                            state.value = VIEW_STATE.SUCCESS;
                            setTimeout(() => {
                                emit('success');
                                state.value = VIEW_STATE.PENDING;
                            }, 200);
                        } else {
                            Sentry.withScope((scope) => {
                                scope.setExtra('action', 'leave_club');
                                Sentry.captureMessage(`Failed to leave club. ID: ${props.group.club?.id}`);
                            });
                            state.value = VIEW_STATE.FAILURE;
                            emit('close');
                            state.value = VIEW_STATE.PENDING;
                        }
                    })
                    .catch((error) => {
                        Sentry.withScope((scope) => {
                            scope.setExtra('action', 'leave_club');
                            scope.setExtra('message', `Failed to leave club ${props.group.club?.id}.`);
                            Sentry.captureException(error);
                        });
                        console.error(`Failed to leave club ${props.group.club?.id}. Error: ${error}`);
                        emit('close');
                        state.value = VIEW_STATE.PENDING;
                    });
            }
            break;
        case GROUP_TYPE.ORGANIZATION:
            if (props.group.organization?.id) {
                state.value = VIEW_STATE.LOADING;
                const service = new OrganizationService();
                service.leaveOrganization(props.group.organization.id)
                    .then((hasLeft) => {
                        if (hasLeft) {
                            state.value = VIEW_STATE.SUCCESS;
                            setTimeout(() => {
                                emit('success');
                                state.value = VIEW_STATE.PENDING;
                            }, 200);
                        } else {
                            Sentry.withScope((scope) => {
                                scope.setExtra('action', 'leave_organization');
                                Sentry.captureMessage(`Failed to leave organization. ID: ${props.group.organization?.id}`);
                            });
                            state.value = VIEW_STATE.FAILURE;
                            emit('close');
                            state.value = VIEW_STATE.PENDING;
                        }
                    })
                    .catch((error) => {
                        Sentry.withScope((scope) => {
                            scope.setExtra('action', 'leave_organization');
                            scope.setExtra('message', `Failed to leave organization: ${props.group.organization?.id}.`);
                            Sentry.captureException(error);
                        });
                        console.error(`Failed to leave organization: ${props.group.organization?.id}.  Error: ${error}`);
                        state.value = VIEW_STATE.FAILURE;
                        emit('close');
                        state.value = VIEW_STATE.PENDING;
                    });
            }
            break;
    }
}

</script>

<style>
#group-leave-modal {
    
    max-width: 25rem;
    border-radius: 15px;
    background-color: var(--primary-background-color);

    #header {
        width: 100%;
        display: flex;
        font-size: 0.9rem;
        align-items: center;
        padding: 0.75rem 0rem;
        justify-content: center;
        border-radius: 15px 15px 0px 0px;
        color: var(--primary-label-color);
        background-color: var(--tertiary-background-color);
    }

    #body {
        width: 100%;
        display: flex;
        padding: 0rem 1rem;
        margin: 1rem 0rem;
        align-items: start;
        flex-direction: column;
        justify-content: center;

        #title {
            font-weight: bold;
            text-align: center;
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: var(--primary-label-color);
        }

        #sub-title {
            color: gray;
            font-style: italic;
            font-size: 0.75rem;
        }
    }

    #footer {
        width: 100%;
        display: flex;
        padding: 1rem;

        .button {
            width: 100%;
            height: 2.25rem;
            border: unset;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.25rem;
            border-radius: 10px;
        }

        .yes {
            color: white;
            margin-right: 0.5rem;
            background-color: var(--olympsis-red);
        }

        .no {
            margin-left: 0.5rem;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }
    }
}
</style>