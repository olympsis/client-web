
<template>
    <!-- Map View -->
    <div ref="mapContainer" id="map" style="width: 100%; height: calc(100vh - 60px);"></div>

    <!-- View Title -->
    <h1 id="title">Events</h1>

    <!-- View Actions -->
    <div id="actions">
        <div class="action">
            <img src="@/assets/icons/gear/gear.white.svg" :style="{ width: '1.4rem', height: '1.4rem' }">
        </div>
 
        <div class="action" @click="showNewEventModal">
            <img src="@/assets/icons/plus/plus.white.svg" :style="{ width: '1.5rem', height: '1.5rem' }">
        </div>

        <div class="action" @click="toggleEventsModal">
            <img src="@/assets/icons/menu/menu.white.svg" :style="{ width: '1.4rem', height: '1.4rem' }">
        </div>
    </div>

    <!-- Events List Modal -->
    <Dialog
        v-model:visible="showEvents"
        position="bottom"
        blockScroll
        :style="{ 'margin-bottom': '2rem', 'height': '20rem', 'width': '90vw', 'overflow-y': 'scroll'}" 
    >
        <template #container="{ closeCallback }">
            <EventsListModal :events="events" @close="closeCallback"/>
        </template>
    </Dialog>

    <!-- New Event Card -->
    <Dialog
        v-model:visible="showNewEvent"
        position="center"
        blockScroll
        :pt="{
            root: {
                style: {
                    width: '100%',
                    'border-radius': '20px',
                    'max-width': '35rem'
                }
            }
        }"
    >
        <template #container="{ closeCallback }">
            <NewEventCard @close="closeCallback"/>
        </template>
    </Dialog>

    <!-- No Group Warning Dialog -->
    <Dialog
        v-model:visible="showNoGroupWarning"
        position="center"
        blockScroll
    >
        <template #container="{closeCallback}">
            <NoGroupWarning @close="closeCallback"/>
        </template>
    </Dialog>

    <div id="events">

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Venue } from '@/data/models/VenueModels';
import { Event } from '@/data/models/EventModels';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';
import { getMapkitServerToken } from '~/utils/map-helpers';
import { createVNode, onMounted, ref, render, computed, type Ref, type ComputedRef } from 'vue';

import Dialog from 'primevue/dialog';
import EventsListModal from '@/components/Events/EventsListModal/EventsListModal.vue';
import VenueAnnotation from '@/components/Venues/VenueAnnotation/VenueAnnotation.vue';
import NoGroupWarning from '@/components/Dialog/NoGroupWarning/NoGroupWarning.vue';


declare let mapkit: any;
let map: any = null;


const route = useRoute();
const modelStore = useModelStore();
const sessionStore = useSessionStore();

const mapContainer = ref(null);
const showDetails = ref(false);
const showEvents = ref(false);
const showNewEvent = ref(false);
const showMapOptions = ref(false);
const showNoGroupWarning = ref(false);

let selectedVenue: Ref<Venue>;

const events: ComputedRef<Event[]> = computed(() => {
    return sessionStore.events;
});

sessionStore.$subscribe((mutation: any, state) => {
    const payload = mutation.payload;
    if (payload?.venues) {
        loadVenues();
    }
});

onMounted(() => {
    const options = {
        showsZoomControl: false,
        showsUserLocation: true,
        tracksUserLocation: true,
        showsMapTypeControl: false,
        showsPointsOfInterest: false,
        showsCompass: mapkit.FeatureVisibility.Hidden
    }
    map = new mapkit.Map(
        mapContainer.value,
        options
    );

    mapkit.init({
        authorizationCallback: function(done: (arg0: string) => void) {
            getMapkitServerToken()
                .then((token: string) => {
                    done(token);
                });
        },
        language: navigator.language
    });
    
    // Load in markers for the fields in the area
    loadVenues();

    // Handle select event so we can show venue details
    map.colorScheme = mapkit.Map.ColorSchemes.Adaptive;
    map.addEventListener('select', handleAnnotationSelection);
});

var factory = (coordinate: any, options: { data: { venue: Venue } }) => {
    const container = document.createElement('div');
    const vnode = createVNode(VenueAnnotation, { venue: options.data.venue, hasEvents: false });
    render(vnode, container);
    const componentDOM = container.firstElementChild;
    container.remove();
    return componentDOM;
}

function handleAnnotationSelection(event: any) {
    const id = event.annotation.id;
    const venue = modelStore.getAllVenues().find((venue) => {
        return venue.id == id;
    });

    if (venue) {
        selectedVenue = ref(venue);
        showDetails.value = true;
    }
}

function handleModalClose() {
    if (map.selectedAnnotation) {
        map.selectedAnnotation = null;
    }
}

function toggleEventsModal() {
    showEvents.value = !showEvents.value;
}

function showNewEventModal() {
    const user = sessionStore.user;
    const clubs = user?.clubs;
    const orgs = user?.organizations;
    
    if (!clubs && !orgs || clubs?.length == 0 && orgs?.length == 0) {
        showEvents.value = false;
        showNoGroupWarning.value = true;
    } else {
        showEvents.value = false;
        showNewEvent.value = true;
    }
}

function loadVenues() {
    sessionStore.venues
        .forEach((f) => {
            if (f.location?.coordinates) {
                const lat = f.location?.coordinates[1];
                const long = f.location?.coordinates[0]
                const location = new mapkit.Coordinate(lat, long)

                const options = {
                    id: f.id ?? '',
                    title: f.name ?? '',
                    data: {
                        venue: f
                    }
                }

                const marker = new mapkit.Annotation(location, factory, options);
                map.addAnnotation(marker)
            }
        });
}
</script>

<style scoped>
#map {
    width: 100%;
    height: calc(100vh-60px);
}

#title {
    left: 1rem;
    color: var(--primary-label-color);
    position: absolute;
    font-weight: 900;
    top: calc(60px + 1rem);
}

#actions {
    top: 80px;
    right: 1.5rem;
    display: flex;
    cursor: pointer;
    position: absolute;
    flex-direction: column;

    .action {
        width: 2rem;
        height: 2rem;
        display: flex;
        border-radius: 50%;
        margin: 0.5rem 0rem;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-brand-color);
    }
}
</style>