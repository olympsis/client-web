<template>
    <div>
    <div id="venues-picker-card">
        <!-- Header -->
        <h4>{{ t('events.new.locations') }}</h4>
        <div class="sub-label">{{ t('events.new.locationsSub') }}</div>

        <!-- Content: venue cards + add button -->
        <div id="venues-content">
            <div v-for="(venue, i) in model" :key="i" class="venue-card">
                <button class="remove-badge" @click="removeVenueFromModel(venue)">
                    <img src="@/assets/icons/xmark/xmark.red.svg" />
                </button>
                <div class="venue-name">{{ venue.name }}</div>
                <div class="venue-location">{{ formatVenueLocation(venue) }}</div>
                <div class="venue-coords" v-if="venue.location">{{ venue.location.coordinates?.[1]?.toFixed(6) }}, {{ venue.location.coordinates?.[0]?.toFixed(6) }}</div>
            </div>

            <button class="add-location-btn" @click="openPicker">
                <picture>
                    <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)" />
                    <img src="@/assets/icons/pin-drop/pin.drop.svg" />
                </picture>
                <span>Add a Location</span>
            </button>
        </div>
    </div>

    <!-- Location Picker Dialog -->
    <dialog id="locations-dialog" ref="locations-dialog" class="dialog">
        <div id="locations-picker">
            <!-- Header -->
            <div class="picker-header">
                <button class="header-icon-btn" @click="closePicker">
                    <picture>
                        <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)" />
                        <img src="@/assets/icons/xmark/xmark.svg" />
                    </picture>
                </button>

                <span class="picker-title">{{ t('events.venues.title') }}</span>

                <!-- Plus/confirm button: visible when a location is selected -->
                <button
                    v-if="pickerState !== 'search'"
                    class="header-icon-btn confirm-btn"
                    @click="confirmSelection"
                >
                    <picture>
                        <img src="@/assets/icons/add/add.white.svg" />
                    </picture>
                </button>
                <span v-else class="header-icon-spacer"></span>
            </div>

            <!-- Search Bar -->
            <div class="search-wrapper">
                <SearchBar v-model:value="searchText" placeholder="Address, Coordinates...." />
            </div>

            <!-- SELECTED STATE: selected item + map -->
            <template v-if="pickerState === 'selected' && selectedResult">
                <div class="selected-item">
                    <div class="item-icon">
                        <picture>
                            <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)" />
                            <img src="@/assets/icons/pin-drop/pin.drop.svg" />
                        </picture>
                    </div>
                    <div class="item-details">
                        <div class="item-name">{{ selectedResult.name }}</div>
                        <div class="item-address">{{ selectedResult.streetAddress }}</div>
                        <div class="item-locality">{{ selectedResult.localityLine }}</div>
                    </div>
                    <button class="deselect-btn" @click="deselectResult">
                        <img src="@/assets/icons/xmark/xmark.red.svg" />
                    </button>
                </div>

                <div ref="mapContainer" class="map-view"></div>
            </template>

            <!-- CUSTOM STATE: editable item + map -->
            <template v-if="pickerState === 'custom'">
                <div class="selected-item custom-item">
                    <div class="item-icon">
                        <picture>
                            <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)" />
                            <img src="@/assets/icons/pin-drop/pin.drop.svg" />
                        </picture>
                    </div>
                    <div class="item-details">
                        <input
                            class="custom-input custom-input-name"
                            v-model="customName"
                            placeholder="Location name"
                        />
                        <input
                            class="custom-input"
                            v-model="customAddress"
                            placeholder="Street address"
                        />
                        <input
                            class="custom-input"
                            v-model="customLocality"
                            placeholder="City, State ZIP"
                        />
                    </div>
                    <button class="deselect-btn" @click="deselectResult">
                        <img src="@/assets/icons/xmark/xmark.red.svg" />
                    </button>
                </div>

                <div class="map-instructions" v-if="!customCoords">
                    <img class="icon" src="@/assets/icons/pin-drop/pin-drop.gray.svg">
                    {{ t('events.venues.tapToSelect') }}
                </div>
                <div ref="mapContainer" class="map-view"></div>
            </template>

            <!-- SEARCH STATE: custom location option + results list -->
            <template v-if="pickerState === 'search'">
                <div class="results-list">
                    <!-- Add a custom location -->
                    <button class="location-item" @click="startCustomLocation">
                        <div class="item-icon custom-icon">
                            <span>&#10022;</span>
                        </div>
                        <div class="item-details">
                            <div class="item-name">{{ t('events.venues.customLocation') }}</div>
                            <div class="item-address">Address, Coordinates</div>
                        </div>
                    </button>
                    <div class="item-divider"></div>

                    <!-- Search results -->
                    <template v-for="(result, i) in searchResults" :key="i">
                        <button class="location-item" @click="selectResult(result)">
                            <div class="item-icon">
                                <picture>
                                    <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)" />
                                    <img src="@/assets/icons/pin-drop/pin.drop.svg" />
                                </picture>
                            </div>
                            <div class="item-details">
                                <div class="item-name">{{ result.name }}</div>
                                <div class="item-address">{{ result.streetAddress }}</div>
                                <div class="item-locality">{{ result.localityLine }}</div>
                            </div>
                        </button>
                        <div class="item-divider"></div>
                    </template>
                </div>
            </template>
        </div>
    </dialog>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { useModelStore } from '@/stores/model-store';
