<template>
    <div id="event-locations">
        <h2> Location </h2>
        <img v-if="mapURL" id="map" :src="mapURL"/>
        <div v-else id="map-placeholder"/>
        <div id="details">
            <picture :style="{ width: '48px', height: '48px', margin: '0rem 0.5rem' }" class="icon">
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
    if (firstVenue && !firstVenue.id) {
        return firstVenue.name ?? "Custom Location";
    } else {
        return props.venues.at(0)?.name ?? "Custom Location";
    }
});

const venueLocation = computed<string>(() => {
    const firstVenue = props.event.venues.at(0);
    if (firstVenue && !firstVenue.id) {
        if (!firstVenue.city && !firstVenue.state) return 'Custom Coordinates';
        return `${firstVenue.city}, ${firstVenue.state}`;
    } else {
        const firstVenue = props.venues.at(0);
        if (!firstVenue || (!firstVenue.city && !firstVenue.state)) return 'Custom Coordinates';
        return `${firstVenue.city}, ${firstVenue.state}`;
    }
});

function getCityStateCountry(): { city: string, state: string, country: string } {
    const firstVenue = props.event.venues.at(0);
    if (firstVenue && !firstVenue.id) {
        return { city: firstVenue.city!, state: firstVenue.state!, country: firstVenue.country! };
    } else {
        const firstVenue = props.venues.at(0);
        if (!firstVenue) throw('Fatal error');
        return { city: firstVenue.city!, state: firstVenue.state!, country: firstVenue.country! }
    }
}

onMounted(() => {
    if (mapURL.value) return;
    const { city, state, country } = getCityStateCountry()

    mapState.value = VIEW_STATE.LOADING;
    
    const service = new SnapshotService();
    service.getMapSnapshot(`${city}, ${state} ${country}`)
        .then((blob) => {
            mapURL.value = URL.createObjectURL(blob);
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
    }

    #map-placeholder {
        width: 100%;
        max-height: 20rem;
        margin: 0.5rem 0rem;
        border-radius: 20px;
        background-color: var(--secondary-background-color);
    }

    .icon {
        width: 42px;
        height: 42px;

        img {
            padding: 0.5rem;
            border-radius: 10px;
            border: var(--icon-border-color) solid 1px;
            background-color: var(--secondary-background-color);
        }
    }

    .title {
        font-weight: bold;
    }

    .sub-title {
        font-size: 0.9rem;
    }
}
</style>