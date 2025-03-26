<template>
    <NavigationBar/>
    <main id="profile-page">
        <div id="top">
            <button @click="profileSettingsModal?.show()">
                <picture class="centered">
                    <source srcset="@/assets/icons/gear/gear.white.svg" media="(prefers-color-scheme: dark)">
                    <img class="settings-icon" src="@/assets/icons/gear/gear.svg"/>
                </picture>
            </button>
        </div>
        <div class="header">
            <div id="image">
                <UserIcon :user="user" :size="8" class="icon"/>
                <button class="action" @click="showEditModal">Edit Profile</button>
            </div>
            <div id="info">
                <div id="name">
                    <h1>{{ user?.firstName + " " + user?.lastName }}</h1>
                    <h2>{{ "@" + user?.username }}</h2>
                </div>
                <div id="body">{{ user?.bio }}</div>
            </div>
        </div>

        <div id="body">
            <Tabs value="0" scrollable>
                <TabList
                :pt="{ 
                    activeBar: { 
                        style: { 
                            backgroundColor: 'var(--primary-brand-color)', height: '2.5px' 
                        } 
                    } 
                    }">
                    <Tab value="0" class="font">Achievements</Tab>
                    <Tab value="1" class="font">Groups Enrolled</Tab>
                    <Tab value="2" class="font">Events Attended</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <AwardsTab />
                    </TabPanel>
                    <TabPanel value="1">
                        <GroupsTab :clubs="userClubs" :organizations="[]"/>
                    </TabPanel>
                    <TabPanel value="2">
                        <EventsTab :events="session.pastEvents"/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>

        <!-- Edit Profile -->
        <dialog id="edit-profile-modal" ref="edit-profile-modal" class="dialog">
            <EditProfileView @close="hideEditModal"/>
        </dialog>

        <!-- Profile Settings -->
         <dialog id="profile-settings-modal" ref="profile-settings-modal" class="dialog">
            <ProfileSettings 
                @close="profileSettingsModal?.close()"
                @report=""
                @logout="handleLogout"
                @delete="handleDelete"
            />
         </dialog>
    </main>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { Club } from '~/data/models/ClubModels';
import { Event } from '~/data/models/EventModels';
import { useSessionStore } from '@/stores/session-store';
import { EventService } from '~/data/services/EventService';

import Tab from 'primevue/tab';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import UserIcon from '@/components/UserIcon/UserIcon.vue';
import AwardsTab from '~/components/Profile/AwardsTab/AwardsTab.vue';
import GroupsTab from '~/components/Profile/GroupsTab/GroupsTab.vue';
import EventsTab from '~/components/Profile/EventsTab/EventsTab.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import ProfileSettings from '~/components/Profile/ProfileSettings/ProfileSettings.vue';
import EditProfileView from '~/components/Modals/Profile/EditProfile/EditProfileView.vue';

const session = useSessionStore();
const eventService = new EventService();
const editProfileModal = useTemplateRef<HTMLDialogElement>('edit-profile-modal');
const profileSettingsModal = useTemplateRef<HTMLDialogElement>('profile-settings-modal');

const user = computed(() => {
    return session.user;
});

const userClubs = computed<Array<Club>>(() => {
    let _clubs: Array<Club> = [];
    session.groups.forEach((g) => {
        if (g.club) { _clubs.push(g.club); }
    });

    return _clubs;
});

function handleLogout() {
    session.logout()
        .then (() => {
            console.log('Logged Out User');
        });
}

function handleDelete() {
    session.deleteAccount();
}

function showEditModal() {
    editProfileModal.value?.show();
}

function hideEditModal() {
    editProfileModal.value?.close();
}

async function fetchPastEvents() {
    let _events: Event[];
    const sports = session.user?.sports.join(',') ?? 'all'
    const location = session.lastKnownLocation;

    if (!location) throw('Failed to get location. IMPLEMENT BETTER FALLBACK');

    _events = await eventService.getEvents(
        location.latitude, 
        location.longitude, 
        64373, // Radius of lookup
        sports, // Sports involved
        'completed',
        0,
        100
    );

    session.pastEvents = _events.filter((e) => e.participants.find((u) => u.user?.uuid == user.value?.uuid));
}

