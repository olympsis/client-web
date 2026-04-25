<template>
    <div class="container">

        <!-- Venue Info -->
        <div id="header">
            <div class="info">
                <h1>{{ name }}</h1>
            </div>
            <div class="actions">
                <button class="button" type="button" @click="closeModal">
                    <picture>
                        <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)"/>
                        <img src="@/assets/icons/xmark/xmark.svg" class="image">
                    </picture>
                </button>
            </div>
        </div>

        <div id="body" style="height: 100%; ">
            <div class="location">
                <h2> {{ location }}</h2>
            </div>
            <!-- Venue Images -->
            <div class="images">
                <li v-for="image in images">
                    <img :src="generateImageURL(image)" class="image"/>
                </li>
            </div>

            <!-- Venue Body -->
            <div class="body">
                <h3>About this Venue</h3>
                <p>{{ description }}</p>
            </div>

            <div v-if="requiresBooking" :style="{ display: 'flex', fontSize: '0.8rem', alignItems: 'center', margin: '0rem 1rem' }">
                <img src="@/assets/icons/warning/warning.yellow.svg">
                <p>This location may require an external reservation before you can host an event</p>
            </div>

            <!-- Venue Actions -->
            <div class="actions">
                <div class="action directions" v-if="!requiresBooking" @click="openMaps">
                    <img src="@/assets/icons/car/car.white.svg">
                    <p>Directions</p>
                </div>

                <div class="action type" v-else @click="openMaps">
                    <picture>
                        <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/car/car.svg">
                    </picture>
                    <p>Directions</p>
                </div>

                <div class="action type" v-if="!requiresBooking">
                    <picture>
                        <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/globe/globe.svg">
                    </picture>
                    <p>{{ ownerName }}</p>
                </div>

                <div class="action directions" v-else @click="openBooking">
                    <img src="@/assets/icons/calendar/calendar.add.fill.white.svg">
                    <p>Schedule</p>
                </div>

                <div class="action new-event">
                    <picture>
                        <source srcset="@/assets/icons/plus/plus.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/plus/plus.svg">
                    </picture>
                    <p>Event</p>
                </div>
                <div class="action more">
                    <picture>
                        <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/ellipsis/ellipsis.svg">
                    </picture>
                    <p>More</p>
                </div>
            </div>

            <!-- Venue Events -->
            <div class="events">
                <div class="header">
                    <h3>Events</h3>
                </div>
                <li v-for="event in events">
                    <Suspense>
                        <EventListItem :event="event" @selected="handleEventSelected"/>
                    </Suspense>
                </li>

                <div v-if="events.length == 0" class="no-events">
                    <b>No events</b>
                </div>

                <div :style="{ padding: '1rem 0rem' }"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, type Ref } from 'vue';
import { Event } from '@/data/models/EventModels';
import { Venue } from '@/data/models/VenueModels';
import { getDirections } from '~/utils/map-helpers';
import { useModelStore } from '@/stores/model-store';
import { useSessionStore } from '@/stores/session-store';
import { generateImageURL } from '~/utils/image-helpers';

import { useRouter } from 'vue-router';
import EventListItem from '@/components/Events/EventListItem/EventListItem.vue';

const router = useRouter();
const session = useSessionStore();
const modelStore = useModelStore();

const props = defineProps({
    venue: { type: Venue, required: true },
    events: { type: Array<Event>, required: true },
    isEthereal: { type: Boolean, required: false }
});

const emit = defineEmits([
    "close",
    "selected"
]);

const name = computed(() => {
    return props.venue.name;
});

const description = computed(() => {
    return props.venue.description;
});

// Server stores `locality` (city) + `administrative_area` (state). Display
// joins whichever pieces are present so we don't render lone commas.
const location = computed(() => {
    return [props.venue.locality, props.venue.administrativeArea].filter(Boolean).join(', ');
});

const images = computed(() => {
    return props.venue.media ?? [];
});