import { ref, watch, onMounted, nextTick } from 'vue';
import { useSessionStore } from '@/stores/session-store';
import { VenueDescriptor } from '@/data/models/GenericModels';
import { getMapkitServerToken, generateMapkitAuthToken } from '~/utils/map-helpers';

import * as Sentry from "@sentry/nuxt";
import SearchBar from '@/components/SearchBar/SearchBar.vue';

// MapKit global type
declare global {
    interface Window {
        mapkit?: any;
    }
}

// ── Local types ──────────────────────────────────────────────────────────────

/** Rich search result for display purposes (more detail than VenueDescriptor) */
interface LocationItem {
    name: string;
    streetAddress: string;   // e.g. "20 W 34th St"
    localityLine: string;    // e.g. "New York, NY 10001"
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
}

type PickerState = 'search' | 'selected' | 'custom';

// ── Refs & stores ────────────────────────────────────────────────────────────

const { t } = useI18n();
const sessionStore = useSessionStore();
const modelStore = useModelStore();
const model = defineModel<VenueDescriptor[]>({ default: [] });

let map: any = null;
let locationMarker: any = null;

const dialogRef = useTemplateRef<HTMLDialogElement>('locations-dialog');
const mapContainer = ref<HTMLElement | null>(null);

const searchText = ref('');
const pickerState = ref<PickerState>('search');
const selectedResult = ref<LocationItem | undefined>(undefined);
const searchResults: Ref<LocationItem[]> = ref([]);

// Custom location fields
const customName = ref('');
const customAddress = ref('');
const customLocality = ref('');
const customCoords = ref<{ latitude: number; longitude: number } | undefined>(undefined);

// ── Outer card helpers ───────────────────────────────────────────────────────

/** Build a locality/administrative-area string for display in the venue card */
function formatVenueLocation(venue: VenueDescriptor): string {
    return [venue.locality, venue.administrativeArea].filter(Boolean).join(', ');
}

function removeVenueFromModel(venue: VenueDescriptor) {
    const index = model.value.findIndex((v) => v.name === venue.name);
    if (index !== -1) {
        model.value.splice(index, 1);
    } else {
        Sentry.captureMessage(`Failed to remove venue(${venue.name}) from selected list`);
    }
}

// ── Dialog open / close ──────────────────────────────────────────────────────

function openPicker() {
    resetPickerState();
    dialogRef.value?.showModal();
}

function closePicker() {
    resetPickerState();
    dialogRef.value?.close();
}

