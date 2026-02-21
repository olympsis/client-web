<template>
    <NavigationBar/>
    <main id="events">
        <div id="header">
            <h1>{{ $t('events.listTitle') }}</h1>

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
            </div>
        </div>

        <div id="mobile-header">
            <div id="title">
                <h1>{{ $t('events.listTitle') }}</h1>

                <div id="actions">
                    <button @click="navigateToNewEvent">
                        <img src="@/assets/icons/plus/plus.white.svg">
                    </button>
                    <button @click="">
                        <img src="@/assets/icons/map/map.fill.svg">
                    </button>
                </div>
            </div>

            <SearchBar v-model:value="searchText" />
        </div>

        <div id="sub-header">
            <button id="filter" @click="showFilter = true">
                <div id="text">{{ $t('common.filters') }}</div>
                <picture :style="{height: '24px'}">
                    <source srcset="@/assets/icons/filter/filter.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/filter/filter.svg">
                </picture>
            </button>

            <Drawer v-model:visible="showFilter" position="right">
                <div class="section-header" :style="{fontWeight: 'bold'}">{{ $t('common.sports') }}</div>
                <SportsFilter v-model:model-value="selectedSports"/>

                <div class="section-header" :style="{fontWeight: 'bold'}">{{ $t('common.tags') }}</div>
                <TagsFilter v-model:model-value="selectedTags"/>
            </Drawer>
        </div>

        <div id="events-body">
            <div v-if="state === VIEW_STATE.LOADING" id="loader" class="spinner-loader"/>

            <div v-else-if="state === VIEW_STATE.SUCCESS && eventSections.length == 0" id="no-events" class="no-events">
                <img src="@/assets/images/event-404.svg">
                <div>{{ $t('events.noEventsFound') }}</div>
                <button class="button" @click="navigateToNewEvent">{{ $t('events.createOne') }}</button>
            </div>

            <ul v-else-if="state === VIEW_STATE.SUCCESS && eventSections.length > 0" id="events-list">
                <EventsSection v-if="recentlyCreatedEvents.length > 0" :title="$t('events.section.new')" :events="recentlyCreatedEvents" :show-full-time="true" v-model:state="state" />
                <EventsSection v-for="section in eventSections" :title="section.dayString" :events="section.events" v-model:state="state"/>
            </ul>

            <div v-else-if="state === VIEW_STATE.FAILURE" id="not-found" class="no-events">
                <img src="@/assets/images/event-404.svg">
                <div>{{ $t('events.failedToFind') }}</div>
                <button class="button" @click="retryFetchEvents">{{ $t('common.tryAgain') }}</button>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import * as Sentry from '@sentry/nuxt';
import { VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { EventService } from '@/data/services/EventService';
import { computed, onMounted, ref } from 'vue';
import { Event, EventSection } from '@/data/models/EventModels';
import { compareUTCNowToDateNormal } from '~/utils/time-helpers';
import { Location, Sport, Tag } from '~/data/models/GenericModels';

import Drawer from 'primevue/drawer';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TagsFilter from '~/components/TagsFilter/TagsFilter.vue';
import SportsFilter from '~/components/SportsFilter/SportsFilter.vue';
import EventListItem2 from '~/components/Events/EventListItem/EventListItem.vue';
import EventsSection from '~/components/Events/EventsSection/EventsSection.vue';

const { t } = useI18n();
const router = useRouter();
const session = useSessionStore();
const state = ref(VIEW_STATE.LOADING);
const eventService = new EventService();

const events = ref<Event[]>([]);
const searchText = ref<string>('');
const showFilter = ref<boolean>(false);
const selectedTags: Ref<Array<Tag>> = ref([]);
const selectedSports: Ref<Array<Sport>> = ref([]);

const filteredEvents = computed<Array<Event>>(() => {
    return events.value.filter((e) => { // Filter by other criteria
        var includesSport = e.sports?.find((s: string) => {
            return selectedSports.value.find((sp) => sp.name.includes(s));
        });

        var includesTag = e.tags?.find((t) => {
            return selectedTags.value.find((tg) => tg.name.includes(t));
        });

        var containsSearch = e.title?.toLowerCase().includes(searchText.value.toLowerCase());

        if (selectedSports.value.length > 0 && selectedTags.value.length > 0) {
            return includesSport && includesTag && containsSearch;
        } else if (selectedSports.value.length > 0 && selectedTags.value.length == 0) {
            return includesSport && containsSearch;
        } else if (selectedSports.value.length == 0 && selectedTags.value.length > 0) {
            return includesTag && containsSearch;
        } else {
            return e && containsSearch;
        }
    });
});

/** Events created within the last 7 days, sorted newest first */
const recentlyCreatedEvents = computed<Event[]>(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return filteredEvents.value
        .filter((e) => e.createdAt && e.createdAt >= oneWeekAgo)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, 20);
});

