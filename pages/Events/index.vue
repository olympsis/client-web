<template>
    <NavigationBar/>
    <main id="events">
        <div id="header">
            <h1>Events List</h1>

            <div id="body">
                <SearchBar v-model:value="searchText"/>
            </div>

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

        <div id="mobile-header">
            <div id="title">
                <h1>Events List</h1>

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

            <SearchBar v-model:value="searchText" />
        </div>

        <div id="sub-header">
            <SportsFilter v-model:model-value="selectedSports"/>
            <!-- <EventDateButton v-model="selectedDate"/> -->
        </div>

        <div id="events-body">
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
        </div>

        <!-- Events Settings Modal -->
        <dialog id="event-settings-modal" ref="event-settings-modal" class="dialog">
            <EventsSettings @close="eventSettingsModalRef?.close()" @update="handleSettingsChanged"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SPORTS, stringToSport, VIEW_STATE } from '@/data/Enums';
import { compareUTCNowToDateNormal } from '~/utils/time-helpers';
import { useSessionStore } from '@/stores/session-store';
import { EventService } from '@/data/services/EventService';
import { Event, EventSection } from '@/data/models/EventModels';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import SearchBar from '@/components/SearchBar/SearchBar.vue';
import SportsFilter from '~/components/SportsFilter/SportsFilter.vue';
import EventListItem2 from '~/components/Events/EventListItem-v2/EventListItem2.vue';
import EventsSettings from '~/components/Dialog/Events/EventsSettings/EventsSettings.vue';

const router = useRouter();
const session = useSessionStore();
const state = ref(VIEW_STATE.LOADING);
const eventService = new EventService();

const events = ref<Event[]>([]);
const searchText = ref<string>('');
const selectedSports: Ref<Array<SPORTS>> = ref([]);
const eventSettingsModalRef = useTemplateRef<HTMLDialogElement>('event-settings-modal');

const filteredEvents = computed<Array<Event>>(() => {
    return events.value.filter((e) => {
        var includesSport = e.sports?.find((s: string) => {
            const _sport = stringToSport(s);
            if (!_sport) return false;
            return selectedSports.value.includes(_sport);
        });

        var containsSearch = e.title?.toLowerCase().includes(searchText.value.toLowerCase());

        return e && includesSport && containsSearch;
    });
});

const eventSections = computed<EventSection[]>(() => {
    const sections: EventSection[] = [];
    filteredEvents.value.filter((e) => e.title?.toLowerCase().includes(searchText.value.toLowerCase())).forEach((e) => {
        const eventDate = new Date(e.startTime * 1000);
        const eventDay = eventDate.getDate();  // This change from getDay() was correct
        const eventMonth = eventDate.getMonth();
        const eventYear = eventDate.getFullYear();

        // Find if we have an existing section
        const existing = sections.find((s) => {
            const sectionDay = s.date.getDate();  // This change was correct too
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

    // Use getTime() instead of getMilliseconds() to sort by the full timestamp
    return sections
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

function navigateToNewEvent() {
    router.push('/events/new');
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
    // Preselect user favorite sports
    // TODO: Add the ability to remember selections
    const user = session.user;
    const sports: Array<SPORTS> = user?.sports ?? [];
    selectedSports.value = sports;

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
    display: grid;
    height: 100dvh;
    padding: 0rem 2rem;
    overflow-y: scroll;
    margin-top: 0.5rem;
    justify-content: center;
    grid-template-rows: 4rem 6rem auto auto auto;
    grid-template-areas: 
    "header"
    "sub-header"
    "list"
    "list"
    "list";

    #header {
        width: 100%;
        display: flex;
        margin-top: 1rem;
        grid-area: header;
        align-items: center;
        max-width: var(--desktop-max-width);
        justify-content: space-between;

        #body {
            width: 100%;
            max-width: 35rem;
            margin-right: 1rem;
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

    #mobile-header {
        display: none;
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
        max-width: var(--desktop-max-width);
        #loader {
            margin: auto;
            padding-top: 5rem;
        }

        #events-list {
            padding: 0;
            list-style-type: none;

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

@media (max-width: 940px) {
    #events {
        padding: 0rem 1rem;
        grid-template-rows: 6.5rem 5rem auto auto auto;

        #header {
            display: none;
        }
        
        #mobile-header {
            display: flex;
            flex-direction: column;

            #title {
                display: flex;
                flex-direction: row;
                margin: 0.5rem 0rem;
                align-content: center;
                justify-content: space-between;
            }

            #actions {
                display: flex;
                flex-direction: row;
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
            margin: unset;
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