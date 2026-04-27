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

            <!--
                Tags only apply to events; in venues mode we hide the section so
                the drawer doesn't expose a control with no effect. The explorer
                v-model'd `explorerMode` keeps this in sync with the toggle.
            -->
            <template v-if="explorerMode === 'events'">
                <div class="section-header" :style="{fontWeight: 'bold', color: 'white'}">{{ $t('common.tags') }}</div>
                <TagsFilter v-model:model-value="selectedTags"/>
            </template>
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
                    v-model="explorerMode"
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
import { useRoute, useRouter } from 'vue-router';
import * as Sentry from '@sentry/nuxt';
import { VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { useModelStore } from '@/stores/model-store';
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
import type { ExplorerMode } from '@/components/MapListToggle/MapListToggle.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const modelStore = useModelStore();

const state = ref(VIEW_STATE.LOADING);
const eventService = new EventService();
const venueService = new VenueService();

const events = ref<Event[]>([]);
const venues = ref<Venue[]>([]);
const searchText = ref<string>('');
const showFilter = ref<boolean>(false);
const selectedTags: Ref<Array<Tag>> = ref([]);
const selectedSports: Ref<Array<Sport>> = ref([]);

// The explorer's events|venues toggle is mirrored here so the filter drawer
// can hide event-only controls (e.g. Tags) when the user is browsing venues.
// Initial value comes from the `?showVenues=true` URL query so deep-linking
// from /venues/[id] back to /events lands on the venues view.
const explorerMode = ref<ExplorerMode>(
    route.query.showVenues === 'true' ? 'venues' : 'events'
);

/*
   Mirror explorerMode → URL. We use router.replace so flipping the toggle
   doesn't pollute history with a stack of /events entries — the back
   button still returns to wherever the user came from. When mode is
   'events' we drop the query entirely so the canonical URL stays clean.
*/
watch(explorerMode, (mode) => {
    const showVenues = mode === 'venues' ? 'true' : undefined;
    if (route.query.showVenues === showVenues) return;
    router.replace({ query: { ...route.query, showVenues } });
});

// Default to user's last known location, falling back to NYC so the map
// always has a sensible center on first paint.
const initialCenter = computed<number[]>(() => {
    const loc = session.lastKnownLocation;
    if (loc) return [loc.longitude, loc.latitude];
    return [-73.9776, 40.7655];
});

// ── Filtering — applied client-side to both events and venues ──────────────
//
// The same filtered arrays drive both the map pins and the side/sheet list,
// so the search box always narrows the visible set in lockstep across both
// views. Search matches across every field a user might reasonably type:
// titles, names, descriptions, sport/tag labels, address text, even the
// associated venue names on an event. Anything that doesn't match all
// active filters is excluded from both the list and the map.

/**
 * Does any of the given strings include the search term?
 * Empty / nullish strings are skipped — they shouldn't accidentally match.
 * Caller is expected to lowercase the search term once and pass it in.
 */
function anyIncludes(haystacks: Array<string | undefined>, needle: string): boolean {
    if (!needle) return true;
    return haystacks.some((s) => !!s && s.toLowerCase().includes(needle));
}

const filteredEvents = computed<Event[]>(() => {
    const search = searchText.value.trim().toLowerCase();
    const sportNames = selectedSports.value.map((s) => s.name.toLowerCase());
    const tagNames = selectedTags.value.map((t) => t.name.toLowerCase());

    return events.value.filter((e) => {
        // Search across the user-facing fields of an event so the filter
        // stays predictable: typing a venue name should narrow events at
        // that venue, typing a sport should narrow the right events, etc.
        const haystacks: Array<string | undefined> = [
            e.title,
            e.body,
            ...(e.sports ?? []),
            ...(e.tags ?? []),
            ...((e.venues ?? []).flatMap((v) => [
                v.name,
                v.address,
                v.locality,
                v.administrativeArea,
            ])),
        ];
        const matchesSearch = !search || anyIncludes(haystacks, search);

        const matchesSport = sportNames.length === 0
            || e.sports?.some((s) => sportNames.some((sn) => s.toLowerCase().includes(sn)));
        const matchesTag = tagNames.length === 0
            || e.tags?.some((t) => tagNames.some((tn) => t.toLowerCase().includes(tn)));
        return matchesSearch && matchesSport && matchesTag;
    });
});

const filteredVenues = computed<Venue[]>(() => {
    const search = searchText.value.trim().toLowerCase();
    const sportNames = selectedSports.value.map((s) => s.name.toLowerCase());

    return venues.value.filter((v) => {
        // Same idea as events — match against every venue field a user might
        // type. Sports + amenities are arrays so we spread them in.
        const haystacks: Array<string | undefined> = [
            v.name,
            v.description,
            v.address,
            v.locality,
            v.subLocality,
            v.administrativeArea,
            v.countryCode,
            ...(v.sports ?? []),
            ...(v.amenities ?? []),
        ];
        const matchesSearch = !search || anyIncludes(haystacks, search);

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

    const fetchedEvents = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
    const fetchedVenues = venuesResult.status === 'fulfilled' ? (venuesResult.value?.venues ?? []) : [];

    /*
       Populate the model store so subsequent visits (and individual
       /events/[id] or /venues/[id] pages) hit cache. Mark the list-fetch
       timestamps so the events page knows the bulk set is fresh.
    */
    if (eventsResult.status === 'fulfilled') {
        modelStore.setEvents(fetchedEvents);
        modelStore.markEventsListFetched();
    }
    if (venuesResult.status === 'fulfilled') {
        modelStore.setVenues(fetchedVenues);
        modelStore.markVenuesListFetched();
    }

    return { events: fetchedEvents, venues: fetchedVenues };
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

/*
   Pull cached filters out of localStorage. Returns the parsed name lists
   (or empty arrays) — the caller is responsible for resolving names to
   Sport/Tag objects and merging with the user profile.
*/
function readCachedFilterNames(): { sports: string[]; tags: string[] } {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) return { sports: [], tags: [] };
    try {
        const data = JSON.parse(raw) as { sports?: string[]; tags?: string[] };
        return { sports: data.sports ?? [], tags: data.tags ?? [] };
    } catch {
        return { sports: [], tags: [] };
    }
}

/*
   Seed the filter state by *combining* the user's profile sports with the
   filters they last picked from this page. Tags only come from the cache
   (the profile model doesn't carry tag preferences). Names are resolved
   against the session-loaded Sport/Tag catalog and de-duplicated so we
   never push the same chip twice if a profile sport was also the last
   thing they filtered by.

   This runs even when the user has no events on their profile — the
   localStorage cache persists independently of activity, so a returning
   visitor still lands on the filters they chose last time.
*/
/*
   `filtersDirty` flips to true the moment the user interacts with the
   filter drawer (see the showFilter watch below). Until that happens we
   keep auto-seeding from profile + cache as data sources hydrate — that
   way profile sports arriving *after* the cache seed still get merged in.
   Once the user has explicitly touched the filters we stop auto-seeding
   so we never re-add a chip they just removed.
*/
let filtersDirty = false;

function seedFiltersFromProfileAndCache() {
    if (filtersDirty) return;

    const catalogReady = session.sports.length > 0 || session.tags.length > 0;
    if (!catalogReady) return;

    const cached = readCachedFilterNames();
    const profileSportNames = session.user?.sports ?? [];

    // Sports: profile ∪ cached, de-duped by lowercase name.
    const sportNames = new Set<string>();
    profileSportNames.forEach((s) => sportNames.add(s.toLowerCase()));
    cached.sports.forEach((s) => sportNames.add(s.toLowerCase()));

    sportNames.forEach((name) => {
        // Profile stores sports as raw strings; the catalog matches by
        // partial-name include (e.g. "Tennis" → catalog "tennis").
        const found = session.sports.find((sp) => sp.name.toLowerCase().includes(name));
        if (found && !selectedSports.value.find((sp) => sp.name === found.name)) {
            selectedSports.value.push(found);
        }
    });

    // Tags: cache-only.
    cached.tags.forEach((name) => {
        const found = session.tags.find((tg) => tg.name === name);
        if (found && !selectedTags.value.find((tg) => tg.name === found.name)) {
            selectedTags.value.push(found);
        }
    });
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
            // First user-initiated change locks out auto-seeding so a late
            // profile/catalog hydration can't re-add chips they removed.
            filtersDirty = true;
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

/*
   The session catalog (`session.sports`, `session.tags`) and the user
   profile (`session.user`) hydrate asynchronously from `app.vue` and
   the global session middleware respectively, and on cold-loads of
   `/events` they often resolve *after* this page mounts. The first run
   of seedFiltersFromProfileAndCache() in onMounted may find an empty
   catalog and silently skip everything.

   Watch all three sources so whichever one resolves last triggers the
   seed. The watcher tracks a tuple that captures both `user` reference
   identity (undefined → object) AND inner array lengths, since a user
   object could arrive with an empty sports list and we'd still want to
   seed from cache. `immediate: true` covers the rare case where the
   catalog was already populated before this watcher registered.

   The `filtersSeeded` flag inside the seeder ensures we only auto-fill
   once and never re-add chips the user has manually removed.
*/
watch(
    () => ({
        sportsCount: session.sports.length,
        tagsCount: session.tags.length,
        userId: session.user?.id,
        userSportsCount: session.user?.sports?.length ?? 0,
    }),
    () => seedFiltersFromProfileAndCache(),
    { immediate: true, deep: true }
);

onMounted(() => {
    seedFiltersFromProfileAndCache();

    /*
       Cache hydration: if we already fetched the list within the TTL
       (e.g. user clicked into /venues/[id] and came back via the back
       link), skip the network call and reuse what's in the model store.
       Both lists must be fresh — partial reuse would leave the venues
       toggle empty until refetch.
    */
    if (modelStore.isEventsListFresh() && modelStore.isVenuesListFresh()) {
        events.value = modelStore.getAllEvents();
        venues.value = modelStore.getAllVenues();
        state.value = VIEW_STATE.SUCCESS;
        return;
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

/*
   Stable page key: we mutate the URL with `?showVenues=...` when the
   toggle flips, so a fullPath-keyed page would remount on every toggle
   (and lose state). A constant key keeps the same instance across query
   updates while still re-creating the page on a fresh navigation.
*/
definePageMeta({
    key: 'events-index',
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
