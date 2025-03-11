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
            <button @click="router.push('/groups/reports')">
                <picture class="icon">
                    <source srcset="@/assets/icons/description/description.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/description/description.fill.svg">
                </picture>
                Applications/Reports
            </button>

            <button @click="router.push('/groups/new')">
                <picture class="icon" :style="{ width: '24px' }">
                    <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/plus/plus.svg">
                </picture>
                Create a New Group
            </button>

            <button @click="router.push('/groups/search')">
                <picture class="icon">
                    <source srcset="@/assets/icons/search/search.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/search/search.svg">
                </picture>
                Search for clubs
            </button>

            <button v-if="canLeaveGroup" class="destructive" @click="$emit('show-leave-modal')">
                <picture class="icon">
                    <source srcset="@/assets/icons/door-open/door.open.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/door-open/door.open.fill.svg">
                </picture>
                Leave Club 
            </button>
            
            <button v-if="canDeleteGroup" class="destructive" @click="$emit('show-delete-modal')"> 
                <img src="@/assets/icons/trash/trash.white.svg">
                Delete Club
            </button>
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
        padding: 0rem 2rem;
        margin-bottom: 2rem;
        flex-direction: column;

        button {
            border: unset;
            padding: 1rem;
            display: flex;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 0.3rem 0rem;
            align-items: center;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--tertiary-background-color);
        }

        .icon {
            /* width: 24px; */
            height: 24px;
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
        }

        .destructive {
            display: flex;
            color: white;
            align-items: center;
            background-color: #8c1d1d;
        }
    }
}
</style>