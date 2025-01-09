<template>
    <NavigationBar/>
    <main id="group-detail">
        <div id="left">
            <div id="header">
                <button class="button" :style="{ marginRight: '1rem' }" @click="router.push('/groups/search')">
                    <picture class="centered">
                        <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/chevron/chevron.left.svg"/>
                    </picture>
                </button>

                <button class="button" @click="handleGroupSharing">
                    <picture class="centered">
                        <source srcset="@/assets/icons/share/share.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/share/share.svg"/>
                    </picture>
                </button>
            </div>

            <div id="images">
                <h1>{{ groupName }}</h1>
                <GroupLogoAndBanner :logo-u-r-l="groupLogoURL" :banner-u-r-l="groupBannerURL" />
            </div>

            <div id="info">
                <div id="visibility">
                    <img src="@/assets/icons/globe/globe.white.svg">
                    <div>Public Group</div>
                </div>

                <div id="members">
                    <GroupMembersPeek :members="groupMembers"/>
                    <div>{{ groupMembersString }}</div>
                </div>
            </div>

            <div id="actions">
                <BoldTextButton v-model="actionState" text="apply" @click="apply"/>
            </div>
        </div>

        <div id="right">
            <div id="about" class="section">
                <h2>About</h2>
                <p>{{ groupAbout }}</p>
            </div>

            <div id="tags" class="section">
                <h2>Tags</h2>
                <p>
                    No tags set
                </p>
            </div>

            <div id="location" class="section">
                <h2>Location</h2>
                <p>{{ groupLocation }}</p>
                <div id="map-view">
                    Failed to load map
                </div>
            </div>

            <div id="history" class="section">
                <h2>History</h2>
                <p>{{ groupHistory }}</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Club } from '@/data/models/ClubModels';
import { useRoute, useRouter } from 'vue-router';
import { formatRelativeTime } from '@/utils/Time';
import { Member } from '@/data/models/GenericModels';
import { useModelStore } from '@/stores/model-store';
import { AUTH_STATUS, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { ClubService } from '@/data/services/ClubService';

import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import GroupMembersPeek from '@/components/Groups/GroupMembersPeek/GroupMembersPeek.vue';
import GroupLogoAndBanner from '@/components/Groups/GroupLogoAndBanner/GroupLogoAndBanner.vue';
import BoldTextButton from '@/components/Buttons/LoadingButtons/BoldTextButton/BoldTextButton.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const service = new ClubService();
const modelStore = useModelStore();

const club = ref<Club | undefined>(undefined);
const viewState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const actionState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const locationState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

/**
 * COMPUTED VARIABLES
 */

const isAuthenticated = computed<boolean>(() => {
    return session.authStatus === AUTH_STATUS.authenticated;
});

const groupID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id;
});

const groupName = computed<string>(() => {
    if (!club.value?.name) return 'Olympsis Group';
    return club.value.name;
});

const groupAbout = computed<string>(() => {
    if (!club.value?.description) return 'Unknown';
    return club.value.description;
});

const groupLogoURL = computed<string | undefined>(() => {
    return club.value?.logo;
});

const groupBannerURL = computed<string | undefined>(() => {
    return club.value?.banner;
});

const groupLocation = computed<string>(() => {
    if (!club.value) return 'Unknown, Unknown';
    const subAdmin = club.value.city;
    const adminArea = club.value.state;
    return `${subAdmin}, ${adminArea}`;
});

const groupHistory = computed<string>(() => {
    if (!club.value?.createdAt) return 'Unknown';
    return 'Created ' + formatRelativeTime(club.value.createdAt);
});

const groupMembers = computed<Member[]>(() => {
    if (!club.value?.members) return [];
    return club.value.members;
});

const groupMembersString = computed<string>(() => {
    if (!club.value?.members) return 'Unknown';
    return club.value.members.length > 1 ? `${club.value.members.length} members` : `${club.value.members.length} member`;
});

function handleGroupSharing() {
    navigator.clipboard.writeText(window.location.href);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this event', life: 3000 });
}

function apply() {
    if (viewState.value === VIEW_STATE.LOADING) return;
    if (actionState.value === VIEW_STATE.LOADING) return;
    actionState.value = VIEW_STATE.LOADING;

    service.applyToClub('')
        .then((hasApplied: boolean) => {
            if (hasApplied) {
                actionState.value = VIEW_STATE.SUCCESS;
            } else {
                actionState.value = VIEW_STATE.FAILURE;
            }
        })
        .catch(() => {
            actionState.value = VIEW_STATE.FAILURE;
        });
}

async function getClub(id: string) {
    try {
        club.value =  await modelStore.getClubByID(id)
        viewState.value = VIEW_STATE.SUCCESS;

        const config = useRuntimeConfig();
        useHead({
            htmlAttrs: {
                lang: "en"
            },
        });
        useSeoMeta({
            title: () => groupName.value,
            description: () => groupAbout.value,

            ogUrl: () => `https://olympsis.com/search/${groupID.value}`,
            ogTitle: () => groupName.value,
            ogImage: () => generateImageURL(groupLogoURL.value ?? ''),
            ogDescription: () => groupAbout.value,

            twitterSite: '@olympsis',
            twitterTitle: () => groupName.value,
            twitterCard: 'summary_large_image',
            twitterImage: () => generateImageURL(groupLogoURL.value ?? ''),
            twitterDescription: () => groupAbout.value,

            appleItunesApp: {
                appId: config.public.APP_ID,
                appArgument: `/search/${groupID.value}`
            }
        });
    } catch (error) {
        viewState.value = VIEW_STATE.FAILURE;
        console.error(`Failed to get club data. Error: ${error}`);
    }
}

onMounted(() => {
    getClub(groupID.value)
});
</script>

<style scoped>
#group-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    #left {
        width: 30rem;

        #header {
            margin: 1rem 0rem;

            .button {
                all: unset;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 10px;
                background-color: var(--secondary-background-color);

                &:hover {
                    transform: scale(1.1);
                }
            }

            .centered {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        #images {
            h1 {
                margin: 1rem;
                color: var(--primary-label-color);
            }
        }

        #info {
            #visibility {
                width: 100%;
                display: flex;
                margin-top: 7rem;
                align-items: center;

                div {
                    margin-left: 1rem;
                    color: var(--primary-label-color);
                }
            }

            #members {
                display: flex;
                align-items: center;
                justify-content: space-between;

                #group-members-peek {
                    min-width: 15rem;
                    margin: 1rem 0rem;
                }

                div {
                    width: fit-content;
                    color: var(--primary-label-color);
                }
            }
        }
    }

    #right {
        width: 30rem;
        margin-top: 1rem;
        margin-left: 1.5rem;

        .section {
            margin: 1rem 0rem;

            h2 {
                color: var(--primary-label-color);
            }

            p {
                margin: 0.5rem;
                color: gray;
            }
        }

        #location {

            #map-view {
                height: 10rem;
                display: flex;
                align-items: center;
                border-radius: 10px;
                justify-content: center;
                color: var(--olympsis-gray);
                background-color: var(--secondary-background-color);
            }
        }
    }
}

@media (max-width: 1040px) {
    #group-detail {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: unset;
    }
}
</style>