<template>
    <!--
        Venue detail card — same vertical-scroll layout as before:
          header → location → images strip → description → action row → events.
        What's new is the styling: a blurred cover image fills the card as a
        backdrop, content sits in glass-card sections, and text/icon colors
        flip based on the image's average luminance (matches the EventDetail
        page treatment).
    -->
    <main
        id="venue-detail-view"
        :class="{ 'dark-bg': isDarkBackground, 'light-bg': !isDarkBackground }"
    >
        <!-- Blurred cover image fills the card -->
        <div
            v-if="coverImageURL"
            id="venue-bg"
            :style="{ backgroundImage: `url(${coverImageURL})` }"
        ></div>

        <!-- Sticky header (name + close) -->
        <header id="venue-header">
            <h1 class="title">{{ name }}</h1>
            <button class="close-btn" type="button" @click="closeModal" :aria-label="$t('common.close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)"/>
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </header>

        <div id="venue-body">
            <!-- Location line right under the title -->
            <div class="location">{{ location }}</div>

            <!-- Horizontal image strip -->
            <ul v-if="images.length > 0" class="images">
                <li v-for="image in images" :key="image">
                    <img :src="generateImageURL(image)" class="image"/>
                </li>
            </ul>

            <!-- About this venue -->
            <section class="about card-section">
                <h3>{{ $t('venue.detail.about') }}</h3>
                <p v-if="description">{{ description }}</p>
                <p v-else class="muted">{{ $t('venue.detail.noDescription') }}</p>
            </section>

            <!-- Court details — pills, court count + icons, season + hours,
                 and a transit sub-section (rendered inside the same card). -->
            <VenueCourtDetails :venue="venue"/>

            <!-- Booking required notice -->
            <div v-if="requiresBooking" class="warning-row">
                <img src="@/assets/icons/warning/warning.yellow.svg">
                <span>{{ $t('venue.detail.bookingNotice') }}</span>
            </div>

            <!-- Action row — same set as before: Directions, Schedule (if booking), Event, More -->
            <div class="actions">
                <button class="action directions" v-if="!requiresBooking" @click="openMaps">
                    <img src="@/assets/icons/car/car.white.svg">
                    <p>{{ $t('venue.detail.directions') }}</p>
                </button>

                <button class="action ghost" v-else @click="openMaps">
                    <picture>
                        <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/car/car.svg">
                    </picture>
                    <p>{{ $t('venue.detail.directions') }}</p>
                </button>

                <button class="action ghost" v-if="!requiresBooking">
                    <picture>
                        <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/globe/globe.svg">
                    </picture>
                    <p>{{ ownerName }}</p>
                </button>

                <button class="action directions" v-else @click="openBooking">
                    <img src="@/assets/icons/calendar/calendar.add.fill.white.svg">
                    <p>{{ $t('venue.detail.schedule') }}</p>
                </button>

                <button class="action ghost">
                    <picture>
                        <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/plus/plus.svg">
                    </picture>
                    <p>{{ $t('events.create') }}</p>
                </button>
                <button class="action ghost">
                    <picture>
                        <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/ellipsis/ellipsis.svg">
                    </picture>
                    <p>{{ $t('common.more') }}</p>
                </button>
            </div>

            <!-- Events at this venue -->
            <section class="events card-section">
                <h3>{{ $t('venue.detail.events') }}</h3>
                <ul v-if="events.length > 0" class="event-list">
                    <li v-for="event in events" :key="event.id">
                        <Suspense>
                            <EventListItem :event="event" @selected="handleEventSelected"/>
                        </Suspense>
                    </li>
                </ul>
                <div v-else class="no-events">{{ $t('venue.detail.noEvents') }}</div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { Event } from '@/data/models/EventModels';
import { Venue } from '@/data/models/VenueModels';
import { getDirections } from '~/utils/map-helpers';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';
import { generateImageURL } from '~/utils/image-helpers';

import { useRouter } from 'vue-router';
import EventListItem from '@/components/Events/EventListItem/EventListItem.vue';
import VenueCourtDetails from '@/components/Venues/VenueCourtDetails/VenueCourtDetails.vue';

const { t } = useI18n();
const router = useRouter();
const session = useSessionStore();
const modelStore = useModelStore();

const props = defineProps({
    venue: { type: Venue, required: true },
    events: { type: Array<Event>, required: true },
    isEthereal: { type: Boolean, required: false }
});

const emit = defineEmits([
    "close",
    "selected"
]);

