<template>
    <li id="event-list-item" @click="$emit('selected', { event: event })">
        <!-- Event Image -->
        <div id="header">
            <img class="image" :src="image">
            <LabelsList :tags="tags" :limit="2"/>
        </div>

        <!-- Bottom Bar (Event Details) -->
        <div id="details" class="glass">
            <div id="title"> {{ event.title }} </div>

            <!-- Bottom row: info left, meta right -->
            <div id="detail-row">
                <div id="detail-left">
                    <div id="location">
                        <picture :style="{ height: '1rem', width: '1rem', marginRight: '0.25rem' }">
                            <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                            <img class="location-pin" src="@/assets/icons/pin-drop/pin.drop.svg">
                        </picture>
                        <div id="location-name">{{ venueName }}</div>
                    </div>
                    <div id="start-date">
                        <picture :style="{ height: '1rem', width: '1rem', marginRight: '0.25rem' }">
                            <source srcset="@/assets/icons/calendar/calendar.white.svg" media="(prefers-color-scheme: dark)">
                            <img class="calendar" src="@/assets/icons/calendar/calendar.svg">
                        </picture>
                        <div id="date">
                            {{ showFullTime ? eventDateDisplay : timeToString(event.startTime) }}
                        </div>
                    </div>
                </div>

                <div id="detail-right">
                    <div id="status" :class="statusClass">
                        <span class="status-dot"></span>
                        {{ statusString }}
                    </div>
                    <div id="participants" :style="{ visibility: event.participants.length > 0 ? 'visible' : 'hidden' }">
                        <picture>
                            <source srcset="@/assets/icons/group/group.white.svg" media="(prefers-color-scheme: dark)">
                            <img class="location-pin" src="@/assets/icons/group/group.svg">
                        </picture>
                        <div id="count">{{ event.participants.length }}</div>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { Venue } from '~/data/models/VenueModels';
import { Event } from '~/data/models/EventModels';
import { EVENT_STATE, VIEW_STATE } from '~/data/Enums';
import { generateImageURL } from '~/utils/image-helpers';

import LabelsList from '../../LabelsList/LabelsList.vue';

const { t } = useI18n();
const emit = defineEmits(
    ["selected"]
);
const props = defineProps({
    event: { type: Event, required: true },
    showFullTime: { type: Boolean, default: false }
});

const state = ref(VIEW_STATE.LOADING);
const image = computed(() => {
    return props.event.mediaURL ? generateImageURL(props.event.mediaURL) : undefined;
});

/**
 * When showFullTime is used:
 * - Within the current week: show the time (e.g. "3:30 PM")
 * - Outside the current week: show the full date (e.g. "Mar 15, 2026")
 */
const eventDateDisplay = computed(() => {
    const startTime = props.event.startTime;
    if (isThisWeek(startTime, new Date())) {
        return timeToString(startTime);
    }
    return dateToString(startTime);
});

const venues: Ref<Venue[]> = ref([]);
const venueName: ComputedRef<string> = computed(() => {
    const venuesLength = props.event.venues.length;
    if (venuesLength == 1) {
        return (venues.value[0]?.name ?? props.event.venues[0]?.name) ?? t('events.unknownVenue');
    } else if (venuesLength > 1) {
        return `${venues.value[0]?.name} ${t('events.andMore', { count: venues.value.length-1 })}`
    } else {
        return t('events.unknownVenue');
    }
});

const tags = computed<string[]>(() => {
    var labels: string[] = [];
    if (props.event.isFull()) {
        labels.push(t('events.full'));
    }
    if (props.event.isCompetition()) {
        labels.push(t('events.tournament'));
    }

    return [...labels, ...props.event.sports, ...props.event.tags];
});

const status = ref<EVENT_STATE>(EVENT_STATE.PENDING);

// Reactive elapsed time string for live events (e.g. "12:05" or "1:32")
const elapsedString = ref('');

/**
 * Formats elapsed milliseconds into a readable duration:
 * - Under 1 hour: MM:SS (e.g. "3:42")
 * - 1 hour or more: H:MM (e.g. "2:15")
 */
const formatElapsed = (elapsedMs: number): string => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const statusClass = computed<string>(() => {
    switch(status.value) {
        case EVENT_STATE.PENDING: return 'status-pending';
        case EVENT_STATE.WAITLIST: return 'status-waitlist';
        case EVENT_STATE.LIVE: return 'status-live';
        default: return 'status-ended';
    }
});

