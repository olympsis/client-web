<template>
    <div id="event-detail-settings-modal">        
        <div id="header">
            <h1>Event Settings</h1>

            <button class="button" @click="$emit('close')">
                <picture class="centered">
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>

        <div id="actions">
            <ShareMenuButton text="Share event" @click="showCopiedToast"/>
            <ReportMenuButton text="Report event"/>
            <TrashMenuButton v-if="eventState !== EVENT_STATE.COMPLETED && isAuthorized" text="Delete event" :is-destructive="true" v-bind:state="deleteButtonState"/>
        </div>

        <Toast/>
    </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { computed, ref } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { EVENT_STATE } from '@/data/Enums';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { useSessionStore } from '@/stores/session-store';

import ShareMenuButton from '~/components/Buttons/MenuButton/ShareMenuButton.vue';
import TrashMenuButton from '~/components/Buttons/MenuButton/TrashMenuButton.vue';
import ReportMenuButton from '~/components/Buttons/MenuButton/ReportMenuButton.vue';

const toast = useToast();

const session = useSessionStore();
const emit = defineEmits(['close']);
const event = defineModel<Event | undefined>(
    'event',
    { default: undefined, required: true }
);

const statusButtonState = ref(VIEW_STATE.PENDING);
const deleteButtonState = ref(VIEW_STATE.PENDING);

const eventState = computed<EVENT_STATE>(() => {
    // Current timestamp in seconds (Unix timestamp)
    const timestamp = Math.floor(new Date().getTime() / 1000);
    
    // Convert time differences to seconds
    const thirtyMinutesAgo = timestamp - (30 * 60);
    const twoHoursAgo = timestamp - (2 * 60 * 60);
    
    // Get start and stop times, ensuring they're treated as seconds
    const startTime = (event.value?.startTime ?? 0);
    const stopTime = (event.value?.stopTime ?? 0);

    if (
        (stopTime !== 0 && stopTime < timestamp) ||
        (startTime !== 0 && startTime < twoHoursAgo)
    ) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== 0 && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});

const isAuthorized = computed<boolean>(() => {
    return session.user?.uuid === event.value?.poster?.uuid;
});

function handleEventStatusChange() {
    return eventState;
}

function showCopiedToast() {
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this event', life: 3000 });
}
</script>

<style scoped>
#event-detail-settings-modal {
    min-width: 20rem;
    max-width: var(--dialog-max-width);
    
    #header {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        justify-content: space-between;

        h1 {
            font-size: 1rem;
            font-weight: normal;
            white-space: nowrap;
            margin: auto;
            color: var(--primary-label-color);
        }

        .button {
            width: 2.5rem;
            height: 2.5rem;
            border: unset;
            cursor: pointer;
            border-radius: 10px;
            background-color: var(--tertiary-background-color);

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    #actions {
        display: flex;
        padding: 0.5rem 0rem;
        flex-direction: column;

        * {
            margin: 0.5rem 1rem;
        }
    }

    .centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>