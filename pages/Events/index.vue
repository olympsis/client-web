<template>
    <NavigationBar/>
    <main id="events">
        <div id="header">
            <h1>Events</h1>

            <div id="actions">
                <button @click="navigateToNewEvent">
                    <img src="@/assets/icons/plus/plus.white.svg">
                </button>
                <button @click="">
                    <img src="@/assets/icons/map/map.fill.svg">
                </button>
                <button @click="eventSettingsModalRef?.show()">
                    <img src="@/assets/icons/gear/gear.fill.white.svg">
                </button>
            </div>
        </div>

        <div id="sub-header">
            <SearchBar v-model:value="searchText"/>

            <div id="actions">
                <button id="past-events-button" @click="fetchCompletedEvents">
                    <img src="@/assets/icons/history/history.white.svg">
                    Past Events
                </button>
                <EventDateButton v-model="selectedDate"/>
            </div>
        </div>

        <main id="events-body">
            <div v-if="state === VIEW_STATE.LOADING" id="loader" class="spinner-loader"/>

            <div v-else-if="state === VIEW_STATE.SUCCESS && eventSections.length == 0" id="no-events" class="no-events">
                <img src="@/assets/images/event-404.svg">
                <div>No Events Found</div>
                <button class="button" @click="navigateToNewEvent">Create One</button>
            </div>

            <ul v-else-if="state === VIEW_STATE.SUCCESS && eventSections.length > 0" id="events-list">
                <li id="event-section" v-for="section in eventSections">
                    <h2>{{ section.dayString }}</h2>
                    <ul id="section-events">
                        <li v-for="event in section.events" @click="router.push(`/events/${event.id}`)">
                            <EventListItem2 :event="event"/>
                        </li>
                    </ul>
                </li>
            </ul>

            <div v-else-if="state === VIEW_STATE.FAILURE" id="not-found" class="no-events">
                <img src="@/assets/images/event-404.svg">
                <div>Failed to find Events</div>
                <button class="button" @click="retryFetchEvents">Try Again</button>
            </div>
        </main>

        <!-- Events Settings Modal -->
        <dialog id="event-settings-modal" ref="event-settings-modal" class="dialog">
            <EventsSettings @close="eventSettingsModalRef?.close()" @update="handleSettingsChanged"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SPORTS, VIEW_STATE } from '@/data/Enums';
import { compareUTCNowToDateNormal } from '~/utils/time-helpers';
import { useSessionStore } from '@/stores/session-store';
import { EventService } from '@/data/services/EventService';
import { Event, EventSection } from '@/data/models/EventModels';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import SearchBar from '@/components/SearchBar/SearchBar.vue';
import EventListItem2 from '~/components/Events/EventListItem-v2/EventListItem2.vue';
import EventDateButton from '@/components/Buttons/EventDateButton/EventDateButton.vue';
import EventsSettings from '~/components/Dialog/Events/EventsSettings/EventsSettings.vue';

const router = useRouter();
const session = useSessionStore();
const state = ref(VIEW_STATE.LOADING);
const eventService = new EventService();

const events = ref<Event[]>([]);
const searchText = ref<string>('');
const selectedDate = ref<string>(Date.now().toLocaleString());

const eventSettingsModalRef = useTemplateRef<HTMLDialogElement>('event-settings-modal');

const eventSections = computed<EventSection[]>(() => {
    const sections: EventSection[] = [];
    events.value.filter((e) => e.title?.toLowerCase().includes(searchText.value.toLowerCase())).forEach((e) => {
        const eventDate = new Date(e.startTime * 1000);
        const eventDay = eventDate.getDate()  // Changed from getDay() to getDate()
        const eventMonth = eventDate.getMonth();
        const eventYear = eventDate.getFullYear();

        // Find if we have an existing section
        const existing = sections.find((s) => {
            const sectionDay = s.date.getDate();  // Changed from getDay() to getDate()
            const sectionMonth = s.date.getMonth();
            const sectionYear = s.date.getFullYear();

            return sectionDay === eventDay && 
                sectionMonth === eventMonth &&
                sectionYear === eventYear;
        });

        if (existing) {
            existing.events.push(e);
        } else {
            const newSection = new EventSection(
                eventDate,
                compareUTCNowToDateNormal(eventDate),
                [e]
            );
            sections.push(newSection);
        }
    });

    return sections;
});

function navigateToNewEvent() {
    router.push('/events/new');
}

function handleShowEventSettingsModal() {
    if (eventSettingsModalRef.value) {
        eventSettingsModalRef.value.show();
    } else {
        console.error('Failed to find event settings modal template reference.');
    }
}

function handleHideEventSettingsModal() {
    if (eventSettingsModalRef.value) {
        eventSettingsModalRef.value.close();
    } else {
        console.error('Failed to find event settings modal template reference.');
    }
}

async function fetchEvents(fetchCompleted: boolean = false) {
    state.value = VIEW_STATE.LOADING;

    let _events: Event[];
    const sports = session.user?.sports.join(',') ?? 'all'
    const location = session.lastKnownLocation;

    if (!location) throw('Failed to get location. IMPLEMENT BETTER FALLBACK');

    _events = await eventService.getEvents(
        location.latitude, 
        location.longitude, 
        64373, // Radius of lookup
        sports, // Sports involved
        fetchCompleted ? 'ended' : 'pending, live', // Status of events
        0,
        100
    );

    return _events;
}

function fetchCompletedEvents() {
    fetchEvents(true)
        .then((resp) => {
            events.value = resp;
            state.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            console.error('Failed to get events. Error: ', error);
            state.value = VIEW_STATE.FAILURE;
        });
}

