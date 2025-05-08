<template>
    <button id="venues-picker-button" @click="showPicker = true"> {{ pickerText }} </button>

    <!-- Venue Picker Dialog -->
    <Dialog
        ref="op"
        id="event-venues-popup"
        v-model:visible="showPicker"
        blockScroll
        position="center"
        :style="{'height': '80vh', 'width': '100%', 'max-width': '32rem', 'overflow-y': 'scroll', 'background-color': 'var(--primary-background-color)'}"
    >
        <template #container="{ closeCallback }">
            <div id="event-venues-popup-container" :key="randomKey">
                <!-- Popup Header -->
                <div id="popup-header">
                    <button id="cancel" @click="dismissModal(closeCallback)"> Cancel </button>
                    
                    Venues

                    <button id="done" @click="dismissModal(closeCallback)"> Done </button>
                </div>

                <!-- Sub Header/Navigation -->

                <div id="sub-header">
                    <div v-if="!isCustomLocation" @click="isCustomLocation = true" :style="{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }">
                        Set Custom Location
                        <picture class="centered" :style="{ height: '24px', width: '24px' }">
                            <source srcset="@/assets/icons/chevron/chevron.right.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/chevron/chevron.right.svg" class="chevron"/>
                        </picture>
                    </div>

                    <div v-else class="custom-location-header">
                        <div @click="isCustomLocation = false" :style="{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }">
                            <picture class="centered" :style="{ height: '24px', width: '24px' }">
                                <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                                <img src="@/assets/icons/chevron/chevron.left.svg" class="chevron"/>
                            </picture>

                            Back to Venues
                        </div>
                        <div v-if="selectedLocation" @click="clearSelectedLocation" :style="{ fontSize: '0.8rem', color: 'var(--tertiary-brand-color)' }"> Clear Selection </div>
                    </div>
                </div>

                <!-- Selected Location -->
                <div id="selected-location" v-if="selectedLocation && isCustomLocation">
                    <div class="selected-location-details">
                        <div class="location-title">Selected Location</div>
                        <div class="location-name-input">
                            <label for="location-name">Name:</label>
                            <input 
                                id="location-name" 
                                v-model="selectedLocation.name" 
                                placeholder="Custom Location"
                            />
                        </div>
                        <div class="location-coordinates">
                            Lat: {{ selectedLocation.latitude.toFixed(6) }}, 
                            Lng: {{ selectedLocation.longitude.toFixed(6) }}
                        </div>
                        <div class="location-address" v-if="selectedLocation.address">
                            {{ selectedLocation.address }}
                        </div>
                        <button class="use-location-btn" @click="useSelectedLocation">
                            Use This Location
                        </button>
                    </div>
                </div>

                <!-- Popup Body -->
                <div id="popup-body">
                    <ScrollPanel :style="{ 'height': '70vh' }" v-if="!isCustomLocation">

                        <!-- Selected Venues -->
                        <div v-if="!isSearching">
                            <div id="selected-venues">
                                <div v-for="venue in model" class="selected-venue">
                                    <picture id="remove-button" @click="removeVenue(venue)">
                                        <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)"/>
                                        <img src="@/assets/icons/xmark/xmark.svg"/>
                                    </picture>
                                    <div class="name">{{ venue.name }}</div>
                                    <div class="location">{{ `${venue.city}, ${venue.state}` }}</div>
                                </div>
                            </div>

                            <div id="add-button" @click="isSearching = true">
                                <picture>
                                    <source srcset="@/assets/icons/add/add.white.svg" media="(prefers-color-scheme: dark)"/>
                                    <img src="@/assets/icons/add/add.svg"/>
                                </picture>
                                Add a Venue
                            </div>
                        </div>

                        <!-- Venues Search -->
                        <div v-else>
                            <div id="search-container">
                                <SearchBar v-model:value="searchText" :class="{ 'custom-location': isCustomLocation }"/>
                                <p id="venues-count-label">{{ venuesCount }}</p>
                            </div>

                            <ul id="search-results">
                                <li v-for="venue in venues" class="venue-result" @click="selectVenue(venue)">
                                    <div class="title">
                                        <div class="name">{{ venue.name }}</div>
                                        <img v-if="venue.type === 'internal'" src="@/assets/icons/checkmark/checkmark.tertiary.svg">
                                    </div>
                                    <div class="location">{{ `${venue.city}, ${venue.state}` }}</div>
                                </li>
                            </ul>
                        </div>
                    </ScrollPanel>

                    <div v-else>
                        <!-- Map View -->
                        <div class="map-instructions" v-if="!selectedLocation">
                            <img class="icon" :style="{ marginRight: '0.25rem' }" src="@/assets/icons/pin-drop/pin-drop.gray.svg">
                            Tap on the map to select a location
                        </div>
                        <div ref="mapContainer" id="map" :key="'map-' + isCustomLocation"></div>
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

