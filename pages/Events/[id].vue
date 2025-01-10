<template>
    <NavigationBar/>
    <main id="event-detail-view">
        <!-- Event Detail -->
        <div v-if="failed !== undefined && failed !== true" id="event-detail">
            <!-- Desktop View -->
            <div id="event-detail-desktop">
                <div id="event-detail-left-section">
                    <!-- Event Header -->
                    <div id="header">
                        <button class="button" :style="{ marginRight: '1rem' }" @click="router.push('/events')">
                            <picture class="centered">
                                <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                                <img src="@/assets/icons/chevron/chevron.left.svg"/>
                            </picture>
                        </button>

                        <button class="button" @click="handleEventSharing">
                            <picture class="centered">
                                <source srcset="@/assets/icons/share/share.white.svg" media="(prefers-color-scheme: dark)">
                                <img src="@/assets/icons/share/share.svg"/>
                            </picture>
                        </button>
                    </div>

                    <!-- Event Title -->
                    <h1 id="title">{{ event?.title }}</h1>

                    <!-- Event Sub header -->
                    <div id="sub-header">
                        <div id="organizers">
                            <img src="@/assets/icons/group/group.secondary.svg"/>
                            <h2>{{ organizers }}</h2>
                        </div>
                        <div id="venue-wrapper">
                            <img src="@/assets/icons/pin-drop/pin-drop.secondary.svg"/>
                            <div class="venue">
                                <h3 class="name"> {{ venueName }} </h3>
                                <h4 class="location"> {{ venueLocation }} </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Event Body -->
                    <div id="event-body">
                        <div class="info">
                            <h2> Details </h2>
                            <hr :style="{ width: '100%', margin: '0rem 1rem', color: 'gray', 'background-color': 'gray' }"/>
                            <p>{{ eventDate }}</p>
                        </div>
                        <p class="description">{{ eventDescription }}</p>
                    </div>
                    
                    <!-- Event Details -->
                    <div id="event-details">
                        <div class="time">
                            <p :class="{ 
                                'label': true,
                                'ended-label': eventState === EVENT_STATE.COMPLETED,
                                'live-label': eventState === EVENT_STATE.LIVE,
                                'ready-label': eventState === EVENT_STATE.PENDING,
                                'pending-label': eventState === EVENT_STATE.PENDING && (event?.minParticipants && (event?.participants?.length ?? 0) < (event?.minParticipants ?? 1))
                            }"> {{ eventStatusText }} </p>
                            <div class="counter">
                                <img src="@/assets/icons/clock/clock.secondary.svg"/>
                                <p v-if="eventState != EVENT_STATE.LIVE"> {{ eventStartStopTime }} </p>
                                <p v-else> {{ timeElapsed }}</p>
                            </div>
                            
                        </div>

                        <div class="participants">
                            <p> {{ eventParticipants }} </p>
                        </div>

                        <div class="difficulty">
                            <div class="skill-level">
                                <div v-for="_ in eventSkillLabel" class="level-icon"></div>
                            </div>
                            <p :style="{ textTransform: 'capitalize' }"> {{ eventDifficulty }} </p>
                        </div>
                    </div>

                    <!-- Event Actions -->
                    <div id="event-actions">
                        <CarBlockButton class="action" text="Directions" @click="openMaps"/>
                        <GlobeBlockButton class="action" :text="eventVisibility"/>
                        <EllipsisBlockButton class="action" text="More" @click="handleOpenSettingsModal"/>
                    </div>

                    <!-- Participants Detail -->
                    <div id="participants-details">
                        <EventParticipantsPeek :event="event"/>
                        <button @click="handleOpenParticipantsModal">See who’s going...</button>
                    </div>
                </div>
                
                <div id="event-detail-right-section">
                    <img id="event-image" :src="eventImageURL"/>
                    <EventPrimaryButton v-if="event" v-model:event="event" v-model:state="primaryState" @click="handlePrimaryAction"/>
                </div>
            </div>

            <!-- Mobile View -->
            <div id="event-detail-mobile">
                <!-- Event Header -->
                <div id="header">
                    <button class="button" :style="{ marginRight: '1rem' }" @click="router.push('/events')">
                        <picture class="centered">
                            <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/chevron/chevron.left.svg"/>
                        </picture>
                    </button>

                    <!-- Event Title -->
                    <h1 id="title">{{ event?.title }}</h1>

                    <button class="button" @click="handleEventSharing">
                        <picture class="centered">
                            <source srcset="@/assets/icons/share/share.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/share/share.svg"/>
                        </picture>
                    </button>
                </div>

                <!-- Event Sub header -->
                <div id="sub-header">
                    <div id="organizers">
                        <img src="@/assets/icons/group/group.secondary.svg"/>
                        <h2>{{ organizers }}</h2>
                    </div>
                    <div id="venue-wrapper">
                        <img src="@/assets/icons/pin-drop/pin-drop.secondary.svg"/>
                        <div class="venue">
                            <h3 class="name"> {{ venueName }} </h3>
                            <h4 class="location"> {{ venueLocation }} </h4>
                        </div>
                    </div>
                </div>

                <!-- Event Image -->
                <img id="image" :src="eventImageURL"/>

                <!-- Event Body -->
                <div id="event-body">
                    <div class="info">
                        <h2> Details </h2>
                        <hr :style="{ width: '100%', margin: '0rem 1rem', color: 'gray', 'background-color': 'gray' }"/>
                        <p>{{ eventDate }}</p>
                    </div>
                    <p class="description">{{ eventDescription }}</p>
                </div>

                <!-- Event Details -->
                <div id="event-details">
                    <div class="time">
                        <p :class="{ 
                            'label': true,
                            'ended-label': eventState === EVENT_STATE.COMPLETED,
                            'live-label': eventState === EVENT_STATE.LIVE,
                            'ready-label': eventState === EVENT_STATE.PENDING,
                            'pending-label': eventState === EVENT_STATE.PENDING && (event?.minParticipants && (event?.participants?.length ?? 0) < (event?.minParticipants ?? 1))
                        }"> {{ eventStatusText }} </p>
                        <div class="counter">
                            <img src="@/assets/icons/clock/clock.secondary.svg"/>
                            <p v-if="eventState != EVENT_STATE.LIVE"> {{ eventStartStopTime }} </p>
                            <p v-else> {{ timeElapsed }}</p>
                        </div>
                    </div>

                    <div class="participants">
                        <p> {{ eventParticipants }} </p>
                    </div>

                    <div class="difficulty">
                        <div class="skill-level">
                            <div v-for="_ in eventSkillLabel" class="level-icon"></div>
                        </div>
                        <p :style="{ textTransform: 'capitalize' }"> {{ eventDifficulty }} </p>
                    </div>
                </div>

                <!-- Event Actions -->
                <div id="event-actions">
                    <CarBlockButton class="action" text="Directions" @click="openMaps"/>
                    <GlobeBlockButton class="action" :text="eventVisibility"/>
                    <EventPrimaryButton v-if="event" v-model:event="event" v-model:state="primaryState" @click="handlePrimaryAction"/>
                    <EllipsisBlockButton class="action" text="More" @click="handleOpenSettingsModal"/>
                </div>

                <!-- Participants Detail -->
                <div id="participants-details">
                    <EventParticipantsPeek :event="event"/>
                    <button @click="handleOpenParticipantsModal">{{ participantsPeekText }}</button>
                </div>
            </div>

            <!-- RSVP -->
            <dialog id="rsvp-modal" ref="rsvp-modal" class="dialog">
                <EventRSVPModal v-if="event" :event="event" @close="hideRSVPModal" @rsvp="handleRSVPResponse"/>
            </dialog>

            <!-- Event Participants -->
            <dialog id="participants-modal" ref="participants-modal" class="dialog">
                <EventParticipantsListModal v-if="event" :event="event" @close="handleCloseParticipantsModal"/>
            </dialog>

            <!-- Event Settings -->
            <dialog id="settings-modal" ref="settings-modal" class="dialog">
                <EventDetailSettingsModal v-if="event" v-model:event="event" @close="handleCloseSettingsModal"/>
            </dialog>

            <!-- Auth Modal -->
            <dialog id="auth-modal" ref="auth-modal" class="dialog">
                <AuthModal class="auth-card" @cancel="hideAuthModal" @user-authenticated="handleNewUserAuthentication"/>
            </dialog>
        </div>

        <!-- Event 404 -->
        <div v-if="failed === true" id="event-not-found">
            <img src="@/assets/images/event-404.svg">
            <h1>Sorry, we failed to find the event</h1>
        </div>
    </main>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '@/data/Enums';
