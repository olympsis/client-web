<template>
    <!--
        Venue card view (modal). Uses the mobile design — single-column flow:
          title + address → cover images strip → About → action row →
          Details (court details + transit) → Events.
        Embedded inside the EventsExplorer Dialog. The expand button in the
        sticky header routes to the standalone /venues/[id] page (which
        ships its own desktop 2-col layout and falls back to this same
        single-column flow under 940px).
    -->
    <main id="venue-detail-view">
        <!-- Sticky chrome: just the action buttons (no title here — the
             title sits inside the body so it scrolls with the content). -->
        <header id="venue-header">
            <div class="header-actions">
                <button
                    v-if="venue.id"
                    class="header-btn"
                    type="button"
                    :aria-label="$t('venue.detail.openFullPage')"
                    :title="$t('venue.detail.openFullPage')"
                    @click="openFullPage"
                >
                    <picture>
                        <source srcset="@/assets/icons/expand/expand.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/expand/expand-dark.svg">
                    </picture>
                </button>
                <button
                    class="header-btn close-btn"
                    type="button"
                    @click="closeModal"
                    :aria-label="$t('common.close')"
                >
                    <picture>
                        <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)"/>
                        <img src="@/assets/icons/xmark/xmark.svg">
                    </picture>
                </button>
            </div>
        </header>

        <div id="venue-body">
            <!-- Title block — name + address -->
            <section class="title-block">
                <h1 class="title">{{ name }}</h1>
                <div v-if="addressLine" class="address">{{ addressLine }}</div>
            </section>

            <!-- Cover images strip — horizontal scroll if more than fits. -->
            <ul v-if="images.length > 0" class="images">
                <li v-for="img in images" :key="img">
                    <img :src="generateImageURL(img)" alt=""/>
                </li>
            </ul>

            <!-- About -->
            <section class="card-section">
                <h2>{{ $t('venue.detail.about') }}</h2>
                <p v-if="description">{{ description }}</p>
                <p v-else class="muted">{{ $t('venue.detail.noDescription') }}</p>
            </section>

            <!-- Action row: Directions / Website / New Event (primary) / More -->
            <div class="actions">
                <button class="action" :disabled="!hasCoords" @click="openMaps">
                    <picture>
                        <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/car/car.svg">
                    </picture>
                    <span>{{ $t('venue.detail.directions') }}</span>
                </button>

                <button class="action" :disabled="!websiteURL" @click="openWebsite">
                    <picture>
                        <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/globe/globe.svg">
                    </picture>
                    <span>{{ $t('venue.detail.website') }}</span>
                </button>

                <button class="action primary" @click="newEventHere">
                    <img src="@/assets/icons/plus/plus.white.svg" alt="">
                    <span>{{ $t('venue.detail.newEvent') }}</span>
                </button>

                <button class="action" @click="openMore">
                    <picture>
                        <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/ellipsis/ellipsis.svg">
                    </picture>
                    <span>{{ $t('venue.detail.more') }}</span>
                </button>
            </div>

            <!-- Court / availability / transit details (existing component) -->
            <VenueCourtDetails :venue="venue"/>

            <!-- Events at this venue. Empty state has a small "Host one?"
                 affordance that routes to /events/new with the venue id —
                 turns dead space into a CTA. -->
            <section class="card-section events-section">
                <h2>{{ $t('venue.detail.events') }}</h2>
                <ul v-if="events.length > 0" class="event-list">
                    <li v-for="event in events" :key="event.id">
                        <Suspense>
                            <EventListItem :event="event" @selected="handleEventSelected"/>
                        </Suspense>
                    </li>
                </ul>
                <div v-else class="no-events">
                    <span>{{ $t('venue.detail.noEvents') }}</span>
                    <a class="host-one" @click.prevent="newEventHere" href="#">{{ $t('venue.detail.hostOne') }}</a>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { Event } from '@/data/models/EventModels';
import { Venue } from '@/data/models/VenueModels';
import { getDirections } from '~/utils/map-helpers';
import { useModelStore } from '@/stores/model-store';
import { generateImageURL } from '~/utils/image-helpers';

import { useRouter } from 'vue-router';
import EventListItem from '@/components/Events/EventListItem/EventListItem.vue';
import VenueCourtDetails from '@/components/Venues/VenueCourtDetails/VenueCourtDetails.vue';

const { t } = useI18n();
const router = useRouter();
const modelStore = useModelStore();

const props = defineProps({
    venue: { type: Venue, required: true },
    events: { type: Array<Event>, required: true },
    isEthereal: { type: Boolean, required: false },
});