const statusString = computed<string>(() => {
    switch(status.value) {
        case EVENT_STATE.PENDING:
            return t('events.pending');
        case EVENT_STATE.WAITLIST:
            return t('events.waitlist');
        case EVENT_STATE.LIVE:
            return elapsedString.value;
        default:
            return t('events.ended');
    }
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const clearCurrentInterval = () => {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

const updateStatus = () => {
    const now = Date.now();
    const startTime = props.event.startTime.getTime();
    const endTime = props.event.stopTime.getTime();
    const prevStatus = status.value;

    if (now < startTime) {
        // Show waitlist if the event has a waitlist enabled and is at capacity
        const hasWaitlist = props.event.participantsConfig?.hasWaitlist;
        if (hasWaitlist && props.event.isFull()) {
            status.value = EVENT_STATE.WAITLIST;
        } else {
            status.value = EVENT_STATE.PENDING;
        }
    } else if (now >= startTime && now <= endTime) {
        status.value = EVENT_STATE.LIVE;
        elapsedString.value = formatElapsed(now - startTime);
    } else {
        status.value = EVENT_STATE.COMPLETED;
    }

    // When the status changes, adjust the tick interval
    if (prevStatus !== status.value) {
        clearCurrentInterval();
        if (status.value === EVENT_STATE.LIVE) {
            // Pick interval based on whether we're in hrs:min or min:sec range
            const elapsed = now - startTime;
            const tick = elapsed >= 3600000 ? 60000 : 1000;
            intervalId = setInterval(updateStatus, tick);
        } else if (status.value === EVENT_STATE.PENDING) {
            // Check again once the event should start
            intervalId = setInterval(updateStatus, 30000);
        }
        // COMPLETED: no interval needed
    } else if (status.value === EVENT_STATE.LIVE) {
        // Transition from sec ticks to min ticks once we cross the 1-hour mark
        const elapsed = now - startTime;
        if (elapsed >= 3600000 && elapsed - 1000 < 3600000) {
            clearCurrentInterval();
            intervalId = setInterval(updateStatus, 60000);
        }
    }
};

updateStatus();
// Initial interval — will be replaced by updateStatus when status changes
if (intervalId === null) {
    const now = Date.now();
    const startTime = props.event.startTime.getTime();
    const elapsed = now - startTime;

    if (status.value === EVENT_STATE.LIVE) {
        const tick = elapsed >= 3600000 ? 60000 : 1000;
        intervalId = setInterval(updateStatus, tick);
    } else if (status.value === EVENT_STATE.PENDING) {
        intervalId = setInterval(updateStatus, 30000);
    }
}

onUnmounted(() => {
    clearCurrentInterval();
});

async function loadLocationData() {
    const promises: Promise<Venue>[] = [];
    const _venues: Venue[] = [];
    const store = useModelStore();
    const eventVenues = props.event.venues;
    if (eventVenues) {
        eventVenues.forEach((v) => {
            if (v.venueId) {
                promises.push(store.getVenueByID(v.venueId));
            }
        });
    }

    const results = await Promise.allSettled(promises)
    results.forEach((v) => {
        if (v.status == 'fulfilled') {
            _venues.push(v.value);
        }
    });
    return _venues;
}
loadLocationData()
    .then((response) => {
        venues.value.push(...response);
        state.value = VIEW_STATE.SUCCESS;
    });
</script>

<style scoped>
#event-list-item {
    cursor: pointer;
    min-width: 20rem;
    max-width: 23rem;
    position: relative;
    border-radius: 10px;
    list-style-type: none;
    overflow: hidden;
    border: 1px solid var(--component-border-color);

    #header {
        #labels-list {
            top: 1rem;
            left: 1rem;
            width: 90%;
            position: absolute;
            padding-bottom: 0.5rem;
        }

        .sport {
            color: white;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            border-radius: 20px;
            text-transform: capitalize;
            background-blend-mode: hard-light;

            border-radius: 20px;
            backdrop-filter: blur(20px);
            background: rgba(0, 0, 0, 0.56);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid gray;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .image {
            width: 100%;
            height: 28rem;
            object-fit: cover;
            border-radius: 10px;
        }
    }

    #details {
        /* Overlay the details bar at the bottom of the image */
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        border-radius: 0 0 10px 10px;
        border-top: 1px solid var(--component-border-color);
        padding: 0.5rem 1rem 0.75rem 1rem;

        #title {
            font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: var(--primary-label-color);
        }

        /* Bottom row with left info and right meta side by side */
        #detail-row {
            gap: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        #detail-left {
            min-width: 0;

            #location {
                display: flex;
                max-height: 24px;
                font-size: 0.95rem;
                align-items: center;

                #location-name {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: var(--secondary-label-color);
                }

                .location-pin {
                    width: 1rem;
                    height: 1rem;
                }
            }

            #start-date {
                display: flex;
                max-height: 24px;
                font-size: 0.95rem;
                align-items: center;
                color: var(--secondary-label-color);

                .calendar {
                    width: 1rem;
                    height: 1rem;
                }
            }
        }

        #detail-right {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
            flex-shrink: 0;

            #status {
                display: flex;
                align-items: center;
                font-size: 0.9rem;
                font-weight: 500;
                max-height: 24px;
                gap: 0.35rem;

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                &.status-pending {
                    color: var(--primary-label-color);
                    .status-dot { background-color: var(--quaternary-brand-color); }
                }

                &.status-waitlist {
                    color: var(--tertiary-brand-color);
                    .status-dot { background-color: var(--tertiary-brand-color); }
                }

                &.status-live {
                    color: var(--olympsis-red);
                    .status-dot {
                        background-color: var(--olympsis-red);
                        animation: blink 1.5s ease-in-out infinite;
                    }
                }

                &.status-ended {
                    color: var(--olympsis-gray);
                    .status-dot { background-color: var(--olympsis-gray); }
                }
            }

            #participants {
                display: flex;
                max-height: 24px;
                align-items: center;
                flex-direction: row;
                justify-content: end;

                #count {
                    margin-left: 0.25rem;
                    color: var(--secondary-label-color);
                }
            }
        }
    }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
}
</style>