import { computed, ref, watch, onMounted } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';
import { getMapkitServerToken, generateMapkitAuthToken } from '~/utils/map-helpers';
import { VenueDescriptor } from '@/data/models/GenericModels';

import Dialog from 'primevue/dialog';
import ScrollPanel from 'primevue/scrollpanel';
import SearchBar from '@/components/SearchBar/SearchBar.vue';

// Define mapkit as a property of the window object
declare global {
  interface Window {
    mapkit?: any;
  }
}

let map: any = null;
let locationMarker: any = null;

const sessionStore = useSessionStore();
const modelStore = useModelStore();
const model = defineModel<VenueDescriptor[]>({ default: [] });

const op = ref();
const randomKey = ref(0);
const searchText = ref('');
const showPicker = ref(false);
const mapInitialized = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
const isSearching = ref(false);
const isCustomLocation = ref(false);
const selectedLocation = ref<{
    latitude: number;
    longitude: number;
    address?: string;
    name: string;
} | undefined>(undefined);

const pickerText: ComputedRef<string> = computed(() => {
    return model.value.length > 0 ? `Change Venue(s)(${model.value.length})` : 'Pick Venue(s)'
});

const venues: ComputedRef<VenueDescriptor[]> = computed(() => {
    const arr: VenueDescriptor[] = modelStore.getAllVenues().map((v) => {
        return VenueDescriptor.decode({
            'type': 'internal',
            'id': v.id,
            'name': v.name,
            'city': v.city,
            'state': v.state,
            'country': v.country
        });
    })
    arr.push(...venuesResult.value);

    return arr.filter((v: VenueDescriptor) => { 
        if (v.type !== 'internal') return true;
        return v.name?.toLowerCase().includes(searchText.value.toLowerCase());
     });
});
const venuesResult: Ref<VenueDescriptor[]> = ref([]);
const venuesCount: ComputedRef<string> = computed(() => {
    return `${venues.value.length} venue(s) near you`;
});

let debounceTimeout: number | null = null;
watch(searchText, (newValue, oldValue) => {
    if (debounceTimeout !== null) {
        clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout
    debounceTimeout = window.setTimeout(async () => {
        if (newValue) {
            debounceTimeout = null;
            venuesResult.value = await lookUpCustomVenuesByName(newValue);
        } else {
            venuesResult.value = []
        }
    }, 500);
});

onMounted(() => {
    // Check if MapKit JS is already loaded
    if (window.mapkit) {
        initializeMap();
    } else {
        // Load MapKit JS script
        loadMapKitJS().then(() => {
            initializeMap();
        }).catch(error => {
            console.error('Failed to load MapKit JS:', error);
        });
    }
});

// Function to load MapKit JS dynamically
async function loadMapKitJS(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.mapkit) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load MapKit JS'));
        document.head.appendChild(script);
    });
}

