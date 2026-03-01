<template>
    <main id="home-view">
        <!-- Welcome -->
        <WelcomeCard :name="name" :state="state"/>

        <!-- Quick Actions -->
        <QuickActions class="quick-actions"/>

        <!-- Quote -->
        <MotivationalQuote class="motivational-quote"/>
        
        <!-- Announcements Gallery -->
        <AnnouncementsGallery class="announcements"/>

        <!-- Next Events -->
        <EventsSection 
            v-if="events.length != 0 || state == VIEW_STATE.LOADING" 
            :state="state" 
            :events="events"
        />

        <!-- Nearby Venues List -->
        <NearbyVenues 
            v-if="venues.length != 0 || state == VIEW_STATE.LOADING" 
            class="nearby-venues" 
            :state="state" 
            :venues="venues"
        />
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VIEW_STATE } from '@/data/Enums';
import { Event } from '~/data/models/EventModels';
import { Venue } from '@/data/models/VenueModels';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';

import QuickActions from '~/components/QuickActions/QuickActions.vue';
import WelcomeCard from '@/components/Home/WelcomeCard/WelcomeCard.vue';
import NearbyVenues from '~/components/Venues/NearbyVenues/NearbyVenues.vue';
import EventsSection from '~/components/Events/EventsSection/EventsSection.vue';
import MotivationalQuote from '~/components/MotivationalQuote/MotivationalQuote.vue';
import AnnouncementsGallery from '@/components/Home/AnnouncementsGallery/AnnouncementsGallery.vue';

const router = useRouter();
const modelStore = useModelStore();
const sessionStore = useSessionStore();

const state = computed<VIEW_STATE>(() => {
    return sessionStore.locationState;
});

const events = computed<Event[]>(() => {
    const uuid = sessionStore.user?.uuid ?? '';
    return sessionStore.events.userNextEvents(uuid) ?? [];
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
    return '';
});

// Request location and load nearby venues/events when user visits the home page
onMounted(async () => {
    await sessionStore.loadVenuesAndEvents();
});

useSeoMeta({
    title: 'Olympsis',
    ogTitle: 'Olympsis',
    description: 'Join Olympsis to find sports events around you!',
    ogDescription: 'Join Olympsis to find sports events around you!'
});
</script>

<style scoped>
#home-view {
    gap: 0;
    display: grid;
    margin: 0 auto;
    padding: 1rem 3rem;
    height: calc(100vh-60px);
    grid-template-areas:
        'welcome welcome'
        'actions quote'
        'main main'
        'next next'
        'venues venues'
        'events events';
    grid-template-columns: 25rem 28rem;
    grid-template-rows: 3rem auto 38rem auto auto auto;

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

    .motivational-quote {
        grid-area: quote;
    }

    .quick-actions {
        grid-area: actions;
    }

    .announcements {
        height: 100%;
    }

    .nearby-venues {
        grid-area: venues;
    }
}

@media (max-width: 970px) {
    #home-view {
        grid-template-areas:
        'quote'
        'welcome'
        'actions'
        'main'
        'next'
        'venues'
        'events';
        width: 100vw;
        padding: 1rem 0rem;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto 35rem auto auto;
    }
}
</style>