const emit = defineEmits(['close', 'selected']);

const name = computed(() => props.venue.name);
const description = computed(() => props.venue.description);

// If we have a street address, show just that (locality/area would be
// redundant). Otherwise fall back to "Custom Location • locality, area"
// so the user still gets a sense of where the pin is.
const addressLine = computed<string>(() => {
    const v = props.venue;
    if (v.address) return v.address;
    const localityArea = [v.locality, v.administrativeArea].filter(Boolean).join(', ');
    return [t('venue.detail.customLocation'), localityArea].filter(Boolean).join(' • ');
});

const images = computed<string[]>(() => props.venue.media ?? []);

const events = computed(() => {
    return modelStore.getAllEvents()
        .filter((e) => e.venues?.find((v) => v.venueId == props.venue.id));
});

const hasCoords = computed<boolean>(() => {
    const c = props.venue.location?.coordinates;
    return !!(c && c.length >= 2);
});
const websiteURL = computed<string | undefined>(() => props.venue.url || undefined);

function closeModal() { emit('close'); }

function openFullPage() {
    if (!props.venue.id) return;
    // Close the modal first so we don't navigate with a stale dialog underneath.
    emit('close');
    router.push(`/venues/${props.venue.id}`);
}

function openMaps() {
    const coords = props.venue.location?.coordinates;
    if (coords) getDirections(coords);
}

function openWebsite() {
    if (websiteURL.value) window.open(websiteURL.value, '_blank', 'noopener,noreferrer');
}

function newEventHere() {
    // Close the modal first if we're inside one, then route to event creation
    // pre-scoped to this venue (the picker can read the query param).
    emit('close');
    if (props.venue.id) {
        router.push(`/events/new?venue=${props.venue.id}`);
    } else {
        router.push('/events/new');
    }
}

function openMore() {
    // Placeholder — wire up a context menu (share, report, save) later.
}

function handleEventSelected(event: any) {
    router.push(`/events/${event.event.id}`);
}
</script>

<style scoped>
/*
   Single-column modal that flows top-to-bottom. The whole view is the
   scroll container — the header is sticky on top so content (title, image,
   sections) scrolls *behind* it rather than being clipped inside a shorter
   body.
*/
#venue-detail-view {
    width: 100%;
    height: 100%;
    max-width: 35rem;
    margin: 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background-color: var(--primary-background-color);
}

#venue-header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem 1rem;
    background-color: var(--primary-background-color);
    border-bottom: 1px solid var(--component-border-color);
}

.header-actions {
    display: flex;
    gap: 0.4rem;
    align-items: center;
}

.header-btn {
    all: unset;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    cursor: pointer;
    padding: 0;
    line-height: 0;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 1px solid var(--component-border-color);
    background: var(--secondary-background-color);

    &:hover { background: var(--tertiary-background-color); }

    picture {
        display: flex;
        width: 1.1rem;
        height: 1.1rem;
        align-items: center;
        justify-content: center;
    }
    img { display: block; width: 1.1rem; height: 1.1rem; }
}

#venue-body {
    /* Body no longer owns the scroll — the parent does. Just lays out the
       sections vertically with consistent gaps. */
    padding: 1rem 1rem 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.title-block {
    /* No own margin — the body's flex gap places this consistently
       relative to the next section. */

    .title {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 800;
        line-height: 1.15;
        color: var(--primary-label-color);
    }
    .address {
        margin-top: 0.35rem;
        color: var(--olympsis-gray);
        font-size: 0.95rem;
    }
}

/*
   Horizontal portrait thumb strip. `object-fit: cover` so each frame is
   filled (landscape sources crop at the sides — same behavior as before).
*/
.images {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    list-style: none;
    margin: 0;
    padding: 0;

    li { flex: 0 0 auto; }

    img {
        width: 9rem;
        height: 13rem;
        object-fit: cover;
        border-radius: 14px;
        display: block;
    }
}

/* ── Card section frame — secondary surface ─────────────────────────────── */
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

/* ── Action row — 4 evenly-distributed pill buttons ─────────────────────── */
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
        /* Same min-width: 0 + ellipsis trick so long labels don't blow out the row. */
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

    /* Primary "New Event" — highest-value action on the page. */
    .action.primary {
        background: var(--primary-brand-color);
        border-color: transparent;
        color: white;
        span { color: white; }
        &:hover:not(:disabled) { background: var(--primary-brand-color); opacity: 0.92; }
    }
}

/* ── Events section ─────────────────────────────────────────────────────── */
.event-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.no-events {
    /* Tight CTA-style empty state — was eating ~3rem of vertical space. */
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
</style>
