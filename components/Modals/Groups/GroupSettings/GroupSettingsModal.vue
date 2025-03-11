<template>
    <div id="group-settings-modal" class="modal">
        <div id="header" class="header">
            <button class="button" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
            <div id="title" class="title">
                Settings
            </div>
        </div>
        <div id="actions">
            <button @click="router.push('/groups/reports')"> Applications/Reports </button>
            <button @click="router.push('/groups/new')"> Create a New Group </button>
            <button @click="router.push('/groups/search')"> Search for clubs </button>
            <button v-if="canLeaveGroup" class="destructive" @click="$emit('show-leave-modal')"> Leave Club </button>
            <button v-if="canDeleteGroup" class="destructive" @click="$emit('show-delete-modal')"> Delete Club </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Member } from '~/data/models/GenericModels';
import type { Group } from '~/types/group';

const model = defineModel<Group>('group' ,{
    required: true
});

const emit = defineEmits([
    'close',
    'show-leave-modal',
    'show-delete-modal'
])

const router = useRouter();
const session = useSessionStore();

const members = computed(() => {
    return model.value.members ?? Array<Member>()
});

const canLeaveGroup = computed<boolean>(() => {
    const user = session.user;
    if (user && members.value) {
        const member = members.value.find((m) =>
            m.user?.uuid === user.uuid
        );
        return member?.role !== 'owner';
    } else {
        return false;
    }
});

const canDeleteGroup = computed<boolean>(() => {
    const user = session.user;
    if (user && members.value) {
        const member = members.value.find((m) =>
            m.user?.uuid === user.uuid
        );
        return member?.role === 'owner';
    } else {
        return false;
    }
});
</script>

<style scoped>
#group-settings-modal {
    #header {
        button {
            margin-left: 1rem;
        }

        #title {
            margin: 0 auto;
        }
    }

    #actions {
        width: 100%;
        display: flex;
        max-width: 25rem;
        padding: 0rem 1rem;
        margin-bottom: 2rem;
        flex-direction: column;

        * {
            border: unset;
            padding: 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--tertiary-background-color);
        }

        .destructive {
            color: white;
            background-color: #8c1d1d;
        }
    }
}
</style>