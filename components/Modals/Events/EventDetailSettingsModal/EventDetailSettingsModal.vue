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
            <TrashMenuButton 
                v-if="eventState !== EVENT_STATE.COMPLETED && isAuthorized" 
                text="Delete event" 
                :is-destructive="true" 
                v-bind:state="deleteButtonState"
                @click="handleEventDeletion"
            />
        </div>

        <dialog id="delete-all" ref="delete-all" class="dialog">
            <EventDeleteAll
                @no="deleteEvent"
                @yes="deleteEvent(true)"
                @close="deleteAll?.close()"
            />
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { EVENT_STATE } from '@/data/Enums';
import { useToast } from 'primevue/usetoast';
import { Event } from '@/data/models/EventModels';
import { useSessionStore } from '@/stores/session-store';

import EventDeleteAll from '../EventDeleteAllModal/EventDeleteAll.vue';
import ShareMenuButton from '~/components/Buttons/MenuButton/ShareMenuButton.vue';
import TrashMenuButton from '~/components/Buttons/MenuButton/TrashMenuButton.vue';
import ReportMenuButton from '~/components/Buttons/MenuButton/ReportMenuButton.vue';

const toast = useToast();
const router = useRouter();
const session = useSessionStore();
const emit = defineEmits(['close']);
const deleteAll = useTemplateRef<HTMLDialogElement>('delete-all');

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

function handleEventDeletion() {
    if (event.value?.isRecurring) {
        deleteAll.value?.show();
    } else {
        deleteEvent();
    }
}

async function deleteEvent(deleteAll?: boolean) {
    const id = event.value?.id ?? '';
    const store = useModelStore();
    const isDeleted = await session.eventService.deleteEvent(id, deleteAll);
    if (isDeleted) {
        store.deleteEventByID(id);
        router.push('/events');
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete event!', life: 3000 });
    }
}
</script>

<style scoped>
#event-detail-settings-modal {
    min-width: 20rem;
    max-width: var(--dialog-max-width);
    background-color: var(--primary-background-color);
    
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

#delete-all {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-delete-all-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}
</style>