import { useToast } from 'primevue/usetoast';
import { Club } from '@/data/models/ClubModels';
import { useRoute, useRouter } from 'vue-router';
import { generateImageURL } from '@/utils/Image';
import { Venue } from '@/data/models/VenueModels';
import { Event } from '@/data/models/EventModels';
import { getDirections } from '@/utils/MapHelpers';
import { useModelStore } from '@/stores/model-store';
import { UserSnippet } from '@/data/models/UserModels';
import { useSessionStore } from '@/stores/session-store';
import { getAnalytics, logEvent } from "firebase/analytics";
import { Organization } from '@/data/models/OrganizationModels';
import { Participant, ParticipantDao } from '@/data/models/GenericModels';
import { computed, onMounted, ref, type Ref, useTemplateRef, } from 'vue';
import { 
    AUTH_STATUS, 
    EVENT_PENDING_STATE, 
    EVENT_SKILL_LEVEL, 
    EVENT_STATE, 
    GROUP_TYPE,
    eventSkillLevelToNumber, 
} from '@/data/Enums';

import AuthModal from '@/components/Auth/AuthModal/AuthModal.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import CarBlockButton from '~/components/Buttons/BlockImageButton/CarBlockButton.vue';
import GlobeBlockButton from '~/components/Buttons/BlockImageButton/GlobeBlockButton.vue';
import EventRSVPModal from '@/components/Modals/Events/EventRSVPModal/EventRSVPModal.vue';
import EventParticipantsPeek from '@/components/Events/EventParticipants/EventParticipants.vue';
import EllipsisBlockButton from '~/components/Buttons/BlockImageButton/EllipsisBlockButton.vue';
import EventPrimaryButton from '@/components/Buttons/EventPrimaryButton/EventPrimaryButton.vue';
import EventDetailSettingsModal from '@/components/Modals/Events/EventDetailSettingsModal/EventDetailSettingsModal.vue';
import EventParticipantsListModal from '@/components/Modals/Events/EventParticipantsListModal/EventParticipantsListModal.vue';
import { EventService } from '~/data/services/EventService';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const modelStore = useModelStore();

