<template>
    <NavigationBar/>
    <main class="grid-container">
        <div class="info">
            <UserIcon :user="user" :size="10" class="icon"/>
            <button class="action" @click="showEditModal">Edit Profile</button>
        </div>
        <NavigationCard class="nav-card" :state="state"/>
        <div class="badges">
            <h2>Badges</h2>
            <div class="holder">

            </div>
        </div>
        <div class="trophies">
            <h2>Trophies</h2>
            <div class="holder">
                
            </div>
        </div>
        <div class="actions">
            <h2>Settings</h2>
            <button class="item"> Report an Issue </button>
            <RouterLink to="/terms-of-use" class="item"> Terms of Service </RouterLink>
            <RouterLink to="/privacy-policy" class="item"> Privacy Policy </RouterLink>
            <button class="destructive-item" @click="handleLogout"> Log Out </button>
            <button class="destructive-item" @click="handleDelete"> Delete Account </button>
        </div>

        <dialog id="edit-profile-modal" ref="edit-profile-modal" class="dialog">
            <EditProfileView @close="hideEditModal"/>
        </dialog>
    </main>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { useSessionStore } from '@/stores/session-store';

import UserIcon from '@/components/UserIcon/UserIcon.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import NavigationCard from '@/components/NavigationCard/NavigationCard.vue';
import EditProfileView from '~/components/Modals/Profile/EditProfile/EditProfileView.vue';

const sessionStore = useSessionStore();
const editProfileModal = useTemplateRef<HTMLDialogElement>('edit-profile-modal');

const user = computed(() => {
    return sessionStore.user;
})

const state = computed<VIEW_STATE>(() => {
    return VIEW_STATE.SUCCESS;
});

function handleLogout() {
    sessionStore.logout()
        .then (() => {
            console.log('Logged Out User');
        });
}

function handleDelete() {
    sessionStore.deleteAccount();
}

function showEditModal() {
    editProfileModal.value?.show();
}

function hideEditModal() {
    editProfileModal.value?.close();
}

useSeoMeta({
    title: () => 'Profile | Olympsis',
    ogTitle: () => 'Profile | Olympsis',
    description: 'Join groups around the sports you love!',
    ogDescription: 'Join groups around the sports you love'
});

</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-areas:
    'info badges settings'
    '... badges settings'
    'footer trophies settings'
    ;
    gap: 2rem;
    margin: 0 auto;
    padding-top: 4rem;
    padding-left: 3rem;
    padding-right: 3rem;

   .info {
        display: flex;
        flex-direction: column;
        grid-area: info;
        .icon {
            margin: 0rem auto;
            width: fit-content;
        }

        .action {
            margin: 2rem auto;
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

@media (max-width: 1600px) {
    .grid-container {
        display: grid;
        grid-template-areas:
        'info badges'
        'settings badges'
        'settings trophies'
        'footer trophies'
        ;
        gap: 2rem;
        margin: 0 auto;
        padding-top: 4rem;
        padding-left: 3rem;
        padding-right: 3rem;
        grid-template-columns: 25rem auto;
    }

    .actions {
        h2 {
            display: none;
        }
    }
}
/* @media (max-width: 1180px) { */
@media (max-width: 900px) {
    .grid-container {
        gap: unset;
        display: grid;
        grid-template-areas:
        'info'
        'badges'
        'trophies'
        'settings'
        'footer'
        ;
        padding-left: unset;
        padding-right: unset;

        .badges {
            .holder {
                width: 25rem;
                height: 10rem;
            }
        }

        .trophies {
            .holder {
                width: 25rem;
                height: 10rem;
            }
        }

        .nav-card {
            padding-bottom: 3rem;
        }
    }
}

@media (max-width: 430px) { 
    .grid-container {
        .badges {
            .holder {
                width: 22rem;
                height: 10rem;
            }
        }

        .trophies {
            .holder {
                width: 22rem;
                height: 10rem;
            }
        }

        .actions {
            .item {
                width: 22rem;
                height: 2.5rem;
            }

            .destructive-item {
                width: 22rem;
                height: 2.5rem;
            }

            margin-bottom: 2rem;
        }

        #navigation-card{
            margin: unset;
            padding-bottom: 3rem;
        }
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
</style>