function resetPickerState() {
    pickerState.value = 'search';
    searchText.value = '';
    selectedResult.value = undefined;
    searchResults.value = [];
    customName.value = '';
    customAddress.value = '';
    customLocality.value = '';
    customCoords.value = undefined;
    destroyMap();
}

// ── Search ───────────────────────────────────────────────────────────────────

let debounceTimeout: number | null = null;

watch(searchText, (newValue) => {
    // If user starts typing while in selected/custom state, go back to search
    if (pickerState.value !== 'search' && newValue) {
        pickerState.value = 'search';
        selectedResult.value = undefined;
        destroyMap();
    }

    if (debounceTimeout !== null) {
        clearTimeout(debounceTimeout);
    }

    debounceTimeout = window.setTimeout(async () => {
        debounceTimeout = null;
        if (newValue && newValue.trim().length > 0) {
            searchResults.value = await searchLocations(newValue);
        }
        // Don't clear searchResults when text is empty — preserves results
        // so the user can deselect and still see the previous list.
        // Results are only cleared on resetPickerState() (open/close).
    }, 500);
});

/** Search Apple Maps + internal venues for the given query */
async function searchLocations(query: string): Promise<LocationItem[]> {
    const results: LocationItem[] = [];

    // Add matching internal venues from the model store
    const internalVenues = modelStore.getAllVenues()
        .filter((v) => v.name?.toLowerCase().includes(query.toLowerCase()))
        .map((v): LocationItem => ({
            name: v.name ?? '',
            streetAddress: v.address ?? '',
            localityLine: [v.locality, v.administrativeArea].filter(Boolean).join(', '),
            city: v.locality ?? '',
            state: v.administrativeArea ?? '',
            country: v.countryCode ?? '',
            latitude: v.location?.coordinates?.[1] ?? 0,
            longitude: v.location?.coordinates?.[0] ?? 0,
        }));
    results.push(...internalVenues);

    // Search Apple Maps for POIs and addresses
    try {
        const mapkitToken = await getMapkitServerToken();

        const params = new URLSearchParams();
        params.set('q', query);
        params.set('lang', navigator.language);

        // Allow both POI and address results so users can search by
        // name ("Central Park"), street address, or coordinates
        params.set('resultTypeFilter', 'poi,address');

        // Use the user's location for relevance ranking and country filtering
        const userLocation = sessionStore.lastKnownLocation;
        if (userLocation) {
            params.set('userLocation', `${userLocation.latitude},${userLocation.longitude}`);
            if (userLocation.countryCode) {
                params.set('limitToCountries', userLocation.countryCode);
            }
        }

        const response = await fetch(
            `https://maps-api.apple.com/v1/search?${params.toString()}`,
            { headers: { 'Authorization': `Bearer ${mapkitToken}` } }
        );

        const data = await response.json();
        const apiResults = data['results'] ?? [];

        for (const r of apiResults) {
            const addr = r['structuredAddress'] ?? {};
            const streetParts = [addr['subThoroughfare'], addr['thoroughfare']].filter(Boolean);

            results.push({
                name: r['name'] ?? '',
                streetAddress: streetParts.join(' '),
                localityLine: [addr['locality'], addr['administrativeAreaCode'], addr['postCode']].filter(Boolean).join(', '),
                city: addr['locality'] ?? '',
                state: addr['administrativeAreaCode'] ?? '',
                country: addr['countryCode'] ?? '',
                latitude: r['coordinate']?.['latitude'] ?? 0,
                longitude: r['coordinate']?.['longitude'] ?? 0,
            });
        }
    } catch (error) {
        console.error('Apple Maps search failed:', error);
    }

    return results;
}

// ── Selection ────────────────────────────────────────────────────────────────

function selectResult(result: LocationItem) {
    selectedResult.value = result;
    pickerState.value = 'selected';
    searchText.value = '';

    // Initialize map after DOM updates
    nextTick(() => {
        setTimeout(() => {
            initMapForLocation(result.latitude, result.longitude, false);
        }, 100);
    });
}