const clubs: Ref<Array<Club>> = ref([]);
const venues: Ref<Array<Venue>> = ref([]);
const orgs: Ref<Array<Organization>> = ref([]);

const state= ref<VIEW_STATE>(VIEW_STATE.PENDING);
const primaryState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const failed: Ref<boolean | undefined> = ref(false);
            
const event: Ref<Event | undefined> = ref(undefined);
const timeElapsed: Ref<string> = ref('');

const authModal = useTemplateRef<HTMLDialogElement>('auth-modal');
const rsvpModal = useTemplateRef<HTMLDialogElement>('rsvp-modal');
const settingsModal = useTemplateRef<HTMLDialogElement>('settings-modal');
const participantsModal = useTemplateRef<HTMLDialogElement>('participants-modal');  

const eventID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id;
});

/**
 * COMPUTED VARIABLES
 */

const isAuthenticated = computed<boolean>(() => {
    return session.authStatus === AUTH_STATUS.authenticated;
});

const eventState = computed<EVENT_STATE>(() => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const thirtyMinutesAgo = timestamp - (30 * 60);
    const twoHoursAgo = timestamp - (2 * 60 * 60);

    const startTime = (event.value?.startTime) ?? 0;
    const stopTime = (event.value?.stopTime) ?? 0;

    if (
        (stopTime !== 0 && stopTime < timestamp) ||
        (startTime !== 0 && startTime < twoHoursAgo)
    ) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== undefined && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});

const eventTitle = computed<string>(() => {
    return event.value?.title ?? 'Olympsis Events';
});

const eventBody = computed<string>(() => {
    return event.value?.body ?? 'Join olympsis to find sports events near you!';
})

const eventStatusText = computed<string>(() => {
    const minParticipants = event.value?.minParticipants;

    if (eventState.value === EVENT_STATE.COMPLETED) {
        return 'Ended'
    } else if (eventState.value === EVENT_STATE.LIVE) {
        return 'Live'
    } else if (minParticipants && minParticipants < (event.value?.participants?.length ?? 0)) {
        return 'Pending';
    } else {
        return 'Game On!'
    }
});

const eventImageURL = computed<string | undefined>(() => {
    return event.value?.imageURL ? generateImageURL(event.value?.imageURL) : undefined;
});