const eventSections = computed<EventSection[]>(() => {
    const sections: EventSection[] = [];
    filteredEvents.value.filter((e) => e.title?.toLowerCase().includes(searchText.value.toLowerCase())).forEach((e) => {
        const eventDay = e.startTime.getDate();
        const eventMonth = e.startTime.getMonth();
        const eventYear = e.startTime.getFullYear();

        // Find if we have an existing section
        const existing = sections.find((s) => {
            const sectionDay = s.date.getDate();
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
                e.startTime,
                compareUTCNowToDateNormal(e.startTime),
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
    let location = session.lastKnownLocation;
    if (!location) { 
        location = new Location(
            40.76553,
            -73.97770,
            'Manhattan',
            'New York',
            'NY',
            '',
            'United States',
            'US'
        );
    }

    _events = await eventService.getEvents(
        location.latitude, 
        location.longitude, 
        64373,
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
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'fetch_events');
                Sentry.captureException(error);
            });
        });
}

useSeoMeta({
    title: t('events.seoTitle'),
    ogTitle: t('events.seoTitle'),
    description: t('events.seoDescription'),
    ogDescription: t('events.seoDescription')
});

session.$subscribe((mutation: any, _) => {
    const payload = mutation.payload;
    if (payload?.lastKnownLocation) {
        retryFetchEvents();
    }
});

onMounted(async () => {
    // Preselect user favorite sports
    // TODO: Add the ability to remember selections
    const session = useSessionStore();
    session.user?.sports?.forEach((s) => {
        const found = session.sports.find((sp) => sp.name.includes(s));
        if (found) {
            selectedSports.value.push(found);
        }
    })

    // Request location if needed - the subscription will re-fetch events when location is obtained
    session.loadVenuesAndEvents();

    fetchEvents()
        .then((resp) => {
            events.value = resp;
            state.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            console.error('Failed to get events. Error: ', error);
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'fetch_events');
                Sentry.captureException(error);
            });
            state.value = VIEW_STATE.FAILURE;
        });
});

definePageMeta({
    key: route => route.fullPath
});

</script>

<style scoped>
#events {
    gap: 0.5rem;
    width: 100%;
    display: grid;
    height: 100dvh;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0rem 2rem;
    justify-items: center;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 4rem 2.5rem auto auto auto;
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
        justify-content: space-between;
        max-width: var(--desktop-max-width);

        #body {
            flex: 1;
            min-width: 0; /* Allow shrinking below content width */
            max-width: 35rem;
            margin-right: 1rem;
        }
        
        #actions {
            display: flex;
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
        width: 100%;
        display: flex;
        max-width: var(--desktop-max-width);
        
        #filter {
            display: flex;
            height: 2.5rem;
            cursor: pointer;
            margin-left: auto;
            width: fit-content;
            border-radius: 18px;
            align-items: center;
            padding: 0.15rem 1rem;
            justify-content: center;
            border: var(--component-border) solid 1px;
            background-color: var(--secondary-background-color);

            #text {
                font-size: 1rem;
                font-weight: 500;
                margin-right: 0.5rem;
            }
        }

        #actions {
            display: flex;
            margin-left: 1rem;    
            grid-area: actions;

        }

        @media (max-width: 940px) {
            width: 100%;
            display: grid;
            grid-template-areas: 
            'actions'
            'search';
            
            #actions {
                display: flex;
                margin-left: auto;

                #past-events-button {
                    margin-left: 0rem;
                    margin-right: 1rem;
                }
            }
        }
    }

    #events-body {
        width: 100%;
        max-width: var(--desktop-max-width);
        #loader {
            margin: auto;
            padding-top: 5rem;
        }

        #events-list {
            padding: 0;
            list-style-type: none;

            h4 {
                margin: 1rem;
                color: var(--primary-label-color);
            }

            li {
                width: 100%;
                margin: 0.5rem auto;

                #section-events {
                    padding: 0;
                    gap: 0.5rem;
                    display: grid;
                    margin: 0rem 1rem;
                    list-style-type: none;

                    grid-template-columns: repeat(3, minmax(0, 1fr));

                    li {
                        margin: 0rem;
                    }

                    @media (max-width: 1030px) {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    @media (max-width: 850px) {
                        grid-template-columns: minmax(0, 1fr);
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
        padding: 1rem;
        grid-template-rows: 5.75rem 2.5rem auto auto auto;

        #header {
            display: none;
        }
        
        #mobile-header {
            width: 100%;
            display: flex;
            flex-direction: column;

            #title {
                display: flex;
                flex-direction: row;
                margin-bottom: 0.5rem;
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

h1 {
    margin-right: 1rem;
    white-space: nowrap;
}
</style>