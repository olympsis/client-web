<template>
    <main id="events">
        <!--
            Layout (Zillow-style):
              ┌──────────────────────────────────────┐
              │  search · filters · new-event button │  <- top bar
              ├──────────────────────────────────────┤
              │           EventsExplorer              │
              │   (Map | List on desktop;             │
              │    Map + BottomSheet on mobile)       │
              └──────────────────────────────────────┘
            The explorer owns the map ↔ list mode toggle and the panel/sheet.
            This page only owns the search/filter chrome and the data fetch.
        -->
        <header id="top-bar">
            <div id="search">
                <SearchBar v-model:value="searchText"/>
            </div>

            <button id="filter-btn" @click="showFilter = true">
                <span>{{ $t('common.filters') }}</span>
                <picture :style="{ height: '20px' }">
                    <source srcset="@/assets/icons/filter/filter.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/filter/filter.svg">
                </picture>
            </button>

            <button id="new-event-btn" @click="navigateToNewEvent" :title="$t('events.create')">
                <img src="@/assets/icons/calendar/calendar.add.white.svg">
            </button>
        </header>

        <Drawer v-model:visible="showFilter" position="right">
            <div class="section-header" :style="{fontWeight: 'bold', color: 'white'}">{{ $t('common.sports') }}</div>
            <SportsFilter v-model:model-value="selectedSports"/>

            <div class="section-header" :style="{fontWeight: 'bold', color: 'white'}">{{ $t('common.tags') }}</div>
            <TagsFilter v-model:model-value="selectedTags"/>
        </Drawer>

        <section id="explorer">
            <ClientOnly>
                <!-- ClientOnly: MapKit JS only runs in the browser; SSR would error. -->
                <div v-if="state === VIEW_STATE.LOADING" class="state-loader">
                    <div class="spinner-loader"/>
                </div>
                <div v-else-if="state === VIEW_STATE.FAILURE" class="state-failure">
                    <img src="@/assets/images/event-404.svg">
                    <div>{{ $t('events.failedToFind') }}</div>
                    <button class="button" @click="retryFetchEvents">{{ $t('common.tryAgain') }}</button>
                </div>
                <EventsExplorer
                    v-else
                    :events="filteredEvents"
                    :venues="filteredVenues"
                    :initial-center="initialCenter"
                    :top-offset="64"
                />
            </ClientOnly>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import * as Sentry from '@sentry/nuxt';
import { VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { EventService } from '@/data/services/EventService';
import { VenueService } from '@/data/services/VenueService';
import { computed, onMounted, ref, watch } from 'vue';
import { Event } from '@/data/models/EventModels';
import { Venue } from '@/data/models/VenueModels';
import { Location, Sport, Tag } from '~/data/models/GenericModels';

import Drawer from 'primevue/drawer';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TagsFilter from '~/components/TagsFilter/TagsFilter.vue';
import SportsFilter from '~/components/SportsFilter/SportsFilter.vue';
import EventsExplorer from '@/components/Events/EventsExplorer/EventsExplorer.vue';

const { t } = useI18n();
const router = useRouter();
const session = useSessionStore();

const state = ref(VIEW_STATE.LOADING);
const eventService = new EventService();
const venueService = new VenueService();

const events = ref<Event[]>([]);
const venues = ref<Venue[]>([]);
const searchText = ref<string>('');
const showFilter = ref<boolean>(false);
const selectedTags: Ref<Array<Tag>> = ref([]);
const selectedSports: Ref<Array<Sport>> = ref([]);

// Default to user's last known location, falling back to NYC so the map
// always has a sensible center on first paint.
const initialCenter = computed<number[]>(() => {
    const loc = session.lastKnownLocation;
    if (loc) return [loc.longitude, loc.latitude];
    return [-73.9776, 40.7655];
});

// ── Filtering — applied client-side to both events and venues ──────────────

const filteredEvents = computed<Event[]>(() => {
    const search = searchText.value.toLowerCase();
    const sportNames = selectedSports.value.map((s) => s.name.toLowerCase());
    const tagNames = selectedTags.value.map((t) => t.name.toLowerCase());

    return events.value.filter((e) => {
        const matchesSearch = !search || e.title?.toLowerCase().includes(search);
        const matchesSport = sportNames.length === 0
            || e.sports?.some((s) => sportNames.some((sn) => s.toLowerCase().includes(sn)));
        const matchesTag = tagNames.length === 0
            || e.tags?.some((t) => tagNames.some((tn) => t.toLowerCase().includes(tn)));
        return matchesSearch && matchesSport && matchesTag;
    });
});

const filteredVenues = computed<Venue[]>(() => {
    const search = searchText.value.toLowerCase();
    const sportNames = selectedSports.value.map((s) => s.name.toLowerCase());

    return venues.value.filter((v) => {
        const matchesSearch = !search || v.name?.toLowerCase().includes(search);
        const matchesSport = sportNames.length === 0
            || v.sports?.some((s) => sportNames.some((sn) => s.toLowerCase().includes(sn)));
        // Tags don't apply to venues; ignore them.
        return matchesSearch && matchesSport;
    });
});

function navigateToNewEvent() {
    router.push('/events/new');
}

/**
 * Fetch events and venues independently in parallel. Events use the same
 * `/v1/events` endpoint the original page used (filtered to pending/live by
 * default); venues use `/v1/venues`. Either side failing falls back to an
 * empty array so the explorer can still partially render.
 */
async function fetchEventsAndVenues() {
    state.value = VIEW_STATE.LOADING;

    const sports = selectedSports.value.length > 0
        ? selectedSports.value.map((s) => s.name.toLowerCase()).join(',')
        : session.user?.sports.join(',') ?? 'all';

    let location = session.lastKnownLocation;
    if (!location) {
        location = new Location(
            40.76553, -73.97770,
            'Manhattan', 'New York', 'NY', '', 'United States', 'US'
        );
    }

    const [eventsResult, venuesResult] = await Promise.allSettled([
        eventService.getEvents(
            location.latitude,
            location.longitude,
            64373,
            sports,
            'pending,live',
            0,
            100
        ),
        venueService.getVenues(
            location.latitude,
            location.longitude,
            64373,
            sports
        ),
    ]);

    return {
        events: eventsResult.status === 'fulfilled' ? eventsResult.value : [],
        venues: venuesResult.status === 'fulfilled' ? (venuesResult.value?.venues ?? []) : [],
    };
}

function retryFetchEvents() {
    fetchEventsAndVenues()
        .then((resp) => {
            events.value = resp.events;
            venues.value = resp.venues;
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
    ogDescription: t('events.seoDescription'),
});

// ── Persistent filter state (unchanged from previous implementation) ───────

const FILTER_STORAGE_KEY = 'olympsis-event-filters';

function saveFiltersToStorage() {
    const data = {
        sports: selectedSports.value.map((s) => s.name),
        tags: selectedTags.value.map((t) => t.name),
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(data));
}

function restoreFiltersFromStorage(): boolean {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return false;
    try {
        const data = JSON.parse(raw) as { sports: string[]; tags: string[] };
        if (!data.sports?.length && !data.tags?.length) return false;
        data.sports.forEach((name) => {
            const found = session.sports.find((sp) => sp.name === name);
            if (found) selectedSports.value.push(found);
        });
        data.tags.forEach((name) => {
            const found = session.tags.find((tg) => tg.name === name);
            if (found) selectedTags.value.push(found);
        });
        return selectedSports.value.length > 0 || selectedTags.value.length > 0;
    } catch {
        return false;
    }
}

// Refetch only when filters were *added* (existing data narrows client-side
// when filters are removed). Mirrors the previous events page behavior.
let previousSports: string[] = [];
let previousTags: string[] = [];

watch(showFilter, (visible) => {
    if (visible) {
        previousSports = selectedSports.value.map((s) => s.name);
        previousTags = selectedTags.value.map((t) => t.name);
    } else {
        const currentSports = selectedSports.value.map((s) => s.name);
        const currentTags = selectedTags.value.map((t) => t.name);

        const addedSports = currentSports.some((s) => !previousSports.includes(s));
        const addedTags = currentTags.some((t) => !previousTags.includes(t));

        const changed = currentSports.length !== previousSports.length
            || currentSports.some((s, i) => s !== previousSports[i])
            || currentTags.length !== previousTags.length
            || currentTags.some((t, i) => t !== previousTags[i]);

        if (changed) {
            saveFiltersToStorage();
            if (addedSports || addedTags) {
                retryFetchEvents();
            }
        }
    }
});

session.$subscribe((mutation: any, _) => {
    const payload = mutation.payload;
    if (payload?.lastKnownLocation) {
        retryFetchEvents();
    }
});

onMounted(() => {
    const restored = restoreFiltersFromStorage();
    if (!restored) {
        session.user?.sports?.forEach((s) => {
            const found = session.sports.find((sp) => sp.name.includes(s));
            if (found) selectedSports.value.push(found);
        });
    }

    fetchEventsAndVenues()
        .then((resp) => {
            events.value = resp.events;
            venues.value = resp.venues;
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
    key: (route) => route.fullPath,
});
</script>

<style scoped>
#events {
    width: 100%;
    height: 100dvh;
    display: grid;
    overflow: hidden;
    grid-template-rows: 4rem minmax(0, 1fr);
    grid-template-areas:
        'top-bar'
        'explorer';
}

#top-bar {
    grid-area: top-bar;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--component-border-color);
    background-color: var(--primary-background-color);

    #search {
        flex: 1;
        min-width: 0;
        max-width: 35rem;
    }

    #filter-btn {
        display: flex;
        height: 2.5rem;
        cursor: pointer;
        align-items: center;
        gap: 0.5rem;
        padding: 0 1rem;
        border-radius: 18px;
        font-size: 1rem;
        font-weight: 500;
        border: var(--component-border-color) solid 1px;
        background-color: var(--secondary-background-color);
        color: var(--primary-label-color);

        &:hover {
            background-color: var(--tertiary-background-color);
        }
    }

    #new-event-btn {
        all: unset;
        display: flex;
        width: 2.5rem;
        height: 2.5rem;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        border: var(--component-border-color) solid 1px;
        background: rgba(38, 46, 87, 0.85); /* primary-brand-color @ 0.85 */

        img { width: 1.6rem; height: 1.6rem; }
    }
}

#explorer {
    grid-area: explorer;
    height: 100%;
    overflow: hidden;
}

.state-loader,
.state-failure {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;

    img { max-width: 20rem; }
    div { font-size: 1.25rem; font-weight: bold; }

    .button {
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 10px;
        background-color: var(--primary-brand-color);
        border: none;
        cursor: pointer;
    }
}

@media (max-width: 940px) {
    #top-bar {
        padding: 0.5rem;

        #filter-btn span {
            display: none; /* keep just the icon to save horizontal space */
        }
    }
}
</style>

<style>
/* Unscoped to override PrimeVue Drawer internal styles — same as before. */
.p-drawer .p-drawer-content,
.p-drawer .p-drawer-header {
    background: transparent;
    border: none;
}

.p-drawer {
    border: var(--component-border-color) solid 1px;
    border-right: none;
    border-bottom: none;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12) !important;
}

.p-drawer-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 20px;
    border: var(--component-border-color) solid 1px !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12) !important;
    color: white !important;
}
</style>
