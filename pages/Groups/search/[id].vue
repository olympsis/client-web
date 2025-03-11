<template>
    <NavigationBar/>
    <main id="group-detail">
        <div id="sub-nav">
            <button class="button" @click="handleBackNavigation">
                <picture class="centered">
                    <source srcset="@/assets/icons/chevron/chevron.left.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/chevron/chevron.left.svg"/>
                </picture>
            </button>
        </div>

        <GroupLogoAndBanner :logo-u-r-l="groupLogoURL" :banner-u-r-l="groupBannerURL" :sports="club?.sports" class="media" @clicked-share="handleGroupSharing"/>

        <div id="header">
            <h1>{{ club?.name }}</h1>
            <div id="description">{{ club?.description }}</div>
        </div>

        <div id="sub-header">
             <div class="section">
                <div id="members">
                    <GroupMembersPeek :members="groupMembers"/>
                    <div :style="{ width: '100%', fontWeight: 'bold', marginLeft: '1rem' }">{{ groupMembersString }}</div>
                </div>
                <TextButton v-if="!isMember" text="Request to Join" success-text="Requested" failure-text="Failed" v-model="buttonState" @click="apply" class="action"/>
             </div>
             <div class="section">
                <div id="info" :style="{ display: 'flex', gap: '1rem', margin: '1rem 0rem' }">
                    <div id="foundation">
                        <picture class="icon">
                            <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/calendar/calendar.month.svg">
                        </picture>

                        <div :style="{ marginLeft: '0.5rem' }">{{ `Created ${getMonthAndYear(club?.createdAt ?? 0)}` }}</div>
                    </div>

                    <div id="visibility">
                        <picture class="icon">
                            <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                            <img src="@/assets/icons/globe/globe.svg">
                        </picture>
                        <div :style="{ textTransform: 'capitalize', marginLeft: '0.5rem' }">{{ `${groupVisibility} Community` }}</div>
                    </div>
                </div>
             </div>
        </div>


        <GroupFeed v-if="club" :group="club"/>

        <GroupSmallSection v-if="club" :group="club" class="small-section"/>

        <!-- Auth Modal -->
        <dialog id="auth-modal" ref="auth-modal" class="dialog">
            <AuthModal class="auth-card" @cancel="hideAuthModal" @user-authenticated="handleNewUserAuthentication"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { useToast } from 'primevue/usetoast';
import { Club } from '@/data/models/ClubModels';
import { useRoute, useRouter } from 'vue-router';
import { Member } from '@/data/models/GenericModels';
import { AUTH_STATUS, VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';
import { ClubService } from '@/data/services/ClubService';
import { SnapshotService } from '~/data/services/SnapshotService';
import { formatRelativeTime, getMonthAndYear } from '~/utils/time-helpers';

import AuthModal from '~/components/Auth/AuthModal/AuthModal.vue';
import GroupFeed from '~/components/Groups/GroupFeed/GroupFeed.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import TextButton from '~/components/Buttons/LoadingButtons/TextButton/TextButton.vue';
import GroupMembersPeek from '@/components/Groups/GroupMembersPeek/GroupMembersPeek.vue';
import GroupSmallSection from '~/components/Groups/GroupSmallSection/GroupSmallSection.vue';
import GroupLogoAndBanner from '@/components/Groups/GroupLogoAndBanner/GroupLogoAndBanner.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const service = new ClubService();
const modelStore = useModelStore();
const buttonState = ref(VIEW_STATE.PENDING);

const club = ref<Club | undefined>(undefined);
const mapURL = ref<string | undefined> (undefined);

const mapState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const viewState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const actionState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const authModal = useTemplateRef<HTMLDialogElement>('auth-modal');

/**
 * COMPUTED VARIABLES
 */

const isAuthenticated = computed<boolean>(() => {
    return session.authStatus === AUTH_STATUS.authenticated;
});

const mapStateString = computed<string>(() => {
    switch (mapState.value) {
        case VIEW_STATE.FAILURE:
            return 'Failed to load map';
        default:
            return 'Loading Map..';
        }
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

const groupVisibility = computed<string>(() => {
    return club.value?.visibility ?? 'public';
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

const isMember = computed<Boolean>(() => {
    const uuid = session.user?.uuid;
    if (!uuid) return false;

    return groupMembers.value.find((m) => m.user?.uuid === uuid) !== undefined;
})

/**
 * FUNCTIONS
 */

function showAuthModal() {
    if (authModal.value) {
        authModal.value.show()
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function hideAuthModal() {
    if (authModal.value) {
        authModal.value.close()
    } else {
        console.error('Failed to find reference to Auth Modal');
    }
}

function handleGroupSharing() {
    navigator.clipboard.writeText(window.location.href);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this group!', life: 3000 });
}

function apply() {
    if (!isAuthenticated.value) {
        showAuthModal();
        return;
    }

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

function handleBackNavigation(){
    router.push('/groups/search');
}

function handleNewUserAuthentication() {
    session.checkAuthorizationStatus();
    hideAuthModal();
}

async function getClub(id: string) {
    const _club = await service.getClub(id);
    if (!_club) return;
    return _club.encode();
}

const config = useRuntimeConfig();
useSeoMeta({
    title: () => groupName.value,
    description: () => groupAbout.value,

    ogType: 'website',
    ogLocale: 'en_US',
    ogSiteName: 'Olympsis',
    ogUrl: () => `https://olympsis.com/groups/search/${groupID.value}`,
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

const { data } = await useAsyncData(
    `groups/search/${groupID.value}`,
    () => getClub(groupID.value),
    {
        server: true,
        lazy: false,
        immediate: true,
    }
);


watchEffect(() => {
    if (!data.value) return;
    club.value = Club.decode(data.value);

    if (club.value) {
        modelStore.setClub(club.value);
    }
});

onMounted(() => {
    if (mapURL.value) return;
    const city = club.value?.city ?? '';
    const state = club.value?.state ?? '';
    const country = club.value?.country ?? '';

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

#group-detail {
    width: 100%;
    display: grid;
    margin-top: 1rem;
    grid-template-areas:
    'nav nav'
    'banner banner'
    'header header'
    'sub-header sub-header'
    'feed location'
    'feed location'
    ;
    justify-content: center;
    grid-template-rows: 44px;
}

#sub-nav {
    width: 24px;
    height: 24px;
    grid-area: nav;
    margin-left: 1rem;
}

.media {
    margin-top: 1rem;
    max-width: 58rem;
    grid-area: media;
}

#header {
    width: 100%;
    padding: 1rem;
    max-width: 58rem;
    grid-area: header;

    h1 {
        margin-bottom: 0.5rem;
    }
}

#sub-header {
    width: 100%;
    padding: 1rem;
    max-width: 58rem;
    grid-area: sub-header;
}

.section {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;

    justify-content: space-between;
}

#members {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#foundation {
    opacity: 0.7;
    display: flex;
    align-items: center;
}

#visibility {
    opacity: 0.7;
    display: flex;
    align-items: center;
}

.action {
    cursor: pointer;
     max-width: 10rem;
}

.centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

@media(max-width: 940px) {
    #group-detail {
        grid-template-areas:
        'nav nav'
        'banner banner'
        'header header'
        'sub-header sub-header'
        'feed feed'
        'feed feed'
        ;
    }
    .small-section {
        display: none;
    }

    .p-tabpanels {
        padding: unset;
    }
}

#auth-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    .auth-card {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}
</style>