const name = computed(() => props.venue.name);
const description = computed(() => props.venue.description);

// Server stores `locality` (city) + `administrative_area` (state). Display
// joins whichever pieces are present so we don't render lone commas.
const location = computed(() => {
    return [props.venue.locality, props.venue.administrativeArea].filter(Boolean).join(', ');
});

const images = computed<string[]>(() => props.venue.media ?? []);
const coverImageURL = computed<string | undefined>(() => {
    const first = images.value[0];
    return first ? generateImageURL(first) : undefined;
});

const events = computed(() => {
    return modelStore.getAllEvents()
        .filter((e) => e.venues?.find((v) => v.venueId == props.venue.id));
});

// Owner is just an organization id on the wire — resolve lazily through the
// model store so repeat renders don't refetch. Falls back to "Public" while
// the org loads or if the venue has no owner.
const ownerName = ref<string>('Public');
watchEffect(async () => {
    const ownerId = props.venue.ownerId;
    if (!ownerId) { ownerName.value = 'Public'; return; }
    try {
        const org = await modelStore.getOrganizationByID(ownerId);
        ownerName.value = org?.name ?? 'Public';
    } catch {
        ownerName.value = 'Public';
    }
});

const requiresBooking = computed<boolean>(() => {
    return !!(props.venue.access.requiresBooking && props.venue.url);
});

function closeModal() { emit('close'); }

function handleEventSelected(event: any) {
    router.push(`/events/${event.event.id}`);
}

function openMaps() {
    const coordinates = props.venue.location?.coordinates;
    if (coordinates) getDirections(coordinates);
}

function openBooking() {
    if (props.venue.url) window.open(props.venue.url);
}

// ── Background luminance detection (mirrors EventDetail's approach) ────────
//
// Sample the cover image, average the perceived luminance, then apply
// `dark-bg` / `light-bg` on the root element. The matching CSS flips
// text/icon colors so they stay legible regardless of the photo.

const isDarkBackground = ref(true);

