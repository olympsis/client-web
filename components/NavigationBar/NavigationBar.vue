<template>
    <header id="navigation-bar">
        <!-- TODO:// remove after app launch — revert to /home -->
        <NuxtLink :to="isAuthenticated ? '/events' : '/landing-page'" id="logo">
            Olympsis
        </NuxtLink>
       
        <div class="routes">
            <NavigationButton to="/events" :text="$t('nav.events')" icon="--events-icon" variant="light"/>

            <!-- Auth-dependent buttons rendered client-side only to avoid SSR hydration mismatch -->
            <ClientOnly>
                <NuxtLink v-if="isAuthenticated" id="web-profile" to="/profile" class="profile">
                    <ProfileButton :imageURL="userImageURL"/>
                </NuxtLink>
                <NavigationButton v-else class="signin" to="/signin" :text="$t('auth.signIn')" variant="dark"/>

                <!-- Placeholder matching button size so the navbar doesn't shift during hydration -->
                <template #fallback>
                    <div class="nav-placeholder" />
                </template>
            </ClientOnly>
        </div>
    </header>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { generateImageURL } from '~/utils/image-helpers';
import { useSessionStore } from '~/stores/session-store';

import ProfileButton from '~/components/ProfileButton/ProfileButton.vue';
import NavigationButton from '../Buttons/NavigationButton/NavigationButton.vue';

const isOpen = ref(false);
const session = useSessionStore();

const { isAuthenticated } = useAuth()

const userImageURL = computed(() => {
    return session.user?.imageURL ? generateImageURL(session.user.imageURL) : undefined;
});


function toggleMenu() {
    isOpen.value = !isOpen.value;
}

function hideMenu() {
    isOpen.value = false;
}

</script>

<style scoped>
#navigation-bar {
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    width: 100vw;
    display: flex;
    max-height: 60px;
    min-height: 60px;
    position: sticky;
    align-items: center;
    position: -webkit-sticky;
    justify-content: space-between;
    border-bottom: solid 1px var(--navigation-border);
    background-color: var(--primary-brand-color);

    #logo {
        color: white;
        font-weight: 900;
        font-size: 1.7rem;
        margin-left: 2rem;
        font-style: normal;
        text-align: center;
        font-style: italic;
        font-family: 'Archivo', 'Helvetica Nue', 'Arial';
    }

    .routes {
        display: flex;
        margin-right: 2rem;
        align-items: center;
    }

    .profile {
        margin-left: 1rem;
        align-items: center;
        justify-content: center;
    }

    .signin {
        color: black;
        margin-left: 1rem;
        background-color: white;
    }

    /* Keeps navbar from shifting while client resolves auth state */
    .nav-placeholder {
        width: 80px;
        height: 36px;
        margin-left: 1rem;
    }

    @media (max-width: 820px) {
        #logo {
            margin-left: 1rem;
        }

        .routes {
            margin-right: 1rem;
        }
    }
}
</style>