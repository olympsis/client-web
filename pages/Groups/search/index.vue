<template>
    <NavigationBar/>
    <main id="groups-search">
        <div id="header">
            <h1>Explore Groups</h1>

            <div id="body">
                <SearchBar v-model:value="searchText" />
            </div>

            <div id="trailing">
                <picture id="plus" @click="router.push('/groups/new');">
                    <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/plus/plus.svg">
                </picture>

                <picture id="settings">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/gear/gear.svg">
                </picture>
            </div>
        </div>

        <div id="mobile-header">
            <div id="title">
                <h1>Explore Groups</h1>

                <div id="trailing">
                    <picture id="plus" @click="router.push('/groups/new');">
                        <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/plus/plus.svg">
                    </picture>

                    <picture id="settings">
                        <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/gear/gear.svg">
                    </picture>
                </div>
            </div>

            <SearchBar v-model:value="searchText" />
        </div>

        <div id="sub-header">
            <button id="filter" @click="showFilter = true">
                <div id="text">Filters</div>
                <picture :style="{height: '24px'}">
                    <source srcset="@/assets/icons/filter/filter.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/filter/filter.svg">
                </picture>
            </button>

            <Drawer v-model:visible="showFilter" position="right">
                <div class="section-header" :style="{fontWeight: 'bold'}">Sports</div>
                <SportsFilter v-model:model-value="selectedSports"/>

                <div class="section-header" :style="{fontWeight: 'bold'}">Tags</div>
                <TagsFilter v-model:model-value="selectedTags"/>
            </Drawer>
        </div>

        <div id="list-wrapper">
            <SearchBar v-model:value="searchText"/>
            <ul id="list">
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
import { SPORTS, stringToSport, VIEW_STATE } from '@/data/Enums';
import { GroupSelection, Location, Sport, Tag } from '@/data/models/GenericModels';

import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';

import Drawer from 'primevue/drawer';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import SportsFilter from '~/components/SportsFilter/SportsFilter.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import ClubListCard from '@/components/Groups/Clubs/ClubListCard/ClubListCard.vue';
import ClubListCardTemplate from '@/components/Groups/Clubs/ClubListCardTemplate/ClubListCardTemplate.vue';


const router = useRouter();
const modelStore = useModelStore();
const sessionStore = useSessionStore();

const state = ref(VIEW_STATE.SUCCESS);
const searchText: Ref<string> = ref('');
const showFilter = ref<boolean>(false);
const selectedTags: Ref<Array<Tag>> = ref([]);
const selectedSports: Ref<Array<Sport>> = ref([]);

// All of the clubs from the search results
const clubs: Ref<Club[]> = ref([]);

// Filters clubs based on our selected sports, tags and name if we have one
const filteredClubs: ComputedRef<Club[]> = computed(() => {
    return clubs.value
    .filter((c) => { // Filter out user's clubs
        return !sessionStore.groups.some((g) => {
            const groupID = g.club?.id ?? g.organization?.id;
            return groupID === c.id;
        });
    })
    .filter((c) => { // Filter by other criteria
        var includesSport = c.sports?.find((s: string) => {
            return selectedSports.value.find((sp) => sp.name == s);
        });

        var includesTag = c.tags?.find((t) => {
            return selectedTags.value.find((tg) => tg.name == t);
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

async function fetchClubs() {
    state.value = VIEW_STATE.LOADING;
    let location = sessionStore.lastKnownLocation;
    if (!location) { 
        location = new Location(
            40.76553,
            -73.97770,
            'Manhattan',
            'New York',
            'NY',
            '',
            'United States',
            'US'
        );
    }

    const response = await sessionStore.clubService.getClubs(location.administrativeArea ?? 'New York', location.country ?? 'United States');
    if (response) {
        modelStore.setClubs(response.clubs);
        clubs.value = modelStore.getAllClubs();
        state.value = VIEW_STATE.SUCCESS;
    } else {
        state.value = VIEW_STATE.FAILURE;
    }
}

sessionStore.$subscribe((mutation: any, state) => {
    const payload = mutation.payload;
    if (payload?.lastKnownLocation) {
        fetchClubs();
    }
});

useSeoMeta({
    title: () => 'Groups | Olympsis',
    ogTitle: () => 'Groups | Olympsis',
    description: 'Join groups built around the sports you love!',
    ogDescription: 'Join groups built around the sports you love!'
});

onMounted(() => {
    // Preselect user favorite sports
    // TODO: Add the ability to remember selections
    const session = useSessionStore();
    session.user?.sports?.forEach((s) => {
        const found = session.sports.find((sp) => sp.name.includes(s));
        if (found) {
            selectedSports.value.push(found);
        }
    })

    fetchClubs()
});

</script>

<style scoped>
#groups-search {
    gap: 1rem;
    width: 100%;
    display: grid;
    height: 100dvh;
    margin: 0 auto;
    padding: 0rem 2rem;
    overflow-y: scroll;
    justify-content: center;
    grid-template-rows: 4rem auto auto auto auto;
    grid-template-areas: 
    "header"
    "sub-header"
    "list"
    "list"
    "list";

    h1 {
        width: 100%;
        color: var(--primary-label-color);
    }

    #header {
        width: 100%;
        display: flex;
        margin-top: 1rem;
        grid-area: header;
        align-items: center;
        justify-content: space-between;

        #body {
            width: 100%;
            max-width: 35rem;
            margin-right: 1rem;
        }
    }

    #sub-header {
        display: flex;
        margin: 0.5rem 0rem;

        #filter {
            display: flex;
            height: 2.5rem;
            cursor: pointer;
            margin-left: auto;
            width: fit-content;
            border-radius: 18px;
            align-items: center;
            padding: 0.15rem 1rem;
            justify-content: center;
            border: var(--component-border) solid 1px;
            background-color: var(--secondary-background-color);

            #text {
                font-size: 1rem;
                font-weight: 500;
                margin-right: 0.5rem;
            }
        }
    }

    #mobile-header {
        display: none;
    }

    #trailing {
        width: 7rem;
        display: flex;
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

    #sub-header {
        grid-area: sub-header;
    }
    
    #list-wrapper {
        #search-bar {
            display: none;
        }

        #list {
            display: grid;
            grid-area: list;
            row-gap: 0.5rem;
            list-style: none;
            column-gap: 0.5rem;
            overflow-y: scroll;
            border-radius: 10px;
            justify-content: center;
            grid-template-rows: 25rem;
            padding-inline-start: unset;
            grid-template-columns: 25rem 25rem;

            #search-bar {
                display: none;
            }
        }
    }
}


@media (max-width: 940px) {
    #groups-search {
        grid-template-areas: 
            "header"
            "sub-header"
            "list"
            "list"
            "list";
        
        padding: unset;
        grid-template-rows: unset;
        margin: 1rem 0rem 0rem 0rem;
        grid-template-columns: auto;

        #header {
            display: none;
        }
        #trailing {
            padding: 0.25rem 0.5rem;
        }

        #mobile-header {
            display: flex;
            grid-area: header;
            flex-direction: column;
            width: calc(100vw - 1rem);

            #title {
                display: flex;
                margin-bottom: 0.5rem;
            }
        }

        #sub-header {
            width: calc(100vw - 1rem);
        }


        #list-wrapper {
            #search-bar {
                margin-right: unset;
            }

            #list {
                grid-template-columns: auto;
            }
        }
    }
}
</style>