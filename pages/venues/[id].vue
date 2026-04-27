<template>
    <main id="venue-detail-page">
        <header id="venue-page-topbar">
            <NuxtLink :to="{ path: '/events', query: { showVenues: 'true' } }" class="back-link">
                <picture class="back-icon">
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg">
                </picture>
                <span>{{ t('venue.detail.backToEvents') }}</span>
            </NuxtLink>
        </header>

        <article v-if="venue" id="venue-page-body">
            <!--
                Title block — full-width across both columns.
                Sits above the grid so both layouts share the same hero.
            -->
            <section class="title-block">
                <h1 class="title">{{ venue.name }}</h1>
                <div v-if="addressLine" class="address">{{ addressLine }}</div>
            </section>

            <!--
                Two-column grid on desktop ≥940px. Below that (or in the modal),
                everything stacks into a single column following the order:
                images → about → actions → details → events. The DOM order
                here matches the mobile reading order; CSS grid template areas
                rearrange the desktop split.
            -->
            <div id="venue-grid">
                <!-- Images strip — sits in the right column on desktop, between
                     title and About on mobile (above the About card). -->
                <ul v-if="images.length > 0" class="images" id="grid-images">
                    <li v-for="img in images" :key="img">
                        <img :src="generateImageURL(img)" alt=""/>
                    </li>
                </ul>

                <!-- About — left column on desktop -->
                <section id="grid-about" class="card-section">
                    <h2>{{ t('venue.detail.about') }}</h2>
                    <p v-if="venue.description">{{ venue.description }}</p>
                    <p v-else class="muted">{{ t('venue.detail.noDescription') }}</p>
                </section>

                <!-- Action row — left column on desktop -->
                <div id="grid-actions" class="actions">
                    <button class="action" :disabled="!hasCoords" @click="openMaps">
                        <picture>
                            <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/car/car.svg">
                        </picture>
                        <span>{{ t('venue.detail.directions') }}</span>
                    </button>
                    <button class="action" :disabled="!websiteURL" @click="openWebsite">
                        <picture>
                            <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/globe/globe.svg">
                        </picture>
                        <span>{{ t('venue.detail.website') }}</span>
                    </button>
                    <button class="action primary" @click="newEventHere">
                        <img src="@/assets/icons/plus/plus.white.svg" alt="">
                        <span>{{ t('venue.detail.newEvent') }}</span>
                    </button>
                    <button class="action">
                        <picture>
                            <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/ellipsis/ellipsis.svg">
                        </picture>
                        <span>{{ t('venue.detail.more') }}</span>
                    </button>
                </div>

                <!-- Court details (right column on desktop, below images) -->
                <div id="grid-details">
                    <VenueCourtDetails :venue="venue"/>
                </div>

                <!-- Events (left column on desktop, full bottom on mobile) -->
                <section id="grid-events" class="card-section events-section">
                    <h2>{{ t('venue.detail.events') }}</h2>
                    <ul v-if="venueEvents.length > 0" class="event-list">
                        <li v-for="event in venueEvents" :key="event.id">
                            <Suspense>
                                <EventListItem :event="event" @selected="handleEventSelected"/>
                            </Suspense>
                        </li>
                    </ul>
                    <div v-else class="no-events">
                        <span>{{ t('venue.detail.noEvents') }}</span>
                        <a class="host-one" @click.prevent="newEventHere" href="#">{{ t('venue.detail.hostOne') }}</a>
                    </div>
                </section>
            </div>
        </article>

        <!-- 404 fallback -->
        <div v-else-if="failed" id="venue-not-found">
            <h1>{{ t('venue.detail.notFound') }}</h1>
            <NuxtLink :to="{ path: '/events', query: { showVenues: 'true' } }" class="primary-link">{{ t('venue.detail.backToEvents') }}</NuxtLink>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Venue } from '@/data/models/VenueModels';
import { Event } from '@/data/models/EventModels';
import { VenueService } from '@/data/services/VenueService';
import { useModelStore } from '@/stores/model-store';
import { generateImageURL } from '~/utils/image-helpers';
import { getDirections } from '~/utils/map-helpers';

import EventListItem from '@/components/Events/EventListItem/EventListItem.vue';
import VenueCourtDetails from '@/components/Venues/VenueCourtDetails/VenueCourtDetails.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const modelStore = useModelStore();
const venueService = new VenueService();