function deselectResult() {
    selectedResult.value = undefined;
    customCoords.value = undefined;
    pickerState.value = 'search';
    destroyMap();
}

/** Confirm the selection and add it to the model */
function confirmSelection() {
    if (pickerState.value === 'selected' && selectedResult.value) {
        const r = selectedResult.value;
        // Ad-hoc descriptor — leave venueId undefined so consumers know
        // there's no backing Venue document to look up.
        const venue = new VenueDescriptor(
            undefined,
            r.name,
            r.latitude,
            r.longitude,
            r.streetAddress,
            r.city,
            undefined,
            r.state,
            r.country
        );
        model.value.push(venue);
    } else if (pickerState.value === 'custom' && customCoords.value) {
        const venue = new VenueDescriptor(
            undefined,
            customName.value || t('events.detail.customLocation'),
            customCoords.value.latitude,
            customCoords.value.longitude,
            customAddress.value || undefined,
            customLocality.value.split(',')[0]?.trim() || undefined,
            undefined,
            customLocality.value.split(',')[1]?.trim() || undefined,
            undefined
        );
        model.value.push(venue);
    }

    closePicker();
}

// ── Custom location ──────────────────────────────────────────────────────────

function startCustomLocation() {
    pickerState.value = 'custom';
    searchText.value = '';
    customName.value = '';
    customAddress.value = '';
    customLocality.value = '';
    customCoords.value = undefined;

    nextTick(() => {
        setTimeout(() => {
            // Initialize map centered on user location, tap-to-place enabled
            const userLocation = sessionStore.lastKnownLocation;
            const lat = userLocation?.latitude ?? 40.7128;
            const lng = userLocation?.longitude ?? -74.006;
            initMapForLocation(lat, lng, true);
        }, 100);
    });
}

// ── MapKit ───────────────────────────────────────────────────────────────────

onMounted(() => {
    if (!window.mapkit) {
        loadMapKitJS().catch(error => {
            console.error('Failed to load MapKit JS:', error);
        });
    }
});

async function loadMapKitJS(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.mapkit) { resolve(); return; }

        const script = document.createElement('script');
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load MapKit JS'));
        document.head.appendChild(script);
    });
}

async function ensureMapKitInitialized(): Promise<void> {
    if (!window.mapkit) {
        await loadMapKitJS();
    }

    // MapKit init is idempotent if already initialized, but we guard anyway
    if (!window.mapkit._initialized) {
        window.mapkit.init({
            authorizationCallback: function(done: (token: string) => void) {
                generateMapkitAuthToken().then((token: string) => done(token));
            },
            language: navigator.language
        });
        window.mapkit._initialized = true;
    }
}

/**
 * Create a map in the mapContainer, centered on the given coordinates.
 * @param allowTap - if true, allows the user to tap the map to place/move a pin
 */
async function initMapForLocation(latitude: number, longitude: number, allowTap: boolean) {
    try {
        await ensureMapKitInitialized();
    } catch (error) {
        console.error('Failed to initialize MapKit:', error);
        return;
    }

    if (!mapContainer.value || !window.mapkit) return;

    destroyMap();

    const options = {
        showsZoomControl: true,
        showsUserLocation: true,
        showsMapTypeControl: false,
        showsPointsOfInterest: true,
    };

    map = new window.mapkit.Map(mapContainer.value, options);
    map.colorScheme = window.mapkit.Map.ColorSchemes.Adaptive;

    // Center on the location
    const center = new window.mapkit.Coordinate(latitude, longitude);
    const span = new window.mapkit.CoordinateSpan(0.016, 0.016);
    map.setRegionAnimated(new window.mapkit.CoordinateRegion(center, span));

    // Add pin if we have a specific location (not just user location for custom)
    if (!allowTap) {
        addMarker(latitude, longitude);
    }

    // Enable tap-to-place for custom locations
    if (allowTap) {
        map.addEventListener('single-tap', handleMapTap);
    }
}