function initializeMap() {
    if (!window.mapkit) {
        console.error('MapKit JS is not loaded yet');
        return;
    }

    window.mapkit.init({
        authorizationCallback: function(done: (arg0: string) => void) {
            generateMapkitAuthToken()
                .then((token: string) => { 
                    done(token); 
                });
        },
        language: navigator.language
    });

    const options = {
        showsZoomControl: true,
        showsUserLocation: true,
        tracksUserLocation: true,
        showsMapTypeControl: false,
        showsPointsOfInterest: true,
    }
    
    // Initialize the map when custom location is selected
    watch(isCustomLocation, (newValue) => {
        if (newValue) {
            // Wait for DOM update
            setTimeout(() => {
                 // Force new map creation
                selectedLocation.value = undefined;
                mapInitialized.value = false;
                map = null;

                // Check if mapkit is available
                if (!window.mapkit) {
                    console.error('MapKit JS is not available. Attempting to load it now.');
                    loadMapKitJS().then(() => {
                        initializeMapInstance(options);
                        mapInitialized.value = true;
                    }).catch(error => {
                        console.error('Failed to load MapKit JS:', error);
                    });
                    return;
                }
                
                initializeMapInstance(options);
                mapInitialized.value = true;
            }, 300);
        }
    });
}

// Helper function to initialize map instance after checking mapkit availability
function initializeMapInstance(options: any) {
    if (!window.mapkit || !mapContainer.value) {
        console.error('MapKit or map container is not available');
        return;
    }

    if (map) {
        map.removeEventListener('single-tap', handleMapClick);
        map.destroy(); // Add this if MapKit has a destroy method
        map = null;
    }
    
    // Force layout recalculation before creating the map
    const container = mapContainer.value as HTMLElement;
    container.style.display = 'none';

    // This forces a layout recalculation
    void container.offsetHeight;
    container.style.display = 'block';
    
    // Create map with the container
    map = new window.mapkit.Map(mapContainer.value, options);
    
    // Set adaptive color scheme
    map.colorScheme = window.mapkit.Map.ColorSchemes.Adaptive;
    
    // Add click event listener for location selection
    map.addEventListener('single-tap', handleMapClick);
    
    // If user location is available, center the map on it
    const userLocation = sessionStore.lastKnownLocation;
    if (userLocation) {
        const span = new window.mapkit.CoordinateSpan(0.016, 0.016);
        const center = new window.mapkit.Coordinate(userLocation.latitude, userLocation.longitude);
        const region = new window.mapkit.CoordinateRegion(center, span);
        map.setRegionAnimated(region);
    }
    
    // If there's already a selected location, show it on the map
    if (selectedLocation.value) {
        addMarkerAtLocation(
            selectedLocation.value.latitude, 
            selectedLocation.value.longitude
        );
    }
}

function handleMapClick(event: any) {
    // Get the map point from the event and convert it to coordinates
    const coordinate = map.convertPointOnPageToCoordinate(event.pointOnPage);

    // Update selected location
    selectedLocation.value = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        name: "Custom Location" 
    };
    
    // Add or update marker
    addMarkerAtLocation(coordinate.latitude, coordinate.longitude);
    
    // Reverse geocode to get address
    reverseGeocode(coordinate.latitude, coordinate.longitude);
}

function addMarkerAtLocation(latitude: number, longitude: number) {
    // Check if mapkit is loaded
    if (!window.mapkit || !map) return;
    
    // Remove existing marker if it exists
    if (locationMarker) {
        map.removeAnnotation(locationMarker);
    }
    
    // Create new marker
    const coordinate = new window.mapkit.Coordinate(latitude, longitude);
    
    locationMarker = new window.mapkit.MarkerAnnotation(coordinate, {
        color: "#c969e0",
        title: "Selected Location",
        animates: true,
        selected: true
    });
    
    // Add marker to map
    map.addAnnotation(locationMarker);
    
    // Center map on the marker
    map.setCenterAnimated(coordinate);
}