const venueID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id ?? '';
});

const venue = ref<Venue | undefined>(undefined);
const failed = ref<boolean>(false);

async function loadVenueData(id: string) {
    const v = await venueService.getVenue(id);
    return { venue: v ? v.encode() : null };
}

const { data } = await useAsyncData(
    `venues/${venueID.value}`,
    () => loadVenueData(venueID.value),
    { server: true, lazy: false, immediate: true }
);

watch(data, (newData) => {
    if (!newData?.venue) { failed.value = true; return; }
    venue.value = Venue.decode(newData.venue);
    if (venue.value) modelStore.setVenue(venue.value);
}, { immediate: true });

// ── Display helpers ────────────────────────────────────────────────────────

// If we have a street address, show just that (locality/area would be
// redundant). Otherwise fall back to "Custom Location • locality, area"
// so the hero still tells the user where the pin is.
const addressLine = computed<string>(() => {
    const v = venue.value;
    if (!v) return '';
    if (v.address) return v.address;
    const localityArea = [v.locality, v.administrativeArea].filter(Boolean).join(', ');
    return [t('venue.detail.customLocation'), localityArea].filter(Boolean).join(' • ');
});

const images = computed<string[]>(() => venue.value?.media ?? []);

const websiteURL = computed<string | undefined>(() => venue.value?.url || undefined);
const hasCoords = computed<boolean>(() => {
    const c = venue.value?.location?.coordinates;
    return !!(c && c.length >= 2);
});

const venueEvents = computed<Event[]>(() => {
    const v = venue.value;
    if (!v) return [];
    return modelStore.getAllEvents().filter((e) =>
        e.venues?.find((d) => d.venueId === v.id)
    );
});

// ── Actions ────────────────────────────────────────────────────────────────

function openMaps() {
    const coords = venue.value?.location?.coordinates;
    if (coords) getDirections(coords);
}

function openWebsite() {
    if (websiteURL.value) window.open(websiteURL.value, '_blank', 'noopener,noreferrer');
}

function newEventHere() {
    if (venue.value?.id) router.push(`/events/new?venue=${venue.value.id}`);
    else router.push('/events/new');
}

function handleEventSelected(payload: any) {
    router.push(`/events/${payload.event.id}`);
}

// ── SEO ────────────────────────────────────────────────────────────────────

const venueTitle = computed<string>(() => venue.value?.name ?? t('venue.detail.defaultTitle'));
const venueBody = computed<string>(() => venue.value?.description ?? t('venue.detail.defaultBody'));
const coverImageURL = computed<string | undefined>(() => {
    const first = venue.value?.media?.[0];
    return first ? generateImageURL(first) : undefined;
});

const config = useRuntimeConfig();
useSeoMeta({
    title: () => venueTitle.value,
    description: () => venueBody.value,

    ogType: 'website',
    ogLocale: 'en_US',
    ogSiteName: 'Olympsis',
    ogUrl: () => `https://olympsis.com/venues/${venueID.value}`,
    ogTitle: () => venueTitle.value,
    ogImage: () => coverImageURL.value,
    ogDescription: () => venueBody.value,

    twitterSite: '@olympsis',
    twitterTitle: () => venueTitle.value,
    twitterCard: 'summary_large_image',
    twitterImage: () => coverImageURL.value,
    twitterDescription: () => venueBody.value,

    appleItunesApp: {
        appId: config.public.APP_ID,
        appArgument: `/venues/${venueID.value}`,
    },
});
</script>

<style scoped>
/*
   Document-flow page — no internal scroll containers anywhere. Window scroll
   carries the user through every section.
*/
#venue-detail-page {
    min-height: 100vh;
    background-color: var(--primary-background-color);
}

#venue-page-topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--component-border-color);
    background-color: var(--primary-background-color);
}

.back-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    text-decoration: none;
    color: var(--primary-label-color);
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid var(--component-border-color);
    background-color: var(--secondary-background-color);

    &:hover { background-color: var(--tertiary-background-color); }
    .back-icon img { width: 1rem; height: 1rem; display: block; }
}

#venue-page-body {
    width: 100%;
    max-width: 64rem;
    margin: 1.5rem auto 3rem auto;
    padding: 0 1rem;
}

