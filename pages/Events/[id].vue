<template>
    <main id="event-detail-view" :class="{ 'dark-bg': isDarkBackground, 'light-bg': !isDarkBackground }">
        <!-- Blurred event image background -->
        <div
            v-if="eventImageURL"
            id="event-bg"
            :style="{ backgroundImage: `url(${eventImageURL})` }"
        ></div>
        <div
            v-if="failed !== undefined && failed !== true && event != undefined"
            id="event-detail"
            :style="{ '--grid-areas': gridTemplateAreas, '--grid-areas-mobile': gridTemplateAreasMobile }"
        >
            <EventMedia :event="event"/>
            <EventOrganizers :event="event" :clubs="clubs" :organizations="orgs"/>
            <EventHeader :event="event" :venues="venues" class="header"/>
            <EventBody 
                class="body" 
                :event="event"
                :venues="venues"
                @open-auth="showAuthModal" 
                @open-rsvp="showRSVPModal" 
                @open-settings="handleOpenSettingsModal"
            />

            <!-- Participants Peek -->
            <EventParticipantsPeek 
                v-if="event.participants.length > 0" 
                :event="event" 
                @open-participants="handleOpenParticipantsModal"
            />

            <!-- External Links -->
            <EventExternalLinks v-if="event.externalLinks.length > 0" :links="event.externalLinks" />

            <!-- Locations -->
            <EventLocations v-if="!hideLocation" :event="event" :venues="venues"/>

            <!-- Formats -->
            <EventFormats v-if="eventFormats.length > 0" :formats="eventFormats"/>

            <!-- Comments -->
            <EventComments :event="event"/>

            <!-- RSVP -->
            <dialog id="rsvp-modal" ref="rsvp-modal" class="dialog">
                <EventRSVPModal v-if="event" :event="event" :is-dark-background="isDarkBackground" @close="hideRSVPModal" @rsvp="handleRSVPResponse"/>
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
            <h1>{{ t('events.detail.notFound') }}</h1>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Club } from '@/data/models/ClubModels';
import { Venue } from '@/data/models/VenueModels';
import { Event } from '@/data/models/EventModels';
import { useModelStore } from '@/stores/model-store';
import { UserSnippet } from '@/data/models/UserModels';
import { useSessionStore } from '@/stores/session-store';
import { generateImageURL } from '~/utils/image-helpers';
import { computed, ref, watch, type Ref, useTemplateRef } from 'vue';
import { Organization } from '@/data/models/OrganizationModels';
import { VIEW_STATE, GROUP_ROLE, COMPETITION_FORMAT } from '@/data/Enums';
import { Participant, ParticipantDao } from '@/data/models/GenericModels';

import * as Sentry from '@sentry/nuxt';
import AuthModal from '@/components/Auth/AuthModal/AuthModal.vue';
import EventBody from '~/components/Events/EventBody/EventBody.vue';
import EventMedia from '~/components/Events/EventMedia/EventMedia.vue';
import EventHeader from '~/components/Events/EventHeader/EventHeader.vue';
import EventFormats from '~/components/Events/EventFormats/EventFormats.vue';
import EventComments from '~/components/Events/EventComments/EventComments.vue';
import EventLocations from '~/components/Events/EventLocations/EventLocations.vue';
import EventOrganizers from '~/components/Events/EventOrganizers/EventOrganizers.vue';
import EventRSVPModal from '@/components/Modals/Events/EventRSVPModal/EventRSVPModal.vue';
import EventParticipantsPeek from '@/components/Events/EventParticipants/EventParticipants.vue';
import EventDetailSettingsModal from '@/components/Modals/Events/EventDetailSettingsModal/EventDetailSettingsModal.vue';
import EventParticipantsListModal from '@/components/Modals/Events/EventParticipantsListModal/EventParticipantsListModal.vue';
import EventExternalLinks from '~/components/Events/EventExternalLinks/EventExternalLinks.vue';

const { t } = useI18n();
const auth = useAuth();
const route = useRoute();
const session = useSessionStore();
const modelStore = useModelStore();