const organizers = computed<string>(() => {
    const arr = event.value?.organizers;
    const names: string[] = [];

    if (arr && (clubs.value.length != 0 || orgs.value.length != 0)) {
        arr.forEach((organizer) => {
            switch(organizer.type) {
                case GROUP_TYPE.CLUB:
                    const c = clubs.value.find((c) => { return c.id == organizer.id });
                    if (c?.name) {
                        names.push(c?.name);
                    }
                case GROUP_TYPE.ORGANIZATION:
                    const o = orgs.value.find((o) => { return o.id == organizer.id });
                    if (o?.name) {
                        names.push(o.name);
                    }
            }
        });
    }

    if (names.length == 1) {
        return names[0];
    } else if (names.length == 2) {
        return `${names[0]} and ${names[1]}`
    } else if (names.length > 2) {
        return `${names[0]} and ${names.length - 1} others`;
    } else {
        return 'Unknown Group'
    }
});

const venueName = computed<string>(() => {
    const names: string[] = [];
    const descriptors = event.value?.venues;
    if (descriptors) {
        descriptors.forEach((d) => {
            const venue = venues.value.find((v) => { return v.id == d.id });
            if (venue) {
                if (venue.name) {
                    names.push(venue.name);
                }
            } else if(d.name) {
                names.push(d.name);
            }
        });
    }

    if (names.length == 1) {
        return names[0];
    } else if (names.length > 1) {
        return `${names[0]} & ${names.length-1} more`
    } else {
        return 'Unknown Venue';
    }
});

const venueLocation = computed<string>(() => {
    const cities: Map<string, number> = new Map();
    const states: Map<string, number> = new Map();
    const countries: Map<string, number> = new Map();

    const descriptors = event.value?.venues;
    if (descriptors) {
        descriptors.forEach((d) => {
            const venue = venues.value.find((v) => { return v.id == d.id });
            if (venue) {
                const city = venue.city;
                const state = venue.state;
                const country = venue.country;

                if (city) {
                    const exists = cities.get(city);
                    if (exists) {
                        cities.set(city, exists + 1)
                    } else {
                        cities.set(city, 1);
                    }
                }

                if (state) {
                    const exists = states.get(state);
                    if (exists) {
                        states.set(state, exists + 1)
                    } else {
                        states.set(state, 1);
                    }
                }

                if (country) {
                    const exists = countries.get(country);
                    if (exists) {
                        countries.set(country, exists + 1)
                    } else {
                        countries.set(country, 1);
                    }
                }
            } else {
                const city = d.city;
                const state = d.state;
                const country = d.country;

                if (city) {
                    const exists = cities.get(city);
                    if (exists) {
                        cities.set(city, exists + 1)
                    } else {
                        cities.set(city, 1);
                    }
                }

                if (state) {
                    const exists = states.get(state);
                    if (exists) {
                        states.set(state, exists + 1)
                    } else {
                        states.set(state, 1);
                    }
                }

                if (country) {
                    const exists = countries.get(country);
                    if (exists) {
                        countries.set(country, exists + 1)
                    } else {
                        countries.set(country, 1);
                    }
                }
            }
        });
    }

    if (cities.size > 1) {
        if (states.size > 1) {
            if (countries.size > 1) {
                const names: string[] = [];
                countries.forEach((v, k) => {
                    names.push(k);
                });

                return names.join(' & ');
            }
            const iterator = countries.keys();
            return iterator.next().value ?? 'Unknown Location';
        }
        const iterator = states.keys();
        const iterator2 = countries.keys();
        const state = iterator.next().value;
        const country = iterator2.next().value;
    
        if (state && country) {
            return `${state}, ${country}`;
        } else {
            return 'Unknown Location';
        }
    } else {
        const iterator = cities.keys();
        const iterator2 = states.keys();
        const state = iterator2.next().value;
        const city = iterator.next().value;

        if (city && state) {
            return `${city}, ${state}`;
        } else {
            return 'Unknown Location';
        }
    }
});

const eventDate = computed<string>(() => {
    return event.value?.timeToString() ?? '';
});

const eventDescription = computed<string>(() => {
    return event.value?.body ?? '';
});

