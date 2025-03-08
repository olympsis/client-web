<template>
    <NavigationBar/>
    <main id="groups-container">
        <div id="header">
            <h1>Explore Groups</h1>

            <div id="body">
                <SearchBar v-model:value="searchText" />
            </div>

            <div id="trailing">
                <picture id="plus" @click="handleOpenNewGroupDialog">
                    <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/plus/plus.svg">
                </picture>

                <picture id="settings">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg">
                </picture>
            </div>
        </div>

        <div id="header-mobile">
            <div id="leading">
                <h1>Groups</h1>

                <div id="trailing">
                    <picture id="plus" @click="handleOpenNewGroupDialog">
                        <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/plus/plus.svg">
                    </picture>

                    <picture id="settings">
                        <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/gear/gear.svg">
                    </picture>
                </div>
            </div>
        </div>

        <div id="list-wrapper">
            <SearchBar v-model:value="searchText"/>
            <ul id="list-container">
                <ClubListCardTemplate v-if="state === VIEW_STATE.LOADING" v-for="_ in 10"/>
                <ClubListCard v-else v-for="club in filteredClubs" :club="club" />
            </ul>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Ref, ComputedRef } from 'vue';
import { computed, ref, useTemplateRef } from 'vue';

import { Club } from '@/data/models/ClubModels';
import { VIEW_STATE } from '@/data/Enums';
import { GroupSelection, Location } from '@/data/models/GenericModels';

import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';

import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TagsListCard from '@/components/TagsListCard/TagsListCard.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import NavigationCard from '@/components/NavigationCard/NavigationCard.vue';
import SportsListCard from '@/components/SportsListCard/SportsListCard.vue';
import ClubListCard from '@/components/Groups/Clubs/ClubListCard/ClubListCard.vue';
import ClubListCardTemplate from '@/components/Groups/Clubs/ClubListCardTemplate/ClubListCardTemplate.vue';


const router = useRouter();
const modelStore = useModelStore();
const sessionStore = useSessionStore();
const state = ref(VIEW_STATE.SUCCESS);

const searchText: Ref<string> = ref('');
const selectedTags: Ref<Array<string>> = ref([]);
const selectedSports: Ref<Array<string>> = ref([]);

// All of the clubs from the search results
const clubs: Ref<Club[]> = ref([]);

// Filters clubs based on our selected sports, tags and name if we have one
const filteredClubs: ComputedRef<Club[]> = computed(() => {
    return clubs.value.filter((c) => {
        var includesSport = c.sports?.find((s: string) => {
            return selectedSports.value.includes(s);
        });

        var includesTag = c.tags?.find((t) => {
            return selectedTags.value.includes(t);
        });

        var containsSearch = c.name?.toLowerCase().includes(searchText.value.toLowerCase());

        if (selectedSports.value.length > 0 && selectedTags.value.length > 0) {
            return includesSport && includesTag && containsSearch;
        } else if (selectedSports.value.length > 0 && selectedTags.value.length == 0) {
            return includesSport && containsSearch;
        } else if (selectedSports.value.length == 0 && selectedTags.value.length > 0) {
            return includesTag && containsSearch;
        } else {
            return c && containsSearch;
        }
    });
});

// Load clubs from memory if we have any
// If we don't and we already have the location then fetch it
clubs.value = modelStore.getAllClubs();
if (clubs.value.length < 1) {
    if (sessionStore.lastKnownLocation) {
        fetchClubs(sessionStore.lastKnownLocation)
    }
}

// Listen to location changes to update data
sessionStore.$subscribe((mutation: any, state) => {
    const payload = mutation.payload;
    if (payload?.lastKnownLocation) {
        fetchClubs(payload.lastKnownLocation)
    }
});

async function fetchClubs(location: Location) {
    state.value = VIEW_STATE.LOADING;
    const response = await sessionStore.clubService.getClubs(location.administrativeArea ?? 'New York City', location.country ?? 'United States');
    if (response) {
        clubs.value = response.clubs
        modelStore.setClubs(response.clubs);
        state.value = VIEW_STATE.SUCCESS;
    }
}

function handleSelectedTagsUpdate(event: { selectedTags: Array<string> }) {
    selectedTags.value = event.selectedTags;
}

function handleSelectedSportsUpdate(event: { selectedSports: Array<string> }) {
    selectedSports.value = event.selectedSports;
}

function handleOpenNewGroupDialog() {
    router.push('/groups/new');
}

useSeoMeta({
    title: () => 'Groups| Olympsis',
    ogTitle: () => 'Groups | Olympsis',
    description: 'Join groups around the sports you love!',
    ogDescription: 'Join groups around the sports you love'
});

</script>

<style scoped>
#groups-container {
    gap: 1rem;
    display: grid;
    height: 100dvh;
    margin: 0 auto;
    overflow: hidden;
    padding: 0rem 2rem;
    grid-template-areas: 
    "header header"
    "list list"
    "list list"
    "list list";

    h1 {
        width: 100%;
        color: var(--primary-label-color);
    }

    #header {
        width: 100%;
        display: flex;
        margin-top: 1rem;
        align-items: center;
        grid-area: header;
        justify-content: space-between;

        #body {
            width: 100%;
            max-width: 35rem;
        }

        #trailing {
            display: flex;
            width: 7rem;
            border-radius: 10px;
            padding: 0.25rem 1rem;
            justify-content: space-between;
            background-color: var(--secondary-background-color);
            
            #plus {
                width: 2rem;
                height: 2rem;
                cursor: pointer;

                img {
                    width: 2rem;
                    height: 2rem;
                }
            }

            #chats {
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                margin: 0rem 0.5rem;
                margin-right: 0.5rem;

                img {
                    width: 2.2rem;
                    height: 2.2rem;
                    margin-top: 0.1rem;
                }
            }

            #settings {
                width: 2rem;
                height: 2rem;
                cursor: pointer;

                img {
                    width: 2rem;
                    height: 2rem;
                }
            }
        }
    }

    #header-mobile {
        display: none;
    }

    #tags {
        grid-area: tags;
    }

    #sports {
        grid-area: sports;
    }

    #nav {
        grid-area: nav;
        margin-top: auto;
        margin-bottom: 1rem;
    }

    #list-wrapper {
        #search-bar {
            display: none;
        }

        #list-container {
            display: grid;
            grid-area: list;
            row-gap: 0.5rem;
            list-style: none;
            margin: 0rem auto;
            column-gap: 0.5rem;
            overflow-y: scroll;
            border-radius: 10px;
            grid-template-rows: 25rem;
            padding-inline-start: unset;
            grid-template-columns: 25rem 25rem;
            height: calc(100dvh - 110px - 2rem);

            #search-bar {
                display: none;
            }
        }
    }
}


@media (max-width: 940px) {
    #groups-container {
        grid-template-areas: 
            "header"
            "list"
            "list"
            "list";
        
        max-width: 33rem;
        padding: 0rem 1rem;
        grid-template-rows: unset;
        margin: 1rem 0rem 0rem 0rem;
        grid-template-columns: auto;

        #list-wrapper {
            #search-bar {
                margin-right: unset;
            }

            #list-container {
                grid-template-columns: auto;
                height: calc(100dvh - 110px - 2rem);
            }
        }

        #tags {
            display: none;
        }

        #sports {
            display: none;
        }

        #nav {
            display: none;
        }
    }
}

#new-group-dialog {
    top: 0;
    z-index: 10;
    width: 100%;
    border: unset;
    padding: unset;
    margin: 0 auto;
    border-radius: 10px;
    background: transparent;
    backdrop-filter: blur(5px);
}
</style>