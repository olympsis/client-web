<template>
    <NavigationBar/>
    <main id="groups-container">
        <div id="header">
            <h1>Groups</h1>

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

        <div id="tags">
            <TagsListCard @selected-changed="handleSelectedTagsUpdate"/>
        </div>

        <div id="sports">
            <SportsListCard @selected-changed="handleSelectedSportsUpdate"/>
        </div>

        <div id="nav">
            <NavigationCard :state="state"/>
        </div>

        <div id="list-wrapper">
            <SearchBar v-model:value="searchText"/>
            <div id="list">
                <ul id="list-container">
                    <ClubListCardTemplate v-if="state === VIEW_STATE.LOADING" v-for="_ in 10"/>
                    <ClubListCard v-else v-for="club in filteredClubs" :club="club" />
                </ul>
            </div>
        </div>
        
        <dialog ref="new-group-dialog" id="new-group-dialog" class="dialog">
            <NewGroupCard @close="handleCloseNewGroupDialog"/>
        </dialog>
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
import NewGroupCard from '@/components/Groups/New Group/NewGroupCard/NewGroupCard.vue';
import ClubListCardTemplate from '@/components/Groups/Clubs/ClubListCardTemplate/ClubListCardTemplate.vue';


const router = useRouter();
const modelStore = useModelStore();
const sessionStore = useSessionStore();
const state = ref(VIEW_STATE.SUCCESS);

const newGroupDialog = useTemplateRef<HTMLDialogElement>('new-group-dialog');

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
    if (newGroupDialog.value) {
        newGroupDialog.value.show();
    } else {
        console.error('Failed to find reference to new group dialog html component.')
    }
}

function handleCloseNewGroupDialog(event: { newGroup: GroupSelection }) {
    if (newGroupDialog.value) {
        if (event) {
            if (event.newGroup) {
                const id = event.newGroup.club?.id ?? event.newGroup.organization?.id;
                if (id) {
                    router.push('/groups');
                }
            }
        }
        newGroupDialog.value.close();
    } else {
        console.error('Failed to find reference to new group dialog html component.')
    }
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
    margin: 0 auto;
    overflow: hidden;
    padding: 0rem 2rem;
    grid-template-areas: 
    "header header header"
    "sports list list"
    "tags list list"
    "nav list list";
    grid-template-columns: 25rem auto auto;
    grid-template-rows: 5rem 18rem 18rem auto;

    h1 {
        font-weight: 900;
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

        #list {
            grid-area: list;
            margin: 0rem auto;
            list-style: none;
            overflow-y: scroll;
            border-radius: 10px;
            height: calc(100dvh - calc(60px + calc(50px + 2rem)));

            #list-container {
                display: grid;
                row-gap: 0.5rem;
                column-gap: 0.5rem;
                padding-inline-start: unset;
                grid-template-columns: 25rem 25rem;

                #search-bar {
                    display: none;
                }
            }
        }
    }
}

@media (max-width: 1280px) {
    #groups-container {
        grid-template-areas: 
            "header list"
            "sports list"
            "tags list"
            "nav list";
        width: fit-content;
        margin-top: 1rem;
        grid-template-columns: 22rem 26rem;

        #header {
            display: none;
        }

        #header-mobile {
            width: 100%;
            display: flex;
            grid-area: header;

            #leading {
                width: 100%;
                height: 40px;
                display: flex;
                max-width: 42rem;
                justify-content: space-between;
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

        #list-wrapper {
            grid-area: list;
            #search-bar {
                width: 100%;
                display: flex;
                max-width: 42rem;
                margin-right: 1rem;
                margin-bottom: 1rem;
            }

            #list {
                max-width: 31rem;
                #list-container {
                    grid-template-columns: 25rem;
                }
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

            #list {
                height: calc(100vh - calc(60px + calc(40px + 5.5rem)));
                #list-container {
                    grid-template-columns: auto;
                }
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