<template>
    <div id="group-kick-modal">
        <div id="header">
            {{ headerText }}
        </div>
        <div id="body">
            <div id="title">{{ bodyText }}</div>
            <div class="sub-title">*This action cannot be undone.</div>
        </div>
        <div id="footer">
            <TextButton
                text="Yes"
                :model-value="state"
                class="button yes"
                @click="handleKickUser"
            />
            <button class="button no" @click="$emit('close')">
                No
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';
import { Member } from '~/data/models/GenericModels';
import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';
import { GroupManager } from '~/data/managers/GroupManager';

const emit = defineEmits(['kicked', 'close']);
const props = defineProps({
    member: { type: Member, required: true }
});

const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const headerText = computed<string>(() => {
    return `Kick ${props.member.user?.username ?? 'olympsis-user'}`
});

const bodyText = computed<string>(() => {
    return `Are you sure that you want to kick ${props.member.user?.username ?? 'olympsis-user'}`
});

async function handleKickUser() {
    const manager = new GroupManager();
    state.value = VIEW_STATE.LOADING;

    const isKicked = await manager.kickMember(props.member);
    if (isKicked) {
        emit('kicked');
    } else {
        state.value = VIEW_STATE.FAILURE;
        setTimeout(() => {
            state.value = VIEW_STATE.PENDING;
        }, 500);
    }
}
</script>

<style scoped>
#group-kick-modal {
    
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
            height: unset;
            border: unset;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
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