const clubs: Ref<Array<Club>> = ref([]);
const venues: Ref<Array<Venue>> = ref([]);
const orgs: Ref<Array<Organization>> = ref([]);

const failed: Ref<boolean | undefined> = ref(false);
const primaryState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
            
const event: Ref<Event | undefined> = ref(undefined);

const authModal = useTemplateRef<HTMLDialogElement>('auth-modal');
const rsvpModal = useTemplateRef<HTMLDialogElement>('rsvp-modal');
const settingsModal = useTemplateRef<HTMLDialogElement>('settings-modal');
const participantsModal = useTemplateRef<HTMLDialogElement>('participants-modal');

/**
 * Tracks whether the event background image is dark.
 * Used to flip text colors so content stays readable over the blurred background.
 */
const isDarkBackground = ref(true); // default to dark since we apply brightness(0.6)

/**
 * Loads the image into an offscreen canvas (scaled down for speed),
 * samples every pixel, and computes average perceived luminance using
 * the standard luminance formula: L = 0.299R + 0.587G + 0.114B.
 * A threshold of 128 (out of 255) separates "dark" from "light".
 *
 * Fetches the image as a blob first to avoid CORS issues with
 * cross-origin images (e.g. Google Cloud Storage) that would taint
 * the canvas and block getImageData().
 */
