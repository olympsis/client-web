<template>
    <button id="venues-picker-button" @click="showPicker = true">
        {{ pickerText }}
    </button>

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
                    <button id="cancel" @click="dismissModal(closeCallback)">
                        Cancel
                    </button>

                    Venues

                    <button id="done" @click="dismissModal(closeCallback)">
                        Done
                    </button>
                </div>

                <!-- Popup Body -->
                <div id="popup-body">
                    <ScrollPanel :style="{ 'height': '70vh' }">

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
                                <button @click="toggleCustomLocation" :class="{ 'custom-location-text': isCustomLocation }" > Use custom location </button>
                                <SearchBar v-model:value="searchText" :class="{ 'custom-location': isCustomLocation }"/>
                                <p id="venues-count-label" v-if="!isCustomLocation">{{ venuesCount }}</p>
                            </div>

                            <div id="search-results">
                                <div v-if="!isCustomLocation" v-for="venue in venues" class="venue-result" @click="selectVenue(venue)">
                                    <div class="name">{{ venue.name }}</div>
                                    <div class="location">{{ `${venue.city}, ${venue.state}` }}</div>
                                </div>
                                <div v-if="isCustomLocation" v-for="venue in venuesResult" class="venue-result" @click="selectVenue(venue)">
                                    <div class="name">{{ venue.name }}</div>
                                    <div class="location">{{ `${venue.city}, ${venue.state}` }}</div>
                                </div>
                            </div>
                        </div>
                    </ScrollPanel>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { useModelStore } from '@/stores/model-store';
import { DEV_VENUES } from '@/data/dev-data/test-data';
import { useSessionStore } from '@/stores/session-store';
import { getMapkitServerToken } from '@/utils/MapHelpers';
import { VenueDescriptor } from '@/data/models/GenericModels';

import Dialog from 'primevue/dialog';
import ScrollPanel from 'primevue/scrollpanel';
import SearchBar from '@/components/SearchBar/SearchBar.vue';

const sessionStore = useSessionStore();
const modelStore = useModelStore();
const model = defineModel<VenueDescriptor[]>({ default: [] });

const op = ref();
const randomKey = ref(0);
const searchText = ref('');
const showPicker = ref(false);
const isSearching = ref(false);
const isCustomLocation = ref(false);

const pickerText: ComputedRef<string> = computed(() => {
    return model.value.length > 0 ? `Change Venue(s)(${model.value.length})` : 'Pick Venue(s)'
});

const venues: ComputedRef<VenueDescriptor[]> = computed(() => {

    // STORYBOOK TESTING DATA
    // const list: VenueDescriptor[] =  DEV_VENUES.map((v: Venue) => {
    //     return VenueDescriptor.decode({
    //         'type': 'internal',
    //         'id': v.id,
    //         'name': v.name,
    //         'city': v.city,
    //         'state': v.state,
    //         'country': v.country
    //     });
    // });

    // return list.filter((v: VenueDescriptor) => { return v.name?.toLowerCase().includes(searchText.value.toLowerCase()) });
    // END OF TEST DATA

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
    return arr.filter((v: VenueDescriptor) => { return v.name?.toLowerCase().includes(searchText.value.toLowerCase()) });
});
const venuesResult: Ref<VenueDescriptor[]> = ref([]);
const venuesCount: ComputedRef<string> = computed(() => {
    return `${venues.value.length} venue(s) near you`;
});

let debounceTimeout: number | null = null;
watch(searchText, (newValue, oldValue) => {
    if (isCustomLocation.value == true) {
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
    }
});

function dismissModal(callback: () => void) {
    isSearching.value = false;
    isCustomLocation.value = false;
    callback();
}

function toggleCustomLocation() {
    isCustomLocation.value = !isCustomLocation.value
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
        searchLocation = `${userLocation?.latitude}, ${userLocation?.latitude}`
    }
    const poiCategories = 'Park,Golf,Basketball,FitnessCenter,RockClimbing,Skiing,Soccer,Stadium,Tennis,Volleyball';
    const resultCategories = 'Poi'
    const response = await fetch(`https://maps-api.apple.com/v1/search?q=${name}&includePoiCategories=${poiCategories}&resultTypeFilter=${resultCategories}&userLocation=${searchLocation}`, 
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

<style>
#venues-picker-button {
    width: 100%;
    height: 100%;
    height: 7rem; 
    border: unset;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 10px;
    color: var(--primary-label-color);
    background-color: var(--tertiary-background-color);
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

    #popup-body {
        background-color: var(--primary-background-color);
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
                margin: 1rem;
                cursor: pointer;

                .name {
                    color: var(--primary-label-color);
                }
                .location {
                    color: gray;
                }
            }
        }
    }
}
</style>