const events = computed(() => {
    return modelStore.getAllEvents()
        .filter((e) => {
            return e.venues?.find((v) => v.venueId == props.venue.id);
        });
});

// Owner is just an organization id on the wire — resolve lazily through the
// model store so repeat renders don't refetch. Falls back to "Public" while
// the org loads or if the venue has no owner.
const ownerName = ref<string>('Public');
watchEffect(async () => {
    const ownerId = props.venue.ownerId;
    if (!ownerId) {
        ownerName.value = 'Public';
        return;
    }
    try {
        const org = await modelStore.getOrganizationByID(ownerId);
        ownerName.value = org?.name ?? 'Public';
    } catch {
        ownerName.value = 'Public';
    }
});

const requiresBooking = computed<Boolean>(() => {
    return props.venue.access.requiresBooking && props.venue.url != undefined;
});

function closeModal() {
    emit("close");
}

function handleEventSelected(event: any) {
    router.push(`/events/${event.event.id}`)
}

function openMaps() {
    if (props.venue.location) {
        const coordinates = props.venue.location?.coordinates;
        if (coordinates) {
            getDirections(coordinates);
        }
    }
}

function openBooking() {
    if (props.venue.url) {
        window.open(props.venue.url);
    }
}

</script>

<style scoped>

.container {
    height: 80vh;
    max-width: 35rem;
    background-color: var(--primary-background-color);

    #header {
        
        display: flex;
        min-height: 2rem;
        max-height: 3rem;
        align-items: center;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--primary-brand-color);
        justify-content: space-between;

        .info {
            h1 {
                text-overflow: ellipsis;
                color: var(--primary-label-color);
            }
            h2 {
                color: gray;
            }
        }

        .actions {
            display: flex;
            align-items: center;

            .button {
                all: unset;
                width: 2rem;
                height: 2rem;
                display: flex;
                cursor: pointer;
                margin: 1rem 0rem;
                align-items: center;
                justify-content: center;

                .image {
                    width: 2rem;
                    height: 2rem;
                }
            }
        }
    }

    #body {
        height: 100%;
        overflow-y: scroll;
    }

    .location {
        color: gray;
        margin-left: 1rem;
        margin-top: 0.2rem;
        margin-bottom: 1rem;
    }

    .images {
        width: 100%;
        display: flex;
        overflow-x: scroll;
        list-style-type: none;
        
        .image {
            width: 16rem;
            height: 22rem;
            margin: 0rem 0.5rem;
            border-radius: 1rem;
        }
    }

    .body {
        display: flex;
        margin: 1rem;
        flex-direction: column;

        h3 {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            color: var(--primary-label-color);
        }

        p {
            color: var(--primary-label-color);
        }
    }

    .actions {
        display: flex;
        margin: 2rem 0.5rem;
        justify-content: space-around;

        .action {
            display: flex;
            width: 100%;
            height: 5rem;
            cursor: pointer;
            border-radius: 1rem;
            align-items: center;
            margin: 0rem 0.5rem;
            flex-direction: column;
            justify-content: center;
            background-color: var(--secondary-background-color);

            img {
                width: 2.5rem;
                height: 2.5rem;
            }

            p {
                font-size: 0.9rem;
                text-transform: capitalize;
                color: var(--primary-label-color);
            }
        }

        .directions {
            background-color: var(--primary-brand-color);

            p {
                color: white;
            }
        }
    }

    .events {
        margin: unset;
        margin-top: 1rem;
        margin-left: 1rem;
        margin-right: 1rem;
        margin-bottom: 5rem;
        list-style-type: none;

        .header {
            display: flex;
            height: unset;
            align-items: first baseline;
            flex-direction: column;
            color: var(--primary-label-color);
        }

        .no-events {
            height: 10rem;
            display: flex;
            font-weight: normal;
            align-items: center;
            justify-content: center;
        }

        li {
            margin: 1rem 0rem;
        }
    }
}
</style>