async function analyzeImageBrightness(url: string) {
    if (typeof window === 'undefined') return; // skip on SSR

    try {
        // Proxy through our server API to bypass CORS restrictions on GCS
        const proxyURL = `/api/image-proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyURL);

        if (!response.ok) {
            isDarkBackground.value = true;
            return;
        }

        const blob = await response.blob();
        if (blob.size === 0) {
            isDarkBackground.value = true;
            return;
        }

        const blobURL = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Scale down for performance — 50x50 is enough to get an average
            const size = 50;
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(blobURL);
                return;
            }

            ctx.drawImage(img, 0, 0, size, size);
            const { data } = ctx.getImageData(0, 0, size, size);

            const pixelCount = data.length / 4;
            if (pixelCount === 0) {
                URL.revokeObjectURL(blobURL);
                return;
            }

            let totalLuminance = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] ?? 0;
                const g = data[i + 1] ?? 0;
                const b = data[i + 2] ?? 0;
                totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
            }

            // We also apply brightness(0.6) in CSS, so factor that into the comparison
            const avgLuminance = (totalLuminance / pixelCount) * 0.6;
            isDarkBackground.value = avgLuminance < 128;

            URL.revokeObjectURL(blobURL);
        };
        img.onerror = () => URL.revokeObjectURL(blobURL);
        img.src = blobURL;
    } catch {
        // If fetch fails, keep the default (dark background = white text)
        isDarkBackground.value = true;
    }
}

const eventID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id ?? '';
});

/**
 * COMPUTED VARIABLES
 */

const isAuthenticated = computed<boolean>(() => {
    return auth.isAuthenticated.value;
});

const eventTitle = computed<string>(() => {
    return event.value?.title ?? t('events.detail.defaultTitle');
});

const eventBody = computed<string>(() => {
    return event.value?.body ?? t('events.detail.defaultBody');
});

const eventImageURL = computed<string | undefined>(() => {
    return event.value?.mediaURL ? generateImageURL(event.value?.mediaURL) : undefined;
});

const isAdmin = computed<boolean>(() => {
    const adminGroups = session.groups.filter((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return group.members?.find((m) => m.user?.userId === session.user?.userId && m.role !== GROUP_ROLE.MEMBER);
    });
    return adminGroups.find((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return event.value?.organizers.find((o) => o.id === group.id);
    }) != undefined;
});

const hideLocation = computed<boolean>(() => {
    // If user is an admin or an event participant show location
    if (isAdmin.value || event.value?.participants.find((p) => p.user?.userId === session.user?.userId)) return false;
    return event.value?.config?.hideLocation ?? false;
});

const hasExternalLinks = computed<boolean>(() => {
    return !!event.value?.externalLinks.length;
});

const eventFormats = computed<COMPETITION_FORMAT[]>(() => {
    if (event.value?.formatConfig?.formats) {
        return event.value?.formatConfig?.formats;
    } else {
        return [];
    }
});

const hasParticipants = computed<boolean>(() => {
    return (event.value?.participants.length ?? 0) > 0;
});

const hasFormats = computed<boolean>(() => {
    return eventFormats.value.length > 0;
});

/**
 * Dynamically builds the grid-template-areas string based on which
 * optional sections (participants, formats) are visible. This prevents
 * empty grid rows from reserving space + gap when their content is hidden.
 */
const gridTemplateAreas = computed<string>(() => {
    let areas = `
        'media header'
        'media body'
        'media locations'
        'host locations'`;
    if (hasExternalLinks.value) {
        areas += `\n        'links locations'`;
    }
    if (hasParticipants.value) {
        areas += `\n        'participants locations'`;
    }
    if (hasFormats.value) {
        areas += `\n        'formats locations'`;
    }
    // Comments placed in the left column, under the shorter side of the grid
    areas += `\n        'comments locations'`;
    return areas;
});

/**
 * Same dynamic grid areas but for the mobile (single-column) layout.
 */
const gridTemplateAreasMobile = computed<string>(() => {
    let areas = `
        'header'
        'media'
        'body'
        'host'`;
    if (hasExternalLinks.value) {
        areas += `\n        'links'`
    }
    if (hasParticipants.value) {
        areas += `\n        'participants'`;
    }
    if (hasFormats.value) {
        areas += `\n        'formats'`;
    }
    areas += `\n        'locations'`;
    areas += `\n        'comments'`
    return areas;
});

/**
 * FUNCTIONS
 */


function showAuthModal() {
    if (authModal.value) {
        authModal.value.showModal()
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
        rsvpModal.value.showModal();
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

function handleRSVPResponse(_event: any) {
    handleResponse(_event.response === 'yes' ? 1 : 0, _event.hide);
    hideRSVPModal();
}

async function handleResponse(response: number, hide: boolean | undefined = undefined) {
    const user = session.user;
    let snippet = new UserSnippet(
        user?.userId,
        user?.firstName,
        user?.lastName,
        user?.username ,
        user?.imageURL
    );
    let ptp: Participant = Participant.decode({
        'id': `${111}`,
        'status': response,
        'user': snippet,
        'is_anonymous': hide,
        'created_at': Date.now()
    });
    
    try {
        let dao = new ParticipantDao(
            undefined,
            session.user?.userId,
            response,
            hide,
            undefined
        );

        if (event.value?.id) {
            primaryState.value = VIEW_STATE.LOADING;
            if (await session.eventService.addParticipant(event.value.id, dao)) {
                event.value?.participants.push(ptp)
                primaryState.value = VIEW_STATE.PENDING;
            }
        }
    } catch(error) {
        primaryState.value = VIEW_STATE.PENDING;
        console.error(`Failed to add participant. Error: ${error}`);
        
        Sentry.withScope((scope: any) => {
            scope.setExtra('action', 'rsvp');
            scope.setExtra('event', event.value?.id);
            Sentry.captureException(error);
        });
        return;
    }
}

function handleOpenParticipantsModal() {
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }
    if (participantsModal.value) {
        participantsModal.value.showModal();
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
        settingsModal.value.showModal();
    }
}

function handleCloseSettingsModal() {
    if (settingsModal.value) {
        settingsModal.value.close();
    }
}

function handleNewUserAuthentication() {
    auth.initAuth();
    session.init();
    hideAuthModal();
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
                default:
                    if (o.id) {
                        promises.push(session.clubService.getClub(o.id));
                    }
                    break;
                case "ORGANIZATION":
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
    if (!newData) {
        failed.value = true;
        return;
    };
    
    event.value = Event.decode(newData.event);
    clubs.value = newData.clubs.map((c) => Club.decode(c));
    orgs.value = newData.orgs.map((o) => Organization.decode(o));
    venues.value = newData.venues.map((v) => Venue.decode(v));

    // Commit new models to model store
    if (event.value) {
        modelStore.setEvent(event.value);
    }

    if (clubs.value) {
        clubs.value.forEach((c) => {
            modelStore.setClub(c);
        });
    }

    if (orgs.value) {
        orgs.value.forEach((o) => {
            modelStore.setOrganization(o);
        });
    }
    
    if (venues.value) {
        venues.value.forEach((v) => {
            modelStore.setVenue(v);
        })
    }
}, { immediate: true });

// Analyze the event image brightness once it's available (client-side only)
watch(eventImageURL, (url) => {
    if (url) analyzeImageBrightness(url);
}, { immediate: true });
</script>

<style scoped>
#event-detail-view {
    margin: 0 auto;
    margin-bottom: auto;
    position: relative;
    min-height: 100vh;

    /* Blurred event image that fills the entire view */
    #event-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        filter: blur(40px) brightness(0.6);
        transform: scale(1.1); /* prevents blur white edges */
    }

    #event-detail {
        gap: 1rem;
        display: grid;
        margin-top: 3rem;
        position: relative;
        z-index: 1;
        margin-bottom: 2rem;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: 30rem 30rem;

        .body {
            margin-top: 1rem;
            max-width: 30rem;
        }

        #event-detail-desktop {
            gap: 2rem;
            display: grid;
            position: relative;
            grid-template-areas:
            'media header'
            'media body'
            'host location'
            'formats location'
            ;
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

        @media(max-width: 1100px) {
            grid-template-areas: var(--grid-areas-mobile);
            grid-template-columns: 1fr;
            max-width: 30rem;
            margin: 2rem auto;
            padding: 0 1rem;
            .body {
                margin-top: unset;
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
        position: relative;
        z-index: 1;
        
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

#settings-modal {
    border: unset;
    background: transparent;

    &::backdrop {
        backdrop-filter: blur(5px);
    }

    #event-detail-settings-modal {
        border-radius: 20px;
        border: var(--component-border-color) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}

#participants-modal {
    border: unset;
    background: transparent;

    &::backdrop {
        backdrop-filter: blur(5px);
    }

    #participants-modal {
        border-radius: 20px;
        border: var(--component-border-color) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}

#rsvp-modal {
    border: unset;
    background: transparent;

    &::backdrop {
        backdrop-filter: blur(5px);
    }

    #event-rsvp-modal {
        border-radius: 20px;
        max-width: 25rem !important;
        border: var(--component-border-color) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}

#auth-modal {
    border: unset;
    width: fit-content;
    height: fit-content;
    margin: auto;
    background: transparent;

    &::backdrop {
        backdrop-filter: blur(5px);
    }

    .auth-card {
        border-radius: 20px;
        max-width: 25rem !important;
        border: var(--component-border-color) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}


</style>

<!--
  Unscoped so the CSS variable overrides cascade into child components.
  Scoped styles add [data-v-xxx] selectors that prevent children from
  inheriting the overridden values.
-->
<style>
#event-detail-view.dark-bg {
    --primary-label-color: #FFFFFF;
    --secondary-label-color: #D6D6D6;
    --component-border-color: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
}

#event-detail-view.light-bg {
    --primary-label-color: #000000;
    --secondary-label-color: #2C2C2E;
    --component-border-color: rgba(0, 0, 0, 0.15);
    color: #000000;
}

/*
 * Force block-button icons to match the computed text color.
 * brightness(0) makes any SVG black; adding invert(1) flips it to white.
 * Works regardless of which <picture> source the browser selected.
 * Only targets #bold-text-button-label so EventPrimaryButton icons
 * (which are always white on colored backgrounds) stay unaffected.
 */
#event-detail-view.dark-bg #bold-text-button-label #button img,
#event-detail-view.dark-bg #event-header img,
#event-detail-view.dark-bg #event-locations .icon img,
#event-detail-view.dark-bg #event-external-links .icon img {
    filter: brightness(0) invert(1);
}

#event-detail-view.light-bg #bold-text-button-label #button img,
#event-detail-view.light-bg #event-header img,
#event-detail-view.light-bg #event-locations .icon img,
#event-detail-view.light-bg #event-external-links .icon img {
    filter: brightness(0);
}

#event-detail-view.dark-bg #event-comments textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

#event-detail-view.light-bg #event-comments textarea::placeholder {
    color: rgba(0, 0, 0, 0.5);
}
</style>