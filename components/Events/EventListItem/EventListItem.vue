<template>
    <div id="event-list-item" @click="$emit('selected', { event: event })">
        <img :src="image" class="image"/>
        <div class="event-info">
            <h1 class="title">{{ event.title }}</h1>
            <h2 class="venue" v-if="state !== VIEW_STATE.LOADING">{{ venueName }}</h2>
            <div v-else class="venue-loading"></div>
        </div>
        <div class="event-status">
            <a class="status">{{ statusString }}</a>
            <a class="time"> {{ event.timeToString() }}</a>
            <div id="participants">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z"/>
                </svg>
                <a> {{ event.participants?.length ?? 0 }}</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EVENT_STATE, VIEW_STATE } from '~/data/Enums';
import type { Ref, ComputedRef } from 'vue';
import { generateImageURL } from '~/utils/image-extensions';
import { Event } from '~/data/models/EventModels';
import { Venue } from '~/data/models/VenueModels';
import { useModelStore } from '@/stores/model-store';

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
    if (venues.value.length == 1) {
        return venues.value[0]?.name ?? 'Unknown Venue';
    } else if (venues.value.length > 1) {
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
    display: flex;
    height: 8rem;
    padding: 1rem;
    cursor: pointer;
    border-radius: 10px;
    background-color: var(--secondary-background-color);
    flex-direction: row;

    .image {
        width: 6rem;
        height: 6rem;
        flex-shrink: 0;
        object-fit: cover;
        border-radius: 10px;
        object-position: center;
    }

    .event-info {
        display: block;
        width: 13rem;
        margin: 0.5rem 1rem;

        @media (max-width: 940px) {
            width: 18rem;
        }

        @media (max-width: 600px) {
            width: 13rem;
        }

        @media (max-width: 500px) {
            width: 7rem;
        }

        @media (max-width: 400px) {
            width: 5rem;
        }

        .title {
            flex: 1;
            font-size: 1.2rem;
            overflow: hidden;
            font-weight: normal;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--primary-label-color);
        }
        .venue {
            color: gray;
            font-size: 1rem;
            overflow: hidden;
            margin: 0.5rem 0rem;
            font-weight: normal;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .venue-loading {
            height: 1rem;
            border-radius: 5px;
            margin: 0.5rem 0rem;
            background-color: gray;
        }
    }

    .event-status {
        flex: 0;
        display: flex;
        margin-left: auto;
        margin-top: 0.5rem;
        flex-direction: column;
        align-items: flex-end;

        .status {
            font-weight: 600;
            font-size: 1rem;
            color: var(--primary-label-color);
        }
        .time {
            font-size: 0.8rem;
            margin: 0.2rem 0rem;
            white-space: nowrap;
            color: var(--primary-label-color);
        }
        #participants {
            display: flex;
            font-weight: 500;
            font-size: 1.5em;
            margin: 0.5rem 0rem;
            align-items: center;
            color: var(--primary-label-color);

            svg {
                width: 1.6rem;
                height: 1.6rem;
                margin: 0rem 0.5rem;
            }
        }
    }
}

@media (max-width: 940px) {
.wrapper {
    height: 6rem;

    .image {
        width: 4rem;
        height: 4rem;
    }

    .event-info {
        width: 7rem;
        margin: 0.5rem 1rem;

        .title {
            flex: 1;
            font-size: 1rem;
        }
        .field {
            color: gray;
            font-size: 0.8rem;
            margin: 0.2rem 0rem;
        }
    }

    .event-status {
        .status {
            font-weight: 600;
            font-size: 0.8rem;
            color: var(--primary-label-color);
        }
        .time {
            font-size: 0.6rem;
            margin: 0.2rem 0rem;
            white-space: nowrap;
            color: var(--primary-label-color);
        }
        #participants {
            display: flex;
            font-weight: 500;
            font-size: 1rem;
            margin: 0.5rem 0rem;
            align-items: center;
            color: var(--primary-label-color);

            svg {
                width: 1rem;
                height: 1rem;
                margin: 0rem 0.5rem;
            }
        }
    }
}
}

@media (max-width: 400px) {
.wrapper {
    height: 4rem;

    .image {
        width: 3rem;
        height: 3rem;
    }

    .event-info {
        margin: 0.4rem 0.8rem;

        .title {
            flex: 1;
            font-size: 0.9rem;
        }
        .field {
            color: gray;
            font-size: 0.7rem;
            margin: 0.2rem 0rem;
        }
    }

    .event-status {
        .status {
            font-weight: 600;
            font-size: 0.7rem;
            color: var(--primary-label-color);
        }
        .time {
            font-size: 0.5rem;
            margin: 0.2rem 0rem;
            white-space: nowrap;
            color: var(--primary-label-color);
        }
        #participants {
            display: flex;
            font-weight: 500;
            font-size: 0.9rem;
            margin: 0.5rem 0rem;
            align-items: center;
            color: var(--primary-label-color);

            svg {
                width: 1rem;
                height: 1rem;
                margin: 0rem 0.5rem;
            }
        }
    }
}
}
</style>