const eventStartStopTime = computed<string>(() => {
    if (eventState.value === EVENT_STATE.PENDING) {
        return event.value?.startTimeToString() ?? 'Unknown';
    } else {
        const stopTime = event.value?.stopTime;
        if (stopTime) { // If we do have a stop time continue
            return event.value?.stopTimeToString() ?? 'Unknown';
        } else { // If we don't we just add 2hrs to the start time
            const startTime = event.value?.startTime;
            if (startTime) {
                const twoHoursAgo = startTime + (2 * 60 * 60);
                return event.value?.stopTimeToString(twoHoursAgo) ?? 'Unknown';
            } else {
                return 'Unknown';
            }
        }
    }
});

const eventParticipants = computed<string>(() => {
    if (event.value?.maxParticipants) {
        return `${event.value?.participants?.length ?? 0}/${event.value?.maxParticipants}`;
    } else {
        return `${event.value?.participants?.length ?? 0}/∞`;
    }
});

const eventDifficulty = computed<string>(() => {
    return event.value?.level.valueOf() ?? 'any level';
});

const eventVisibility = computed<string>(() => {
    const s = event.value?.visibility ?? 'public'
    return String(s[0]).toUpperCase() + String(s).slice(1);
});

const eventSkillLabel = computed<number>(() => {
    return eventSkillLevelToNumber(event.value?.level ?? EVENT_SKILL_LEVEL.ANY_LEVEL) + 1;
});

const hasResponded = computed<boolean>(() => {
    return event.value?.participants?.find((p) => {
        return p.user?.uuid === session.user?.uuid;
    }) !== undefined;
});

const participantsPeekText = computed<string>(() => {
    if (eventState.value == EVENT_STATE.COMPLETED) {
        return 'See who attended...';
    } else {
        return 'See who\'s going...';
    }
});

/**
 * FUNCTIONS
 */