async function analyzeImageBrightness(url: string) {
    if (typeof window === 'undefined') return; // skip on SSR

    try {
        const proxyURL = `/api/image-proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyURL);
        if (!response.ok) { isDarkBackground.value = true; return; }

        const blob = await response.blob();
        if (blob.size === 0) { isDarkBackground.value = true; return; }

        const blobURL = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 50;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) { URL.revokeObjectURL(blobURL); return; }

            ctx.drawImage(img, 0, 0, size, size);
            const { data } = ctx.getImageData(0, 0, size, size);
            const pixelCount = data.length / 4;
            if (pixelCount === 0) { URL.revokeObjectURL(blobURL); return; }

            let totalLuminance = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] ?? 0;
                const g = data[i + 1] ?? 0;
                const b = data[i + 2] ?? 0;
                totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
            }
            // brightness(0.6) is applied via CSS on the bg, so factor it in.
            const avgLuminance = (totalLuminance / pixelCount) * 0.6;
            isDarkBackground.value = avgLuminance < 128;
            URL.revokeObjectURL(blobURL);
        };
        img.onerror = () => URL.revokeObjectURL(blobURL);
        img.src = blobURL;
    } catch {
        isDarkBackground.value = true;
    }
}

watch(coverImageURL, (url) => {
    if (url) analyzeImageBrightness(url);
}, { immediate: true });
</script>

<style scoped>
#venue-detail-view {
    width: 100%;
    height: 100%;
    max-width: 35rem;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
}

#venue-bg {
    /* Card-bound (not viewport-bound) so the blurred backdrop doesn't bleed
       through to whatever's behind the modal. */
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(40px) brightness(0.6);
    transform: scale(1.1);
}

#venue-header {
    flex-shrink: 0;
    z-index: 2;
    display: flex;
    min-height: 3rem;
    align-items: center;
    padding: 0.75rem 1rem;
    justify-content: space-between;
    border-bottom: 1px solid var(--component-border-color);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.08);

    .title {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--primary-label-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .close-btn {
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
        border-radius: 15px;
        border: var(--component-border-color) solid 1px;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);

        /*
           The icon was sitting visually off-center because <picture> is
           inline by default and inherits any line-height from the button.
           Making picture a flex child of the button (and the img a block-
           level inside it) guarantees the SVG sits dead-center regardless
           of `all: unset`'s reset behavior across browsers.
        */
        picture {
            display: flex;
            width: 1.1rem;
            height: 1.1rem;
            align-items: center;
            justify-content: center;
        }
        img {
            display: block;
            width: 1.1rem;
            height: 1.1rem;
        }
    }
}

#venue-body {
    flex: 1;
    min-height: 0;
    z-index: 1;
    position: relative;
    overflow-y: auto;
    padding-bottom: 2rem;
}

.location {
    margin: 0.75rem 1rem 1rem 1rem;
    color: var(--secondary-label-color);
    font-size: 1rem;
}

.images {
    width: 100%;
    display: flex;
    overflow-x: auto;
    list-style-type: none;
    margin: 0 0 1rem 0;
    padding: 0 1rem;
    gap: 0.5rem;

    .image {
        width: 16rem;
        height: 22rem;
        object-fit: cover;
        border-radius: 1rem;
    }
}

/* ── Shared glass card frame (same treatment for every section) ─────────── */
.card-section {
    margin: 0 1rem 1rem 1rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    border: var(--component-border-color) solid 1px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12);
    color: var(--primary-label-color);

    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: var(--primary-label-color);
    }

    p {
        margin: 0;
        line-height: 1.5;
        color: var(--primary-label-color);
    }

    .muted { color: var(--secondary-label-color); }
}

/* Booking warning lives outside a card so it reads as an alert strip. */
.warning-row {
    display: flex;
    gap: 0.5rem;
    margin: 0 1rem 1rem 1rem;
    padding: 0.5rem 0.75rem;
    align-items: center;
    font-size: 0.85rem;
    border-radius: 10px;
    border: 1px solid var(--component-border-color);
    background: rgba(255, 200, 0, 0.1);
    color: var(--primary-label-color);

    img { width: 1.1rem; height: 1.1rem; }
}

/* ── Action row ─────────────────────────────────────────────────────────── */
.actions {
    display: flex;
    gap: 0.5rem;
    margin: 0 1rem 1rem 1rem;
    justify-content: space-between;

    .action {
        all: unset;
        flex: 1;
        cursor: pointer;
        height: 5rem;
        display: flex;
        gap: 0.25rem;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 1rem;
        border: 1px solid var(--component-border-color);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
        /*
           `min-width: 0` is essential — without it, a flex child's intrinsic
           min size is its content's min-content width, which means a long
           owner-org name like "Riverside Tennis Association of New York"
           pushes this button wider than its 1fr share and squashes the
           others. Setting min-width: 0 lets the button shrink to its grid
           share so the inner <p>'s ellipsis can actually clip the text.
        */
        min-width: 0;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 0.5rem;

        img { width: 2.2rem; height: 2.2rem; }

        p {
            margin: 0;
            font-size: 0.85rem;
            text-transform: capitalize;
            color: var(--primary-label-color);
            /*
               Width: 100% (not just max-width) so the <p> spans the full
               button width regardless of its content; combined with the
               nowrap + overflow + ellipsis trio, that's what actually
               truncates a long label to one line.
            */
            width: 100%;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .action.directions {
        background-color: var(--primary-brand-color);
        border-color: transparent;

        p { color: white; }
    }
}

/* ── Events section ─────────────────────────────────────────────────────── */
.events {
    .event-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .no-events {
        height: 6rem;
        display: flex;
        font-weight: 500;
        align-items: center;
        justify-content: center;
        color: var(--secondary-label-color);
    }
}
</style>

<!--
   Unscoped — see EventDetail for rationale: scoped CSS adds [data-v-xxx]
   selectors that prevent child components / <picture> sources from picking
   up the variable overrides, so the dark/light text toggle has to live
   outside the scoped block.
-->
<style>
#venue-detail-view.dark-bg {
    --primary-label-color: #FFFFFF;
    --secondary-label-color: #D6D6D6;
    --component-border-color: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
}

#venue-detail-view.light-bg {
    --primary-label-color: #000000;
    --secondary-label-color: #2C2C2E;
    --component-border-color: rgba(0, 0, 0, 0.15);
    color: #000000;
}

/* Force the action-row icons that don't have a dark-mode source to track
   the resolved text color (mirrors the EventDetail trick). */
#venue-detail-view.dark-bg .action img,
#venue-detail-view.dark-bg #venue-header .close-btn img {
    filter: brightness(0) invert(1);
}
#venue-detail-view.light-bg .action img,
#venue-detail-view.light-bg #venue-header .close-btn img {
    filter: brightness(0);
}

/* Don't filter the hero/colored action — its icon is meant to stay white. */
#venue-detail-view.dark-bg .action.directions img,
#venue-detail-view.light-bg .action.directions img {
    filter: none;
}
</style>
