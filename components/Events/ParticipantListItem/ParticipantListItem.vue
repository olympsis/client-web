<template>
    <li id="participant-list-item">
        <UserIcon 
            :user="isAnonymous ? undefined : participant.user" 
            :size="2" 
            :style="{ 'height': '2.5rem' }"
            :class="{ 'yes': participant.status === EVENT_RSVP_STATUS.YES, 'maybe': participant.status === EVENT_RSVP_STATUS.MAYBE }"
        />

        <div id="info">
            <div id="identifiers">
                <div id="full-name">{{ fullName }}</div>
                <div id="username">{{ username }}</div>
            </div>
            <div v-if="hasMenu" id="separator"></div>
            <div v-if="hasMenu" id="status">{{ status }}</div>
        </div>

        <div id="menu" v-if="hasMenu && (isAdmin || isUser)">
            <button @click="toggleMenu" v-if="!isUser">
                <picture>
                    <source srcset="@/assets/icons/ellipsis/ellipsis.svg" media="(prefers-color-scheme: light)">
                    <img src="@/assets/icons/ellipsis/ellipsis.white.svg">
                </picture>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="options" :popup="true"></Menu>
        </div>
    </li>
</template>

<script setup lang="ts">
import { EVENT_RSVP_STATUS } from '~/data/Enums';
import { Participant } from '~/data/models/GenericModels';

import Menu from 'primevue/menu';
import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    participant: { type: Participant, required: true },
    isAdmin: { type: Boolean, default: false },
    isUser: { type: Boolean, default: false },
    hasMenu: { type: Boolean, default: false }
});

const menu = ref();
const options = ref<any[]>([
    {
        items: [
            {
                label: 'Remove from Event',
                icon: 'pi pi-bug',
                command: () => {
                    emit('kicked', { participant: props.participant });
                }
            }
        ]
    }
]);
const emit = defineEmits(['kicked']);
const toggleMenu = (event: any) => {
    menu.value.toggle(event);
};

const status = computed<string>(() => {
    switch (props.participant.status) {
        case EVENT_RSVP_STATUS.MAYBE:
            return 'Maybe';
        default:
            return 'Yes';
    }
});

const isAnonymous = computed<boolean>(() => {
    if (props.isAdmin) return false;

    return props.participant.isAnonymous ?? false;
});

const fullName = computed<string>(() => {
    return isAnonymous.value ? 'Anonymous User' : ((props.participant.user?.firstName ?? 'Olympsis') + ' ' + (props.participant.user?.lastName ?? 'User'));
});

const username = computed<string>(() => {
    return isAnonymous.value ? '@anon' : '@' + (props.participant.user?.username ?? 'olympsis-user')
});


</script>

<style scoped>
#participant-list-item {
    display: flex;
    align-items: center;

    #info {
        display: flex;
        margin-left: 0.5rem;
        margin-right: auto;
        align-items: center;

        #identifiers {
            #full-name {
                font-weight: 500;
                font-size: 1rem;
            }

            #username {
                color: gray;
                font-size: 0.85rem;
            }
        }

        #separator {
            width: 0.25rem;
            height: 0.25rem;
            margin: 0rem 1rem;
            border-radius: 50%;
            background-color: var(--primary-label-color);
        }

        #status {
            font-size: 0.8rem;
            font-style: italic;
        }
    }

    #menu {
        button {
            border: unset;
            cursor: pointer;
            padding-top: 5px;
            border-radius: 5px;
            background-color: var(--tertiary-background-color);
        }

        img {
            width: 2rem;
            height: 1rem;
            object-fit: cover;
        }
    }
}

.yes {
    border: 0.25rem solid var(--primary-brand-color);
}

.maybe {
    border: 0.25rem solid var(--secondary-brand-color);
}
</style>