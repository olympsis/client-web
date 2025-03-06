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
                <div class="title">{{ venues.at(0)?.name ?? '' }}</div>
                <div class="sub-title">{{ (venues.at(0)?.city ?? '') + ', ' + (venues.at(0)?.state ?? '') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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

onMounted(() => {
    if (mapURL.value) return;
    if (props.venues.at(0) == undefined) return;

    const city = props.venues.at(0)?.city ?? '';
    const state = props.venues.at(0)?.state ?? '';
    const country = props.venues.at(0)?.country ?? '';

    mapState.value = VIEW_STATE.LOADING;
    
    const service = new SnapshotService();
    service.getMapSnapshot(`${city}, ${state} ${country}`)
        .then((blob) => {
            mapURL.value = URL.createObjectURL(blob);
            mapState.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            console.error(`Failed to load snapshot. Error: ${error}`);
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