function handleMapTap(event: any) {
    const coordinate = map.convertPointOnPageToCoordinate(event.pointOnPage);

    customCoords.value = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude
    };

    addMarker(coordinate.latitude, coordinate.longitude);

    // Reverse geocode to fill in address fields
    reverseGeocode(coordinate.latitude, coordinate.longitude);
}

function addMarker(latitude: number, longitude: number) {
    if (!window.mapkit || !map) return;

    if (locationMarker) {
        map.removeAnnotation(locationMarker);
    }

    const coordinate = new window.mapkit.Coordinate(latitude, longitude);
    locationMarker = new window.mapkit.MarkerAnnotation(coordinate, {
        color: "#c969e0",
        title: "Selected Location",
        animates: true,
        selected: true
    });

    map.addAnnotation(locationMarker);
    map.setCenterAnimated(coordinate);
}

async function reverseGeocode(latitude: number, longitude: number) {
    try {
        const mapkitToken = await getMapkitServerToken();
        const response = await fetch(
            `https://maps-api.apple.com/v1/reverseGeocode?loc=${latitude},${longitude}`,
            { headers: { 'Authorization': `Bearer ${mapkitToken}` } }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.results?.length > 0) {
                const addr = data.results[0].structuredAddress;
                if (addr) {
                    const streetParts = [addr.subThoroughfare, addr.thoroughfare].filter(Boolean);
                    if (!customName.value) {
                        customName.value = streetParts.join(' ') || t('events.detail.customLocation');
                    }
                    customAddress.value = streetParts.join(' ');
                    customLocality.value = [addr.locality, addr.administrativeAreaCode, addr.postCode].filter(Boolean).join(', ');
                }
            }
        }
    } catch (error) {
        console.error('Reverse geocode failed:', error);
    }
}

function destroyMap() {
    if (map) {
        try {
            map.removeEventListener('single-tap', handleMapTap);
            map.destroy();
        } catch { /* map may already be destroyed */ }
        map = null;
        locationMarker = null;
    }
}
</script>

<style scoped>
/* ── Outer card (matches EventHostsCard pattern) ─────────────────────────── */

#venues-picker-card {
    padding: 1rem;
    border-radius: 20px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--component-border-color);
    background-color: var(--component-background-color);

    h4 {
        margin-bottom: 0.25rem;
        color: var(--primary-label-color);
    }

    .sub-label {
        color: gray;
        font-size: 0.8rem;
        margin-bottom: 1rem;
    }
}

#venues-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.venue-card {
    position: relative;
    padding: 0.75rem 1rem;
    border-radius: 16px;
    flex: 1 1 calc(50% - 0.75rem);
    max-width: calc(50% - 0.375rem);
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid var(--component-border-color);
    background-color: color-mix(in srgb, var(--secondary-background-color) 80%, transparent);

    .remove-badge {
        all: unset;
        cursor: pointer;
        position: absolute;
        top: 4px;
        right: 4px;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        img { width: 14px; height: 14px; }
    }

    .venue-name {
        font-weight: 700;
        font-size: 1rem;
        color: var(--primary-label-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .venue-location {
        font-style: italic;
        font-size: 0.85rem;
        color: gray;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .venue-coords {
        font-size: 0.85rem;
        color: gray;
    }
}

.add-location-btn {
    all: unset;
    gap: 0.4rem;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-radius: 20px;
    padding: 0.4rem 0.75rem;
    color: var(--primary-label-color);
    border: 1px solid var(--component-border);
    background-color: var(--secondary-background-color);
    font-size: 0.85rem;

    picture {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img { width: 1.2rem; height: 1.2rem; }

    &:hover {
        background-color: var(--tertiary-background-color);
    }
}

/* ── Dialog ──────────────────────────────────────────────────────────────── */

#locations-dialog {
    border: unset;
    padding: 0;
    width: fit-content;
    height: fit-content;
    margin: auto;
    background: transparent;
    max-width: 100vw;
    max-height: 100vh;

    &::backdrop {
        backdrop-filter: blur(5px);
        background: rgba(0, 0, 0, 0.3);
    }
}

/* ── Picker container ────────────────────────────────────────────────────── */

#locations-picker {
    width: 32rem;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 20px;
    border: var(--component-border-color) solid 1px;
    background-color: var(--tertiary-background-color);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

/* ── Header ──────────────────────────────────────────────────────────────── */

.picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.5rem;
}

.picker-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--primary-label-color);
}