useSeoMeta({
    title: () => 'Profile | Olympsis',
    ogTitle: () => 'Profile | Olympsis',
    description: 'Join groups built around the sports you love!',
    ogDescription: 'Join groups built around the sports you love'
});

onMounted(() => {
    fetchPastEvents();
});

</script>

<style scoped>
.font {
    font-size: 0.9rem;
    font-weight: normal;
}
.p-tab-active {
    font-weight: 500;
    color: var(--primary-label-color);
    border-color: var(--primary-brand-color);
}
.p-tab-panels {
    background: var(--primary-background-color);
}
.p-tablist-tab-list {
    background: var(--primary-background-color);
}
#profile-page {
    width: 100%;
    display: flex;
    margin: 0 auto;
    max-width: 53rem;
    padding-top: 4rem;
    padding-left: 3rem;
    padding-right: 3rem;
    flex-direction: column;

    #top {
        width: 100%;
        display: flex;

        button {
            border: unset;
            cursor: pointer;
            margin-left: auto;
            background-color: unset;

            img {
                width: 2rem;
                height: 2rem;
            }
        }
    }

   .header {
        display: flex;
        grid-area: info;
        flex-direction: row;

        .icon {
            margin: 0rem auto;
            width: fit-content;
        }

        .action {
            height: 2rem;
            border: unset;
            cursor: pointer;
            margin: 2rem auto;
            padding: 0rem 1rem;
            border-radius: 10px;
            background-color: var(--secondary-background-color);
        }
   }


    .nav-card {
        margin-top: auto;
        margin-bottom: 1rem;

        grid-area: footer;
    }

    .badges {
        grid-area: badges;
        color: var(--primary-label-color);

        .holder {
            width: 100%;
            height: 20rem;
            min-width: 25rem;
            max-width: 40rem;
            margin: 1rem 0rem;
            border-radius: 10px;
            background-color: var(--secondary-background-color);
        }
    }

    .trophies {
        margin: 1rem 0rem;
        grid-area: trophies;
        color: var(--primary-label-color);
        .holder {
            width: 100%;
            height: 20rem;
            min-width: 25rem;
            max-width: 40rem;
            margin: 1rem 0rem;
            border-radius: 10px;
            background-color: var(--secondary-background-color);
        }
    }

    .actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        grid-area: settings;

        h2 {
            margin-bottom: 1rem;
            align-self: flex-start;
            color: var(--primary-label-color);
        }
        .item {
            width: 25rem;
            height: 3rem;
            border: unset;
            display: flex;
            cursor: pointer;
            font-size: 1rem;
            color: var(--primary-label-color);
            align-self: center;
            margin: 0.5rem 0rem;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            background-color: var(--secondary-background-color);
        }

        .destructive-item {
            width: 25rem;
            height: 3rem;
            cursor: pointer;
            border: unset;
            color: white;
            font-size: 1rem;
            margin: 0.5rem 0rem;
            border-radius: 10px;
            background-color: #8c1d1d;
        }
    }
}

#image {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#info {
    display: flex;
    margin-top: 1rem;
    margin-left: 1rem;
    align-items: start;
    flex-direction: column;

    #name {
        display: flex;
        margin-left: 1rem;
        flex-direction: column;
        justify-content: start;
    }

    #body {
        margin: 1rem;
    }

    h2 {
        color: gray;
        font-style: italic;
    }
}

@media (max-width: 970px) {
    #profile-page {
        padding-top: 4rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

#edit-profile-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #edit-profile-view {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}

#profile-settings-modal {
    top: 0;
    border: unset;
    background: transparent;
    backdrop-filter: blur(5px);

    #profile-settings {
        border-radius: 20px;
        max-width: 25rem !important;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
}
</style>