function retryFetchEvents() {
    fetchEvents()
        .then((resp) => {
            events.value = resp;
            state.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            state.value = VIEW_STATE.FAILURE;
            const config = useRuntimeConfig();
            if (config.public.MODE !== 'dev') return;
            console.error('Failed to get events. Error: ', error);
        });
}

async function handleSettingsChanged(event: { radius: number, sports: any}) {
    eventSettingsModalRef.value?.close();
    state.value = VIEW_STATE.LOADING;

    let _events: Event[];
    const radius = event.radius * 1609;
    const sports = event.sports.value.map((s: any) => s.valueOf()).join(',');
    const location = session.lastKnownLocation;

    if (!location) throw('Failed to get location. IMPLEMENT BETTER FALLBACK');

    try {
        _events = await eventService.getEvents(
            location.latitude, 
            location.longitude, 
            radius, // Radius of lookup
            sports, // Sports involved
            'pending, live', // Status of events
            0,
            100
        );

        events.value = _events;
        state.value = VIEW_STATE.SUCCESS;
    } catch (error) {
        state.value = VIEW_STATE.FAILURE;
        console.error('Failed to fetch events. Error: ' + error);
    }
}

useSeoMeta({
    title: 'Events | Olympsis',
    ogTitle: 'Events | Olympsis',
    description: 'Find sports events near you!',
    ogDescription: 'Find sports events near you!'
});

session.$subscribe((mutation: any, state) => {
    const payload = mutation.payload;
    if (payload?.lastKnownLocation) {
        retryFetchEvents();
    }
});

onMounted(() => {
    fetchEvents()
        .then((resp) => {
            events.value = resp;
            state.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            console.error('Failed to get events. Error: ', error);
            state.value = VIEW_STATE.FAILURE;
        });
});

definePageMeta({
    key: route => route.fullPath
});

</script>

<style scoped>
#events {
    width: 100%;
    padding: 0rem 1rem;

    #header {
        width: 100%;
        display: flex;
        margin-top: 1rem;
        grid-area: header;
        align-items: center;
        justify-content: space-between;

        h1 {
            color: var(--primary-label-color);
        }

        #actions {
            border-radius: 15px;
            padding: 0.5rem 0.5rem 0.25rem 0.5rem;
            background-color: var(--primary-brand-color);

            button {
                all: unset;
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                margin: 0rem 0.5rem;

                img {
                    width: 2rem;
                    height: 2rem;
                    align-self: center;
                }
            }
        }
    }

    #sub-header {
        display: flex;
        margin: 1rem 0rem;
        justify-content: space-between;

        #search-bar {
            max-width: 35rem;
            grid-area: search;
        }

        #actions {
            display: flex;
            margin-left: 1rem;    
            grid-area: actions;

            #past-events-button {
                border: unset;
                display: flex;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                margin: 0rem 1rem;
                align-items: center;
                border-radius: 10px;
                padding: 0rem 0.5rem;

                img {
                    margin-right: 0.25rem;
                }
                background-color: var(--olympsis-gray);
            }
        }

        @media (max-width: 940px) {
            width: 100%;
            display: grid;
            grid-template-areas: 
            'actions'
            'search';

            #search-bar {
                max-width: unset;
                margin: 1rem 0rem;
                width: calc(100dvw - 2rem);
            }
            
            #actions {
                margin-left: auto;

                #past-events-button {
                    margin-left: 0rem;
                    margin-right: 1rem;
                }
            }
        }
    }

    #events-body {

        #loader {
            margin: auto;
            padding-top: 5rem;
        }

        #events-list {
            padding: 0;
            overflow-y: scroll;
            list-style-type: none;
            height: calc(100dvh - 12.5rem);

            @media (max-width: 940px) {
                height: calc(100dvh - 16.85rem);
            }

            h2 {
                font-weight: 500;
                font-size: 1.2rem;
                margin: 1rem 0rem;
                color: var(--primary-label-color);
            }

            li {
                width: fit-content;
                margin: 0.5rem auto;

                #section-events {
                    padding: 0;
                    gap: 0.5rem;
                    display: grid;
                    margin: 0rem 1rem;
                    list-style-type: none;

                    grid-template-columns: 1fr 1fr 1fr;

                    li {
                        margin: 0rem;
                    }

                    @media (max-width: 1030px) { 
                        grid-template-columns: 1fr 1fr;
                    }

                    @media (max-width: 850px) {
                        grid-template-columns: 1fr;
                    }

                    @media (max-width: 500px) {
                        margin: unset;
                    }
                }
            }
        }

        #failed-events {
            width: 15rem;
            margin: auto;
            display: flex;
            padding-top: 5rem;
            align-items: center;
            flex-direction: column;

            h3 {
                color: var(--primary-label-color);
            }

            button {
                width: 7rem;
                height: 2rem;
                border: unset;
                color: white;
                cursor: pointer;
                margin: 1rem 0rem;
                border-radius: 10px;
                background-color: var(--primary-brand-color);
            }
        }
    }

    .no-events {
        display: flex;
        align-items: center;
        flex-direction: column;
        
        div {
            font-size: 1.5rem;
            font-weight: bold;
        }

        img {
            margin: 'auto';
            max-Width: 30rem; 
        }

        button {
            color: white;
            margin: 1rem 0rem;
            background-color: var(--primary-brand-color);
        }
    }
}

#event-settings-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #event-settings-dialog {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

        @media (max-width: 940px) {
            width: 98%;
        }
    }
}
</style>