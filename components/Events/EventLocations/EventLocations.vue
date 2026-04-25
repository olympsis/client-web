<template>
    <div id="event-locations">
        <h2> Location </h2>
        <img v-if="mapURL" id="map" :src="mapURL"/>
        <div v-else id="map-placeholder"/>
        <div id="details">
            <picture :style="{ margin: '0rem 0.5rem', height: 'fit-content' }" class="icon">
                <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/pin-drop/pin.drop.svg">
            </picture>

            <div id="info">
                <div class="title">{{ venueName }}</div>
                <div class="sub-title">{{ venueLocation }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as Sentry from "@sentry/nuxt";
import { VIEW_STATE } from '~/data/Enums';
import { Event } from '~/data/models/EventModels';
import type { Venue } from '~/data/models/VenueModels';
import { SnapshotService } from '~/data/services/SnapshotService';

const props = defineProps({
   event: { type: Event, required: true } ,
   venues: { type: Array<Venue>, required: true }
});

const mapURL = ref<string | undefined> (undefined);
const mapState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

const venueName = computed<string>(() => {
    const firstVenue = props.event.venues.at(0);
    // VenueDescriptor.venueId is empty for ad-hoc/external locations, so we
    // pull the name straight off the descriptor. If it's a tracked venue,
    // the resolved Venue (props.venues) carries the canonical name.
    if (firstVenue && !firstVenue.venueId) {
        return firstVenue.name ?? "Custom Location";
    } else {
        return props.venues.at(0)?.name ?? "Custom Location";
    }
});

const venueLocation = computed<string>(() => {
    const firstVenue = props.event.venues.at(0);
    if (firstVenue && !firstVenue.venueId) {
        const line = [firstVenue.locality, firstVenue.administrativeArea].filter(Boolean).join(', ');
        return line || 'Custom Coordinates';
    } else {
        const venue = props.venues.at(0);
        if (!venue) return 'Custom Coordinates';
        const line = [venue.locality, venue.administrativeArea].filter(Boolean).join(', ');
        return line || 'Custom Coordinates';
    }
});

function getLocationCenter(): string | null {
    const firstVenue = props.event.venues.at(0);

    if (firstVenue?.location?.coordinates) {
        return `${firstVenue.location.coordinates[1]}, ${firstVenue.location.coordinates[0]}`;
    }

    if (firstVenue?.locality && firstVenue?.administrativeArea && firstVenue?.countryCode) {
        return `${firstVenue.locality}, ${firstVenue.administrativeArea}, ${firstVenue.countryCode}`;
    }

    return null;
}

onMounted(() => {
    if (mapURL.value) return;
    const center = getLocationCenter()
    if (!center) return;

    mapState.value = VIEW_STATE.LOADING;
    
    const service = new SnapshotService();
    service.getMapSnapshot(center)
        .then((data) => {
            mapURL.value = generateImageURL(data.url);
            mapState.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            Sentry.captureException(error);
            mapState.value = VIEW_STATE.FAILURE;
        });
});
</script>

<style scoped>
#event-locations {
    max-width: 30rem;
    grid-area: locations;
    #map {
        width: 100%;
        border-radius: 20px;
        margin: 0.5rem 0rem;
    }

    #details {
        display: flex;
        align-items: center;
    }

    #map-placeholder {
        width: 100%;
        max-height: 20rem;
        margin: 0.5rem 0rem;
        border-radius: 20px;
        background-color: var(--secondary-background-color);
    }

    .icon {
        display: flex;
        padding: 0.25rem 0.60rem;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        border: var(--component-border-color) solid 1px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }

    .title {
        font-weight: bold;
    }

    .sub-title {
        font-size: 0.9rem;
    }
}
</style>