/* ── Title (above the grid, full-width on both layouts) ─────────────────── */
.title-block {
    /* Same `--section-gap` as between cards so the title sits in the same
       rhythm as the rest of the page (no surprise gap between hero and
       first card). */
    margin-bottom: 0.75rem;

    .title {
        margin: 0;
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.1;
        color: var(--primary-label-color);
    }
    .address {
        margin-top: 0.4rem;
        color: var(--secondary-label-color);
        font-size: 1rem;
    }
}

@media (max-width: 720px) {
    .title-block .title { font-size: 1.6rem; }
}

/*
   Mobile-first single-column grid. The desktop layout (≥940px) overrides
   this with named template areas to put images + details on the right and
   about/actions/events on the left.

   `gap: 0.75rem` between cards instead of 1rem — combined with each card's
   1rem internal padding the visual gap reads ~2.75rem, which felt loose at
   1rem grid gap (3rem visual).
*/
#venue-grid {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
        'images'
        'about'
        'actions'
        'details'
        'events';
}

#grid-images { grid-area: images; }
#grid-about { grid-area: about; }
#grid-actions { grid-area: actions; }
#grid-details { grid-area: details; }
#grid-events { grid-area: events; }

@media (min-width: 940px) {
    /*
       Desktop split — even 50/50 columns. Left column holds About, Actions,
       Events; right column holds Images on top of Details.
    */
    #venue-grid {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-areas:
            'about   images'
            'actions images'
            'events  details';
    }
}

/*
   Portrait image strip — small thumbnails on a horizontal scroller, both
   on mobile and desktop. Matches the mock: thumbs sit in the top of the
   right column, landscape sources crop at the sides via `cover`.
*/
.images {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    list-style: none;
    margin: 0;
    padding: 0;

    li { height: fit-content; }

    img {
        width: 11rem;
        height: 16rem;
        object-fit: cover;
        border-radius: 14px;
        display: block;
    }
}

/* ── Card sections ──────────────────────────────────────────────────────── */
.card-section {
    padding: 1rem 1.25rem;
    border-radius: 16px;
    border: 1px solid var(--component-border-color);
    background-color: var(--secondary-background-color);
    color: var(--primary-label-color);

    h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-label-color);
    }
    p {
        margin: 0;
        line-height: 1.5;
        color: var(--primary-label-color);
        font-size: 0.95rem;
    }
    .muted { color: var(--secondary-label-color); }
}

/* ── Action row — same vocabulary as the modal ──────────────────────────── */
.actions {
    display: flex;
    gap: 0.5rem;

    .action {
        all: unset;
        flex: 1;
        cursor: pointer;
        height: 4.5rem;
        display: flex;
        gap: 0.25rem;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 12px;
        border: 1px solid var(--component-border-color);
        background: var(--secondary-background-color);
        color: var(--primary-label-color);
        min-width: 0;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 0.5rem;

        &:hover:not(:disabled) { background: var(--tertiary-background-color); }
        &:disabled { opacity: 0.4; cursor: not-allowed; }

        picture, img { width: 1.4rem; height: 1.4rem; display: block; }

        span {
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--primary-label-color);
            width: 100%;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .action.primary {
        background: var(--primary-brand-color);
        border-color: transparent;
        color: white;
        span { color: white; }
        &:hover:not(:disabled) { background: var(--primary-brand-color); opacity: 0.92; }
    }
}

/* ── Events ─────────────────────────────────────────────────────────────── */
.event-list {
    display: grid;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
}

.no-events {
    /*
       Compact empty state — the previous 1.5rem padding made the card feel
       like a dead zone. Now reads as a tight call-to-action instead.
    */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 0.75rem 0 0.25rem 0;
    color: var(--secondary-label-color);
    text-align: center;

    .host-one {
        font-style: italic;
        font-weight: 600;
        text-decoration: none;
        color: var(--olympsis-red, #c0392b);
        cursor: pointer;
    }
    .host-one:hover { text-decoration: underline; }
}

/* ── 404 ────────────────────────────────────────────────────────────────── */
#venue-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 1rem;

    h1 {
        font-size: 1.5rem;
        text-align: center;
        color: var(--primary-label-color);
    }
    .primary-link {
        padding: 0.5rem 1rem;
        border-radius: 10px;
        text-decoration: none;
        color: white;
        background-color: var(--primary-brand-color);
    }
}
</style>