function showAuthModal() {
    if (authModal.value) {
        authModal.value.show()
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function hideAuthModal() {
    if (authModal.value) {
        authModal.value.close()
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function showRSVPModal() {
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }
    if (rsvpModal.value) {
        rsvpModal.value.show();
    } else {
        console.error('Failed to find reference to RSVP Modal');
    }
}

function hideRSVPModal() {
    if (rsvpModal.value) {
        rsvpModal.value.close();
    } else {
        console.error('Failed to find reference to RSVP Modal');
    }
}

function handleRSVPResponse(event: any) {
    if (event.response === 'yes') {
        handleYesResponse();
        hideRSVPModal();
    } else {
        handleMaybeResponse();
        hideRSVPModal();
    }
}

async function handleYesResponse() {
    return await handleResponse('yes');
}

async function handleMaybeResponse() {
    return await handleResponse('maybe');
}

async function handleResponse(response: string) {
    let snippet: UserSnippet = UserSnippet.decode({
        'uuid': session.user?.uuid ?? '',
        'username': session.user?.username ?? '',
        'image_url': session.user?.imageURL ?? ''
    });
    let ptp: Participant = Participant.decode({
        'id': `${111}`,
        'status': response,
        'user': snippet,
        'created_at': Math.floor(Date.now() / 1000)
    });

    try {
        let dao = new ParticipantDao(
            undefined,
            session.user?.uuid,
            response,
            undefined
        );

        if (event.value?.id) {
            primaryState.value = VIEW_STATE.LOADING;
            if (await session.eventService.addParticipant(event.value.id, dao)) {
                event.value?.participants?.push(ptp)
                primaryState.value = VIEW_STATE.PENDING;
            }
        }
    } catch(error) {
        primaryState.value = VIEW_STATE.PENDING;
        console.error(`Failed to add participant. Error: ${error}`);
        return;
    }
}

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

function openMaps() {
    if (event.value?.venues) {
        let coordinates: Array<Number>;
        const descriptor = event.value?.venues[0];
        if (descriptor) {
            if (descriptor.location?.coordinates) {
                getDirections(descriptor.location.coordinates)
            } else {
                const venue = venues.value.find((v: any) => {
                    return v.id == descriptor.id;
                });

                if (venue && venue.location?.coordinates) {
                    getDirections(venue.location?.coordinates)
                }
            }
        }
    }
}

function handleOpenParticipantsModal() {
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }
    if (participantsModal.value) {
        participantsModal.value.show();
    }
}

function handleCloseParticipantsModal() {
    if (participantsModal.value) {
        participantsModal.value.close();
    }
}

function handleOpenSettingsModal() {
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }
    if (settingsModal.value) {
        settingsModal.value.show();
    }
}

function handleCloseSettingsModal() {
    if (settingsModal.value) {
        settingsModal.value.close();
    }
}

function handleEventSharing() {
    navigator.clipboard.writeText(window.location.href);
    showCopiedToast()
}

function getPendingEventState(): EVENT_PENDING_STATE {
    const user = session.user;
    const participants = event.value?.participants ?? [];
    if (user) {
        if (participants?.find((p) => p.user?.uuid === user?.uuid)) {
            return EVENT_PENDING_STATE.CANCEL;
        }
    }
    if (event.value?.maxParticipants && participants?.length >= event.value?.maxParticipants) {
        return EVENT_PENDING_STATE.WAITLIST;
    } else {
        return EVENT_PENDING_STATE.RSVP;
    }
}

function handlePrimaryAction() {
    // We only have primary actions when an event isn't live or completed
    if (eventState.value === EVENT_STATE.PENDING) {
        const _state = getPendingEventState();
        switch (_state) {
            case EVENT_PENDING_STATE.CANCEL:
                cancelRSVPResponse();
                break;
            case EVENT_PENDING_STATE.WAITLIST:
                throw('NOT IMPLEMENTED YET');
            case EVENT_PENDING_STATE.RSVP:
                showRSVPModal();
                break;
        }
    }
}

function handleNewUserAuthentication() {
    session.checkAuthorizationStatus();
    hideAuthModal();
}

function showCopiedToast() {
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this event', life: 3000 });
}

async function loadEventData(id: string) {
    let promises: any[] = [];
    let clubsArr: Club[] = [];
    let venuesArr: Venue[] = [];
    let orgsArr: Organization[] = [];

    const _event = await session.eventService.getEvent(id);
    
    if (_event.organizers) {
        _event.organizers.forEach(async (o) => {
            switch (o.type) {
                case GROUP_TYPE.CLUB:
                    if (o.id) {
                        promises.push(session.clubService.getClub(o.id));
                    }
                    break;
                case GROUP_TYPE.ORGANIZATION:
                    if (o.id) {
                        promises.push(session.orgService.getOrganization(o.id));
                    }
                    break;
            }
        })
    }

    if (_event.venues) {
        _event.venues.forEach(async (v) => {
            if (v.id) {
                promises.push(session.venueService.getVenue(v.id));
            }
        });
    }

    await Promise.allSettled(promises)
        .then((results) => {
            results.forEach((p) => {
                if (p.status === 'fulfilled') {
                    if (Object.getPrototypeOf(p.value) === Club.prototype) {
                        clubsArr.push(p.value);
                    } else if (Object.getPrototypeOf(p.value) === Organization.prototype) {
                        orgsArr.push(p.value);
                    } else if (Object.getPrototypeOf(p.value) === Venue.prototype) {
                        venuesArr.push(p.value);
                    }
                } else {
                    console.debug('%c Failed to fetch model on event load.', 'color: red;')
                }
            })
        });

    return { 
        event: _event.encode(), 
        clubs: clubsArr.map((c) => c.encode()), 
        orgs: orgsArr.map((o) => o.encode()), 
        venues: venuesArr.map((o) => o.encode()) 
    };
}

const config = useRuntimeConfig();
useSeoMeta({
    title: () => eventTitle.value,
    description: () => eventBody.value,
    
    ogType: 'website',
    ogLocale: 'en_US',
    ogSiteName: 'Olympsis',
    ogUrl: () => `https://olympsis.com/events/${eventID.value}`,
    ogTitle: () => eventTitle.value,
    ogImage: () => eventImageURL.value,
    ogDescription: () => eventBody.value,

    twitterSite: '@olympsis',
    twitterTitle: () => eventTitle.value,
    twitterCard: 'summary_large_image',
    twitterImage: () => eventImageURL.value,
    twitterDescription: () => eventBody.value,

    appleItunesApp: {
        appId: config.public.APP_ID,
        appArgument: `/events/${eventID.value}`
    }
});

const { data } = await useAsyncData(
    `events/${eventID.value}`,
    () => loadEventData(eventID.value),
    {
        server: true,
        lazy: false,
        immediate: true,
    }
);

watch(data, (newData) => {
    if (!newData) return;
    event.value = Event.decode(newData.event);
    clubs.value = newData.clubs.map((c) => Club.decode(c));
    orgs.value = newData.orgs.map((o) => Organization.decode(o));
    venues.value = newData.venues.map((v) => Venue.decode(v));
}, { immediate: true });

onMounted(() => {
    if (session.authStatus !== AUTH_STATUS.authenticated) {
        const analytics = getAnalytics();
        logEvent(analytics, 'guest_user_visit', { page: 'event_detail' });
    }
});
</script>

<style scoped>
#event-detail-view {
    margin-bottom: auto;
    
    #event-detail {
        margin-bottom: 2rem;
        #event-detail-desktop {
            gap: 2rem;
            display: grid;
            position: relative;
            grid-template-areas:
            'info image'
            'info image';
            grid-template-columns: 30rem 30rem;

            #event-detail-left-section {
                grid-area: info;
            }

            #event-detail-right-section {
                display: flex;
                margin-top: 4rem;
                max-height: 90vh;
                grid-area: image;
                margin-bottom: 6rem;
                align-items: center;
                flex-direction: column;

                #event-image {
                    height: auto;
                    max-width: 30rem;
                    margin-bottom: 1rem;
                }

                .action {
                    display: flex;
                    width: 100%;
                    height: 5.5rem;
                    cursor: pointer;
                    max-width: 15rem;
                    border-radius: 1rem;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    color: var(--primary-label-color);
                    background-color: var(--secondary-background-color);

                    img {
                        width: 2.5rem;
                        height: 2.5rem;
                    }

                    p {
                        font-size: 0.9rem;
                    }
                }
            }

            #header {
                margin: 1rem 0rem;

                .button {
                    all: unset;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 10px;
                    background-color: var(--secondary-background-color);

                    &:hover {
                        transform: scale(1.1);
                    }
                }

                .centered {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            #sub-header {
                margin-top: 1rem;
                margin-right: 1rem;
                margin-bottom: 1rem;

                #organizers {
                    display: flex;
                    align-items: flex-end;

                    h2 {
                        font-weight: normal;
                        margin: 0rem 0.5rem;
                        color: var(--primary-label-color);
                    }
                }

                #venue-wrapper {
                    display: flex;
                    align-items: center;

                    .venue {
                        margin: 0.25rem 0.5rem;
                        .name {
                            font-weight: 500;
                            color: var(--primary-label-color);
                        }

                        .location {
                            color: gray;
                            font-weight: normal;
                        }
                    }
                }
            }

            #event-body {
                margin: 1rem 0rem;
                color: var(--primary-label-color);

                .info {
                    display: flex;
                    align-items: center;
                }

                .description {
                    margin: 0.5rem 0rem;
                    font-size: 1rem;
                }
            }

            #event-details {
                display: flex;
                padding: 1.5rem;
                margin: 2rem 0rem;
                align-items: center;
                border-radius: 10px;
                justify-content: space-around;
                color: var(--primary-label-color);
                background-color: var(--secondary-background-color);

                .participants {
                    align-items: center;
                }
            }

            #event-actions {
                gap: 1rem;
                display: flex;
                margin: 2rem 0rem;
                justify-content: space-around;

                .action {
                    display: flex;
                    width: 100%;
                    height: 5.5rem;
                    cursor: pointer;
                    max-width: 15rem;
                    border-radius: 1rem;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    color: var(--primary-label-color);
                    background-color: var(--secondary-background-color);

                    img {
                        width: 2.5rem;
                        height: 2.5rem;
                    }

                    p {
                        font-size: 0.9rem;
                    }
                }

                .rsvp {
                    color: white;
                    background-color: var(--primary-brand-color);
                }

                .cancel {
                    color: white;
                    background-color: var(--secondary-brand-color);
                }
            }

            #participants-details {
                margin-top: 1rem;
                margin-bottom: 5rem;

                display: flex;
                align-items: center;
                justify-content: space-between;

                button {
                    all: unset;
                    cursor: pointer;
                    white-space: nowrap;
                    color: var(--primary-label-color);
                }
            }
        }

        #event-detail-mobile {
            display: none;
        }

        @media(max-width: 1050px) {
            #event-detail-desktop {
                display: none;
            }

            #event-detail-mobile {
                display: flex;
                max-width: 32rem;
                position: relative;
                flex-direction: column;

                #header {
                    display: flex;
                    margin: 1rem 1rem;
                    flex-direction: row;
                    justify-content: space-between;

                    h1 {
                        margin: auto;
                    }

                    .button {
                        all: unset;
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 10px;
                        background-color: var(--secondary-background-color);

                        &:hover {
                            transform: scale(1.1);
                        }
                    }

                    .centered {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                #sub-header {
                    margin: 0.5rem 1rem;

                    #organizers {
                        display: flex;
                        align-items: flex-end;

                        h2 {
                            font-weight: normal;
                            margin: 0rem 0.5rem;
                            color: var(--primary-label-color);
                        }
                    }

                    #venue-wrapper {
                        display: flex;
                        align-items: center;

                        .venue {
                            margin: 0.25rem 0.5rem;
                            .name {
                                font-weight: 500;
                                color: var(--primary-label-color);
                            }

                            .location {
                                color: gray;
                                font-weight: normal;
                            }
                        }
                    }
                }

                #image {
                    width: 100vw;
                    max-width: 32rem;
                    max-height: 25rem;
                    object-fit: cover;
                }


                #event-body {
                    margin-top: 1rem;
                    margin-left: 1rem;
                    margin-right: 1rem;
                    color: var(--primary-label-color);

                    .info {
                        display: flex;
                        align-items: center;
                    }

                    .description {
                        margin: 0.5rem 0rem;
                        font-size: 1rem;
                    }
                }

                #event-details {
                    display: flex;
                    padding: 1.5rem;
                    margin: 1rem;
                    align-items: center;
                    border-radius: 10px;
                    justify-content: space-around;
                    color: var(--primary-label-color);
                    background-color: var(--secondary-background-color);

                    .participants {
                        align-items: center;
                    }
                }

                #event-actions {
                    gap: 1rem;
                    display: flex;
                    margin: 0rem 1rem;
                    justify-content: space-around;

                    .action {
                        display: flex;
                        width: 100%;
                        height: 5.5rem;
                        cursor: pointer;
                        max-width: 15rem;
                        border-radius: 1rem;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        color: var(--primary-label-color);
                        background-color: var(--secondary-background-color);

                        img {
                            width: 2.5rem;
                            height: 2.5rem;
                        }

                        p {
                            font-size: 0.9rem;
                        }
                    }

                    .rsvp {
                        color: white;
                        background-color: var(--primary-brand-color);
                    }

                    .cancel {
                        color: white;
                        background-color: var(--secondary-brand-color);
                    }
                }

                #participants-details {
                    margin-top: 1rem;
                    margin-bottom: 5rem;
                    margin-left: 1rem;
                    margin-right: 1rem;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    button {
                        all: unset;
                        cursor: pointer;
                        white-space: nowrap;
                        color: var(--primary-label-color);
                    }
                }
            }
        }

        #primary-action {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            #live-button {
                width: 100%;
                margin: unset;
                margin: unset !important;
                color: white !important;
                background-color: red !important;        
            }

            #ended-button {
                width: 100%;
                margin: unset !important;
                cursor: pointer;
                color: white !important;
                background-color: gray !important;
            }
        }
    }

    #event-not-found {
        width: 50vw;
        display: flex;
        align-items: center;
        flex-direction: column;
        height: calc(100vh - 60px);
        
        img {
            margin-top: 5rem;
        }

        h1 {
            margin-top: 1rem;
            font-size: 1.5rem;
            text-align: center;
        }
    }
}

h1 {
    color: var(--primary-label-color);
}

.difficulty {
    .skill-level {
        display: flex; 
        align-items: center; 
        margin-bottom: 0.25rem;
        justify-content: center;

        .level-icon {
            width: 0.75rem; 
            height: 0.75rem;
            border-radius: 50%;
            margin: 0rem 0.15rem;
            background-color: var(--quaternary-brand-color);
        }
    }
}

.counter {
    display: flex;
    align-items: center;

    img {
        margin: 0rem 0.15rem;
    }
}

.label {
    font-weight: bold;
    margin-bottom: 0.25rem;
}

.ended-label {
    color: gray;
}

.ready-label {
    color: green;
}

.live-label {
    color: red;
}

.pending-label {
    color: orange;
}

#settings-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-detail-settings-modal {
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#participants-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #participants-modal {
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#rsvp-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-rsvp-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--secondary-background-color);
    }
}

#auth-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    .auth-card {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}

</style>