async function reverseGeocode(latitude: number, longitude: number) {
    try {
        const mapkitToken = await getMapkitServerToken();
        const response = await fetch(
            `https://maps-api.apple.com/v1/reverseGeocode?loc=${latitude},${longitude}`,
            {
                headers: {
                    'Authorization': `Bearer ${mapkitToken}`
                }
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const address = formatAddress(result.structuredAddress);
                
                if (selectedLocation.value) {
                    selectedLocation.value.address = address;
                }
            }
        }
    } catch (error) {
        console.error('Error reverse geocoding:', error);
    }
}

function formatAddress(structuredAddress: any): string {
    if (!structuredAddress) return '';
    
    const parts = [];
    
    if (structuredAddress.thoroughfare) parts.push(structuredAddress.thoroughfare);
    if (structuredAddress.locality) parts.push(structuredAddress.locality);
    if (structuredAddress.administrativeArea) parts.push(structuredAddress.administrativeArea);
    if (structuredAddress.countryCode) parts.push(structuredAddress.countryCode);
    
    return parts.join(', ');
}

function clearSelectedLocation() {
    selectedLocation.value = undefined;
    
    if (locationMarker && map) {
        map.removeAnnotation(locationMarker);
        locationMarker = null;
    }
}

function useSelectedLocation() {
    if (!selectedLocation.value) return;
    
    // Create a new venue from the selected location
    const location = selectedLocation.value;
    const addressParts = location.address ? location.address.split(', ') : [];
    
    const customVenue = new VenueDescriptor(
        'custom',
        undefined,
        location.name,
        addressParts.length > 1 ? addressParts[1] : '',
        addressParts.length > 2 ? addressParts[2] : '',
        addressParts.length > 3 ? addressParts[3] : '',
        location.latitude,
        location.longitude
    );
    
    // Add the custom venue to the model
    model.value.push(customVenue);
    
    // Return to venue list
    isCustomLocation.value = false;
}

function dismissModal(callback: () => void) {
    isSearching.value = false;
    isCustomLocation.value = false;
    // Reset map if needed
    if (map) {
        map.removeEventListener('click', handleMapClick);
        map = null;
    }
    callback();
}

function selectVenue(venue: VenueDescriptor) {
    const index = model.value.findIndex((v) => v.name == venue.name);
    if (index == -1) {
        model.value.push(venue);
    }
    
    searchText.value = '';
    isSearching.value = false;
    isCustomLocation.value = false;
}

function removeVenue(venue: VenueDescriptor) {
    const index = model.value.findIndex((v) => v.name == venue.name);
    if (index != -1) {
        model.value.splice(index, 1);
        randomKey.value += 1;
    } else {
        console.error(`Failed to remove venue(${venue.name}) from selected list`);
    }
}

async function lookUpCustomVenuesByName(name: string): Promise<VenueDescriptor[]> {
    const mapkitToken = await getMapkitServerToken();
    
    let searchLocation = '';
    const userLocation = sessionStore.lastKnownLocation;
    if (userLocation) {
        searchLocation = `${userLocation?.latitude},${userLocation?.longitude}`
    }
    const resultCategories = 'poi, pointOfInterest'
    const response = await fetch(`https://maps-api.apple.com/v1/search?q=${name}&resultTypeFilter=${resultCategories}&userLocation=${searchLocation}`, 
        {
            headers: {
                'Authorization': `Bearer ${mapkitToken}`
            }
        }
    );

    const data = await response.json();
    const results = data['results'];
    return results.map((r: any) => {
        return new VenueDescriptor(
            'external',
            undefined,
            r['name'],
            r['structuredAddress']['locality'],
            r['structuredAddress']['administrativeAreaCode'],
            r['country'],
            r['coordinate']['latitude'],
            r['coordinate']['longitude'],
        );
    });
}

</script>

<style scoped>
#venues-picker-button {
    width: 100%;
    height: 100%;
    height: 7rem; 
    border: unset;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 10px;
    color: var(--primary-label-color);
    background-color: var(--secondary-background-color);
}

