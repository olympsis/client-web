<template>
    <div id="event-header">
        <!-- Event Title -->
        <h1 id="title">{{ event.title }}</h1>
        
        <!-- Venues Information -->
        <div id="venues" class="section">
            <picture class="icon">
                <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/pin-drop/pin.drop.svg">
            </picture>

            <div class="info">
                <div class="header">{{ venues[0].name }}</div>
                <div class="sub-header">{{ venues[0].city + ", " + venues[0].state }}</div>
            </div>
        </div>

        <!-- Event Date Info -->
        <div id="datetime" class="section">
            <picture class="icon">
                <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/calendar/calendar.month.svg">
            </picture>

            <div class="info">
                <div class="header">{{  event.timeToString() }}</div>
                <div class="sub-header">{{ event.startTimeToString() + " - " + event.stopTimeToString() }}</div>
            </div>
        </div>

        <!-- Add Calendar Button -->
        <div id="add-calendar">
            <picture :style="{ width: '24px', height: '24px', margin: '0rem 0.5rem' }">
                <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/calendar/calendar.month.svg">
            </picture>

            <div>Add to Calendar</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';

/**
 * The event is static data and so are the venues because the page that this component is going into 
 * will be rendered server-side. So the data should be loaded in by the time it gets to be rendered.
 */
defineProps({
    event: { type: Event, required: true },
    venues: { type: Array<Venue>, required: true }
});
</script>

<style scoped>
#event-header {
    grid-area: header;
    
    .section {
        display: flex;
        margin: 1rem 0rem;
        align-items: center;

        .icon {
            width: 42px;
            height: 42px;

            img {
                padding: 0.5rem;
                border-radius: 10px;
                border: var(--icon-border-color) solid 1px;
                background-color: var(--secondary-background-color);
            }
        }

        .info {
            margin-left: 1rem;

            .header {
                font-weight: 600;
            }

            .sub-header {
                font-size: 0.9rem;
            }
        }
    }

    #add-calendar {
        display: flex;
        cursor: pointer;
        width: fit-content;
        align-items: center;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        background-color: var(--secondary-background-color);
    }
}
</style>