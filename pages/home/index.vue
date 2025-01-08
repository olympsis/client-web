<template>
    <NavigationBar/>
    <main id="home-view">
        <div id="header">
            <h1>Olympsis</h1>

            <div id="trailing">
                <button @click="">
                    <img class="notifications" src="@/assets/icons/bell/bell.white.svg"/>
                </button>
            </div>
        </div>
        <WelcomeCard :name="name" :state="state" class="welcome-card"/>
        <FieldListPeek :venues="venues" :state="state" class="fields"/>
        <NavigationCard :state="state" class="nav-card" />
        <AnnouncementsGallery class="announcements"/>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { VIEW_STATE } from '@/data/Enums';
import { Venue } from '@/data/models/VenueModels';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';

import WelcomeCard from '@/components/Home/WelcomeCard/WelcomeCard.vue';
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import NavigationCard from '@/components/NavigationCard/NavigationCard.vue';
import FieldListPeek from '@/components/Venues/VenueListPeek/VenueListPeek.vue';
import AnnouncementsGallery from '@/components/Home/AnnouncementsGallery/AnnouncementsGallery.vue';


const router = useRouter();
const modelStore = useModelStore();
const sessionStore = useSessionStore();

const state = computed<VIEW_STATE>(() => {
    return sessionStore.loadingState;
});

const venues = computed<Venue[]>(() => {
    // NOTE - I am not not using the model store here because we need to reactively update this when we do get the venues.
    return sessionStore.venues;
});

const name = computed<string>(() => {
    const user = sessionStore.user;
    if (user) {
        return ` ${user.firstName}`
    }
    return ''
})

useSeoMeta({
    title: 'Olympsis',
    ogTitle: 'Olympsis',
    description: 'Join Olympsis to find sports events around you!',
    ogDescription: 'Join Olympsis to find sports events around you!'
});

</script>

<style scoped>

#home-view {
    gap: 2rem;
    display: grid;
    margin: 0 auto;
    padding: 1rem 3rem;
    height: calc(100vh-60px);
    grid-template-areas:
        'header header header'
        'welcome main main'
        'fields main main'
        'footer main main';
    grid-template-columns: 25rem auto auto;

    #header {
        display: flex;
        margin: 0rem 1rem;
        grid-area: header;
        align-items: center;
        justify-content: space-between;

        h1 {
            font-weight: 900;
            font-style: italic;
            color: var(--primary-label-color);
        }

        /* #trailing {
            width: 7rem;
            height: 3rem;
            display: flex;
            align-items: center;
            border-radius: 10px;
            justify-content: space-around;
            background-color: var(--primary-brand-color);
        } */

        #trailing {
            border-radius: 15px;
            padding: 0.5rem 0.5rem 0.25rem 0.5rem;
            background-color: var(--primary-brand-color);

            button {
                all: unset;
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                margin: 0rem 0.5rem;

                img {
                    width: 2rem;
                    height: 2rem;
                    align-self: center;
                }
            }
        }
    }

    .welcome-card {
        grid-area: welcome;
    }

    .fields {
        grid-area: fields
    }

    .nav-card {
        grid-area: footer;
    }

    .announcements {
        grid-area: main;
    }

    .chats {
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        margin-top: 0.25rem;
    }

    .notifications {
        width: 2rem;
        height: 2rem;
        cursor: pointer;
    }
}

@media (max-width: 1280px) {
    .grid-container {
        grid-template-areas:
        'header header'
        'welcome fields'
        'footer fields'
        'main main'
        'main main'
        ;
        grid-template-columns: 25rem 25rem;

        .announcements {
            margin-bottom: 5rem;
        }
    }
}

@media (max-width: 940px) {
    .grid-container {
        grid-template-areas:
        'header'
        'welcome'
        'main'
        'fields'
        'footer';
        max-width: 33rem;
        padding: 1rem 0rem;
        grid-template-rows: unset;
        grid-template-columns: unset;


        .nav-card {
            padding-bottom: 5rem;
        }

        #navigation-card {
            margin: 0rem 1rem;
        }

        .announcements {
            margin-bottom: unset;
        }
    }
}
</style>