.header-icon-btn {
    all: unset;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    backdrop-filter: blur(20px);
    padding: 0rem 0.25rem 0rem 0.25rem;
    -webkit-backdrop-filter: blur(20px);
    background: var(--component-background-color);
    border: var(--component-border-color) solid 1px;

    picture, img {
        width: 1.1rem;
        height: 1.1rem;
    }
}

.confirm-btn {
    border-radius: 15px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(38, 46, 87, 0.85);
    padding: 0rem 0.25rem 0rem 0.25rem;
    border: var(--component-border-color) solid 1px;
}

/* Spacer to keep title centered when + button is hidden */
.header-icon-spacer {
    width: 2rem;
    height: 2rem;
}

/* ── Search wrapper ──────────────────────────────────────────────────────── */

.search-wrapper {
    padding: 0.5rem 1.25rem;

    #search-bar {
        background: var(--component-background-color);
        border: var(--component-border-color) solid 1px;

        input {
            background: var(--component-background-color);
        }
    }
}

/* ── Results list ────────────────────────────────────────────────────────── */

.results-list {
    max-height: 60vh;
    padding: 0 0.5rem 0.5rem 0.5rem;
    overflow-y: auto;
}

.location-item {
    all: unset;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        background-color: var(--secondary-background-color);
        border-radius: 12px;
    }
}

.item-icon {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.1rem;
    color: var(--primary-label-color);

    picture, img {
        width: 1.2rem;
        height: 1.2rem;
    }
}

.custom-icon {
    font-size: 1.2rem;
}

.item-details {
    flex: 1;
    min-width: 0;
}

.item-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--primary-label-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-address {
    font-size: 0.8rem;
    color: var(--secondary-label-color, gray);
}

.item-locality {
    font-size: 0.8rem;
    color: var(--secondary-label-color, gray);
}

.item-divider {
    height: 1px;
    margin: 0 1.25rem 0 3rem;
    background-color: var(--component-border-color);
}

/* ── Selected item ───────────────────────────────────────────────────────── */

.selected-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
}

.deselect-btn {
    all: unset;
    cursor: pointer;
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.25rem;

    border-radius: 15px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: color-mix(in srgb, var(--olympsis-red) 25%, transparent);
    padding: 0.15rem 0.5rem 0.15rem 0.5rem;
    border: var(--component-border-color) solid 1px;

    img {
        width: 0.9rem;
        height: 0.9rem;
    }
}

/* ── Custom location inputs ──────────────────────────────────────────────── */

.custom-input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--primary-label-color);
    font-family: inherit;
    padding: 0;
    outline: none;
}

.custom-input-name {
    font-weight: 700;
    font-size: 0.9rem;
}

.custom-input::placeholder {
    color: var(--secondary-label-color, gray);
}

/* ── Map ─────────────────────────────────────────────────────────────────── */

.map-view {
    width: 100%;
    height: 30vh;
    min-height: 250px;
    display: block;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    overflow: hidden;
}

.map-instructions {
    display: flex;
    font-size: 0.8rem;
    text-align: center;
    color: #7a797980;
    align-items: center;
    padding: 0.5rem 1.25rem;
    justify-content: center;
    gap: 0.25rem;

    .icon {
        width: 1rem;
        height: 1rem;
    }
}
</style>