#event-venues-popup-container {
    width: 100%;
    max-width: 32rem;
    overflow-x: hidden;
    background-color: var(--primary-background-color);

    #popup-header {
        display: flex;
        margin: 1rem;
        color: var(--primary-label-color);
        justify-content: space-between;

        #cancel {
            border: unset;
            cursor: pointer;
            font-size: 0.8rem;
            background-color: unset;
            color: var(--primary-label-color);
        }

        #done {
            color: white;
            border: unset;
            cursor: pointer;
            border-radius: 10px;
            padding: 0.5rem 1rem;
            text-transform: uppercase;
            background-color: var(--primary-brand-color);           
        }
    }

    #sub-header {
        margin: 1rem;
        display: flex;
        cursor: pointer;
        justify-content: right;
        color: var(--primary-label-color);
        
        .custom-location-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    #selected-location {
        margin: 1rem;
        padding: 1rem;
        border-radius: 10px;
        background-color: var(--secondary-background-color);
        
        .selected-location-details {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            
            .location-title {
                font-weight: bold;
                color: var(--primary-label-color);
            }
            
            .location-coordinates, .location-address {
                font-size: 0.9rem;
                color: var(--secondary-label-color);
            }
            
            .use-location-btn {
                margin-top: 0.5rem;
                color: white;
                border: unset;
                cursor: pointer;
                border-radius: 10px;
                padding: 0.5rem 1rem;
                background-color: var(--primary-brand-color);
            }

            .location-name-input {
                margin-bottom: 0.5rem;
                
                label {
                    display: block;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                    color: var(--secondary-label-color);
                }
                
                input {
                    width: 100%;
                    padding: 0.5rem;
                    border-radius: 5px;
                    border: 1px solid var(--border-color, #ccc);
                    color: var(--primary-label-color);
                }
            }
        }
    }

    #popup-body {
        background-color: var(--primary-background-color);
        
        #map {
            width: 100%;
            height: 60vh;
            display: block;
            position: relative;
            margin: 0 auto;
        }
        
        .map-instructions {
            display: flex;
            font-size: 0.8rem;
            text-align: center;
            color: #7a797980;
            align-items: center;
            padding: 0.5rem 1rem;
            justify-content: center;
        }
        
        #selected-venues {
            display: grid;
            margin: 0rem 1.5rem;
            grid-template-columns: 1fr 1fr;

            .selected-venue {
                margin: 1rem;
                padding: 1rem;
                cursor: pointer;
                border-radius: 10px;
                background-color: var(--secondary-background-color);

                #remove-button {
                    img {
                        width: 1rem;
                        height: 1rem;
                    }
                }
                .name {
                    color: var(--primary-label-color);
                }

                .location {
                    color: gray;
                }
            }
        }

        #add-button {
            height: 6rem;
            display: flex;
            cursor: pointer;
            margin: 1rem 2rem;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            
            font-size: 0.6rem;
            border-radius: 10px;
            color: var(--primary-label-color);
            background-color: var(--secondary-background-color);

            picture {
                img {
                    width: 1rem;
                    height: 1rem;
                }
            }
        }

        #search-container {
            margin: 0.6rem;

            button {
                all: unset;
                width: 100%;
                text-align: end;
                cursor: pointer;
                font-size: 0.8rem;
                color: var(--secondary-brand-color);
            }

            .custom-location {
                border: 1px solid var(--secondary-brand-color);
            }

            .custom-location-text {
                font-weight: bold;
            }

            #venues-count-label {
                font-size: 0.7rem;
                margin: 0rem 1rem;
                color: var(--tertiary-brand-color);
            }
        }

        #search-results {
            .venue-result {
                padding: 0;
                margin: 1rem;
                cursor: pointer;
                list-style-type: none;

                .title {
                    display: flex;
                    align-items: center;
                    color: var(--primary-label-color);

                    img {
                        width: 1rem;
                        height: 1rem;
                        margin-left: 0.5rem;
                    }
                }
                .location {
                    color: gray;
                }
            }
        }
    }
}
</style>