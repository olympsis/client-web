<template>
    <div id="event-body">
        <div v-if="isExternalEvent" class="external-url" @click="openExternalURL">
            <picture class="icon">
                <source srcset="@/assets/icons/link/link.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/link/link.svg" :style="{ marginRight: '0.25rem' }">
            </picture>
            <p>More event details may be available out of Olympsis. Please click on this message to learn more.</p>
        </div>

        <div id="about">
            <h2>About</h2>
            <div id="body">{{ event.body }}</div>
        </div>

        <div id="actions">
            <CarBlockButton class="action" text="Directions" @click="openMaps"/>
            <GlobeBlockButton class="action" :text="eventVisibility"/>
            <EventPrimaryButton v-if="event" v-model:event="event" v-model:state="primaryState" @click="handlePrimaryAction"/>
            <EllipsisBlockButton class="action" text="More" @click="emit('open-settings')"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';
import { EVENT_PENDING_STATE, EVENT_STATE, VIEW_STATE } from '~/data/Enums';

import CarBlockButton from '~/components/Buttons/BlockImageButton/CarBlockButton.vue';
import GlobeBlockButton from '~/components/Buttons/BlockImageButton/GlobeBlockButton.vue';
import EllipsisBlockButton from '~/components/Buttons/BlockImageButton/EllipsisBlockButton.vue';
import EventPrimaryButton from '@/components/Buttons/EventPrimaryButton/EventPrimaryButton.vue';

const props = defineProps({
    venues: Array<Venue>
});

const event = defineModel<Event>('event', 
    { required: true }
);

const emit = defineEmits([
    'open-auth',
    'open-rsvp',
    'open-settings'
]);

const auth = useAuth();
const session = useSessionStore();
const primaryState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

const isAuthenticated = computed<boolean>(() => {
    return auth.isAuthenticated.value;
});

const isExternalEvent = computed<boolean>(() => {
    return event.value.externalLink != undefined && event.value.externalLink != "";
});

const eventState = computed<EVENT_STATE>(() => {
    const timestamp = Math.floor(new Date().getTime());
    const thirtyMinutesAgo = timestamp - (30 * 60);

    const startTime = (event.value?.startTime.getTime()) ?? 0;
    const stopTime = (event.value?.stopTime.getTime()) ?? 0;

    if (stopTime !== 0 && stopTime < timestamp) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== undefined && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});

const eventVisibility = computed<string>(() => {
    const s = event.value?.visibility ?? 'public'
    return String(s[0]).toUpperCase() + String(s).slice(1);
});

async function cancelRSVPResponse() {
    let index = event.value?.participants?.findIndex((p) => {
        return p.user?.uuid === session.user?.uuid;
    });

    if (index != undefined && index !== -1) {
        try {
            if (event.value?.id) {
                primaryState.value = VIEW_STATE.LOADING;

                if (await session.eventService.removeParticipant(event.value?.id)) {
                    event.value?.participants?.splice(index, 1);
                    primaryState.value = VIEW_STATE.PENDING;
                }
            }
        } catch(error) {
            primaryState.value = VIEW_STATE.PENDING;
            console.log(`Failed to remove participant. Error: ${error}`);
            return;
        }
    }
}

function getPendingEventState(): EVENT_PENDING_STATE {
    const user = session.user;
    const participants = event.value?.participants ?? [];
    if (user) {
        if (participants?.find((p) => p.user?.uuid === user?.uuid)) {
            return EVENT_PENDING_STATE.CANCEL;
        }
    }
    if (event.value?.participantsConfig?.maxParticipants && participants?.length >= event.value?.participantsConfig?.maxParticipants) {
        return EVENT_PENDING_STATE.WAITLIST;
    } else {
        return EVENT_PENDING_STATE.RSVP;
    }
}

function handlePrimaryAction() {
    // You can't interact with event until you are authenticated
    if (!isAuthenticated.value) {
        emit('open-auth');
        return;
    }

    // We only have primary actions when an event isn't live or completed
    if (eventState.value === EVENT_STATE.PENDING) {
        const _state = getPendingEventState();
        switch (_state) {
            case EVENT_PENDING_STATE.CANCEL:
                cancelRSVPResponse();
                break;
            case EVENT_PENDING_STATE.WAITLIST:
                emit('open-rsvp');
                break;
            case EVENT_PENDING_STATE.RSVP:
                emit('open-rsvp');
                break;
        }
    }
}

function openMaps() {
    if (event.value?.venues) {
        let coordinates: Array<Number>;
        const descriptor = event.value?.venues[0];
        if (descriptor) {
            if (descriptor.location?.coordinates) {
                getDirections(descriptor.location.coordinates)
            } else {
                const venue = props.venues?.find((v: any) => {
                    return v.id == descriptor.id;
                });

                if (venue && venue.location?.coordinates) {
                    getDirections(venue.location?.coordinates)
                }
            }
        }
    }
}

function openExternalURL() {
    if (event.value.externalLink) {
        window.open(event.value.externalLink)
    }
}
</script>

<style scoped>
#event-body {
    #about {
        width: 100%;
        padding: 1rem;
        border-radius: 16px;
        border: var(--icon-border-color) solid 1px;
        background-color: var(--secondary-background-color);

        #body {
            margin: 0.5rem 0rem;
        }
    }

    #actions {
        gap: 1rem;
        display: flex;
        margin: 1rem 0rem;
        justify-content: space-around;
    }
}

.external-url {
    display: flex;
    cursor: pointer;
    font-size: 0.8rem; 
    align-items: center; 
    margin: 0rem 0.5rem 1rem 0.5rem; 
}
</style>