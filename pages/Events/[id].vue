<template>
    <NavigationBar/>
    <main id="event-detail-view">
        <!-- Event Detail -->
        <div v-if="failed !== undefined && failed !== true && event != undefined" id="event-detail">
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
            <EventParticipantsPeek :event="event" @open-participants="handleOpenParticipantsModal"/>
            <EventLocations :event="event" :venues="venues"/>

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
import { useRoute } from 'vue-router';
import { VIEW_STATE } from '@/data/Enums';
import { Club } from '@/data/models/ClubModels';
import { Venue } from '@/data/models/VenueModels';
import { Event } from '@/data/models/EventModels';
import { useModelStore } from '@/stores/model-store';
import { UserSnippet } from '@/data/models/UserModels';
import { useSessionStore } from '@/stores/session-store';
import { generateImageURL } from '~/utils/image-helpers';
import { computed, ref, type Ref, useTemplateRef, } from 'vue';
import { Organization } from '@/data/models/OrganizationModels';
import { Participant, ParticipantDao } from '@/data/models/GenericModels';

import * as Sentry from '@sentry/nuxt';
import EventBody from '~/components/Events/EventBody/EventBody.vue';
import EventMedia from '~/components/Events/EventMedia/EventMedia.vue';
import EventHeader from '~/components/Events/EventHeader/EventHeader.vue';
import EventLocations from '~/components/Events/EventLocations/EventLocations.vue';
import EventOrganizers from '~/components/Events/EventOrganizers/EventOrganizers.vue';

import AuthModal from '@/components/Auth/AuthModal/AuthModal.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import EventRSVPModal from '@/components/Modals/Events/EventRSVPModal/EventRSVPModal.vue';
import EventParticipantsPeek from '@/components/Events/EventParticipants/EventParticipants.vue';
import EventDetailSettingsModal from '@/components/Modals/Events/EventDetailSettingsModal/EventDetailSettingsModal.vue';
import EventParticipantsListModal from '@/components/Modals/Events/EventParticipantsListModal/EventParticipantsListModal.vue';

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

const eventID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id;
});

/**
 * COMPUTED VARIABLES
 */

const isAuthenticated = computed<boolean>(() => {
    return auth.isAuthenticated.value;
});

const eventTitle = computed<string>(() => {
    return event.value?.title ?? 'Olympsis Events';
});

const eventBody = computed<string>(() => {
    return event.value?.body ?? 'Join olympsis to find sports events near you!';
});

const eventImageURL = computed<string | undefined>(() => {
    return event.value?.mediaURL ? generateImageURL(event.value?.mediaURL) : undefined;
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

function handleRSVPResponse(_event: any) {
    if (_event.response === 'yes') {
        handleYesResponse();
        hideRSVPModal();
    } else {
        handleMaybeResponse();
        hideRSVPModal();
    }
}

async function handleYesResponse() {
    return await handleResponse(1);
}

async function handleMaybeResponse() {
    return await handleResponse(0);
}

async function handleResponse(response: number) {
    const user = session.user;
    let snippet = new UserSnippet(
        user?.uuid ?? '',
        user?.username ?? '',
        user?.imageURL ?? ''
    )
    let ptp: Participant = Participant.decode({
        'id': `${111}`,
        'status': response,
        'user': snippet,
        'created_at': Date.now()
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
                case 1:
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
</script>

<style scoped>
#event-detail-view {
    margin: 0 auto;
    margin-bottom: auto;
    
    #event-detail {
        gap: 2rem;
        display: grid;
        margin-top: 3rem;
        position: relative;
        margin-bottom: 2rem;
        grid-template-areas:
            'media header'
            'media body'
            'media locations'
            'host locations'
            'participants locations'
            ;
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
            grid-template-areas:
            'header'
            'media'
            'body'
            'host'
            'participants'
            'locations'
            ;
            grid-template-columns: auto;
            margin: 2rem 1rem;
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
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-detail-settings-modal {
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: var(--primary-background-color);
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