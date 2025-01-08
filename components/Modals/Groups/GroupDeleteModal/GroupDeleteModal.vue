<template>
    <div id="group-delete-modal">
        <div id="header">
            {{ headerText }}
        </div>
        <div id="body">
            <div id="title">{{ bodyText }}</div>
            <div class="sub-title">*You will loose all posts and chat history.</div>
            <div class="sub-title">*This action cannot be undone.</div>
        </div>
        <div id="footer">
            <TextButton
                text="Yes"
                :model-value="state"
                class="button yes"
                @click="handleDeleteGroup"
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

import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const emit = defineEmits([
    'close',
    'success'
]);

const props = defineProps({
    group: { type: GroupSelection, required: true }
});

const headerText = computed<string>(() => {
    return props.group.type === GROUP_TYPE.CLUB ? 'Deleting Club' : 'Deleting Organization';
});

const bodyText = computed<string>(() => {
    const name = props.group.type === GROUP_TYPE.CLUB ? props.group.club?.name : props.group.organization?.name;
    return `Are you sure that you want to delete ${name ?? 'this group'}?`
});

const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);

function handleDeleteGroup() {
    switch (props.group.type) {
        case GROUP_TYPE.CLUB:
            if (props.group.club?.id) {
                state.value = VIEW_STATE.LOADING;
                const service = new ClubService();
                service.deleteClub(props.group.club?.id)
                    .then((hasLeft) => {;
                        if (hasLeft) {
                            state.value = VIEW_STATE.SUCCESS;
                            setTimeout(() => {
                                emit('success');
                            }, 200);
                        } else {
                            emit('close');
                        }
                    })
                    .catch((error) => {
                        console.error(`Failed to delete club ${props.group.club?.id}. Error: ${error}`);
                        emit('close');
                    });
            }
            break;
        case GROUP_TYPE.ORGANIZATION:
            if (props.group.organization?.id) {
                state.value = VIEW_STATE.LOADING;
                const service = new OrganizationService();
                service.deleteOrganization(props.group.organization.id)
                    .then((hasLeft) => {
                        if (hasLeft) {
                            state.value = VIEW_STATE.SUCCESS;
                            setTimeout(() => {
                                emit('success');
                            }, 200);
                        } else {
                            state.value = VIEW_STATE.FAILED;
                            emit('close');
                        }
                    })
                    .catch((error) => {
                        console.error(`Failed to delete organization: ${props.group.organization?.id}.  Error: ${error}`);
                        state.value = VIEW_STATE.FAILED;
                        emit('close');
                    });
            }
            break;
    }
}

</script>

<style>
#group-delete-modal {
    
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

        .sub-title {
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