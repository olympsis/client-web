<template>
    <li id="event-list-item">

        <!-- Event Image -->
        <div id="header">
            <img class="image" :src="image">
            <div id="sports">
                <div v-for="sport in event.sports" class="sport">{{ sport }}</div>
            </div>
        </div>

        <!-- Bottom Bar (Event Details) -->
        <div id="details">
            <!-- Right Side -->
            <div id="detail-left">
                <div id="title"> {{ event.title }} </div>
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
                        {{ event.timeToString() }}
                    </div>
                </div>
            </div>

            <!-- Left Side -->
            <div id="detail-right">
                <div id="status">{{ statusString }}</div>
                <div id="participants">
                    <picture>
                        <source srcset="@/assets/icons/group/group.white.svg" media="(prefers-color-scheme: dark)"> 
                        <img class="location-pin" src="@/assets/icons/group/group.svg"> 
                    </picture>
                    <div id="count">{{ event.participants.length }}</div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { EVENT_STATE, VIEW_STATE } from '~/data/Enums';
import { Event } from '~/data/models/EventModels';
import type { Venue } from '~/data/models/VenueModels';
import { generateImageURL } from '~/utils/image-helpers';

const emit = defineEmits(
    ["selected"]
);
const props = defineProps({
    event: { type: Event, required: true }
});

const status = ref<EVENT_STATE>(EVENT_STATE.PENDING);
const statusString = computed<string>(() => {
    switch(status.value) {
        case EVENT_STATE.PENDING:
            return 'Pending';
        case EVENT_STATE.LIVE:
            return 'Live';
        default:
            return 'Ended';
    }
});
const updateStatus = () => {
    const now = Date.now();
    const startTime = new Date(props.event.startTime * 1000).getTime();
    const endTime = new Date(props.event.stopTime * 1000).getTime();
    
    if (now < startTime) {
        status.value = EVENT_STATE.PENDING;
    } else if (now >= startTime && now <= endTime) {
        status.value = EVENT_STATE.LIVE;
    } else {
        status.value = EVENT_STATE.COMPLETED;
    }
};
updateStatus();
const interval = setInterval(updateStatus, 30000);

onUnmounted(() => {
    clearInterval(interval);
});

const state = ref(VIEW_STATE.LOADING);
const image = computed(() => {
    return props.event.imageURL ? generateImageURL(props.event.imageURL) : undefined;
});

const venues: Ref<Venue[]> = ref([]);
const venueName: ComputedRef<string> = computed(() => {
    const venuesLength = props.event.venues.length;
    if (venuesLength == 1) {
        return (venues.value[0]?.name ?? props.event.venues[0]?.name) ?? 'Unknown Venue';
    } else if (venuesLength > 1) {
        return `${venues.value[0]?.name} & ${venues.value.length-1} more`
    } else {
        return 'Unknown Venue';
    }
});

async function loadLocationData() {
    const promises: Promise<Venue>[] = [];
    const _venues: Venue[] = [];
    const store = useModelStore();
    const eventVenues = props.event.venues;
    if (eventVenues) {
        eventVenues.forEach((v) => {
            if (v.id) {
                promises.push(store.getVenueByID(v.id));
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
    min-width: 20rem;
    max-width: 23rem;
    position: relative;
    list-style-type: none;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    background-color: var(--secondary-background-color);

    #header {
        #sports {
            top: 1rem;
            left: 1rem;
            display: flex;
            position: absolute;
        }

        .sport {
            color: white;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            border-radius: 20px;
            /* background-color: black; */
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
            height: 24rem;
            object-fit: cover;
            border-radius: 10px 10px 0px 0px;
        }
    }

    #details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5rem 1rem 0.75rem 1rem;

        #detail-left {
            #title {
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
            }

            #location {
                display: flex;
                font-size: 0.95rem;
                align-items: center;

                .location-pin {
                    width: 1rem;
                    height: 1rem;
                }
            }

            #start-date {
                opacity: 0.5;
                display: flex;
                font-size: 0.95rem;
                align-items: center;

                .calendar {
                    width: 1rem;
                    height: 1rem;
                }
            }
        }

        #detail-right {
            #status {
                font-size: 0.9rem;
                font-weight: 600;
                margin: 0.25rem 0rem;
            }

            #participants {
                display: flex;
                align-items: center;
                flex-direction: row;

                #count {
                    margin-left: 0.25rem;
                }
            }
        }
    }
}
</style>