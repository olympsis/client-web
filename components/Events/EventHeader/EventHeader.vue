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

            <div v-if="!hideLocation" class="info">
                <div class="header">{{ venueName }}</div>
                <div class="sub-header">{{ venueLocation }}</div>
            </div>
            <div v-if="hideLocation" class="info-hidden">
                <div class="header"></div>
                <div class="sub-header"></div>
            </div>
        </div>

        <!-- Event Date Info -->
        <div id="datetime" class="section">
            <picture class="icon">
                <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/calendar/calendar.month.svg">
            </picture>

            <div class="info">
                <div class="header">{{  dateToString(event.startTime) }}</div>
                <div class="sub-header">{{ timeToString(event.startTime) + " - " + timeToString(event.stopTime) }}</div>
            </div>
        </div>

        <!-- Add Calendar Button -->
        <div id="add-calendar" @click="downloadEventAsCalendar">
            <picture :style="{ width: '24px', height: '24px', 'margin-right': '0.5rem' }">
                <source srcset="@/assets/icons/calendar/calendar.month.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/calendar/calendar.month.svg">
            </picture>

            <div>{{ t('events.detail.addToCalendar') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GROUP_ROLE } from '~/data/Enums';
import { generateCalendarFile } from '#imports';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';

const { t } = useI18n();
const session = useSessionStore();

/**
 * The event is static data and so are the venues because the page that this component is going into 
 * will be rendered server-side. So the data should be loaded in by the time it gets to be rendered.
 */
const props = defineProps({
    event: { type: Event, required: true },
    venues: { type: Array<Venue>, required: true }
});

const isAdmin = computed<boolean>(() => {
    const adminGroups = session.groups.filter((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return group.members?.find((m) => m.user?.userId === session.user?.userId && m.role !== GROUP_ROLE.MEMBER);
    });
    return adminGroups.find((g) => {
        const group = g.club ?? g.organization;
        if (!group) return false;
        return props.event.organizers.find((o) => o.id === group.id);
    }) != undefined;
});

const venueName = computed<string>(() => {
    const firstVenue = props.event.venues.at(0);
    if (firstVenue && !firstVenue.id) {
        return firstVenue.name ?? t('events.detail.customLocation');
    } else {
        return props.venues.at(0)?.name ?? t('events.detail.customLocation');
    }
});

const venueLocation = computed<string>(() => {
    const firstVenue = props.event.venues.at(0);
    if (firstVenue && !firstVenue.id) {
        if (!firstVenue.city && !firstVenue.state) return t('events.detail.customCoordinates');
        return `${firstVenue.city}, ${firstVenue.state}`;
    } else {
        const firstVenue = props.venues.at(0);
        if (!firstVenue) return t('events.detail.unknownLocation');
        return `${firstVenue.city}, ${firstVenue.state}`;
    }
});

const hideLocation = computed<boolean>(() => {
    // If user is an admin or an event participant show location
    if (isAdmin.value || props.event.participants.find((p) => p.user?.userId === session.user?.userId)) return false;
    return props.event.config?.hideLocation ?? false;
});

/**
 * Downloads an event as an iCalendar (.ics) file
 * @param event The event to download as a calendar file
 */
 function downloadEventAsCalendar(): void {
    const data = generateCalendarFile(props.event, props.venues);
    const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(data);
    window.open(dataUrl);
}
</script>

<style scoped>
#event-header {
    grid-area: header;
    
    .section {
        display: flex;
        margin: 1rem 0rem;
        align-items: center;

        .icon {
            display: flex;
            padding: 0.25rem 0.60rem;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            border: var(--component-border-color) solid 1px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.12);
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

        .info-hidden {
            margin-left: 1rem;

            .header {
                height: 15px;
                width: 10rem;
                margin-bottom: 0.25rem;
                background-color: var(--olympsis-gray);
            }

            .sub-header {
                height: 15px;
                width: 5rem;
                background-color: var(--olympsis-gray);
            }
        }
    }

    #add-calendar {
        display: flex;
        cursor: pointer;
        width: fit-content;
        align-items: center;
        border-radius: 20px;
        padding: 0.25rem 1rem;
        border: rgba(255, 255, 255, 0.15) solid 1px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }
}
</style>