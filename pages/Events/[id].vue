<template>
    <div>
        <div>{{ eventID }}</div>
        <div>{{ eventTitle }}</div>
        <div>{{ venueName }}</div>
        <div>{{ venueLocation }}</div>
    </div>
</template>

<script setup lang="ts">
import { useModelStore } from '~/stores/model-store';
import { useSessionStore } from '~/stores/session-store';

import { Club } from '~/data/models/ClubModels';
import { generateImageURL } from '~/utils/Image';
import { Venue } from '~/data/models/VenueModels';
import { Event } from '~/data/models/EventModels';
import { Organization } from '~/data/models/OrganizationModels';
import { AUTH_STATUS, EVENT_STATE, GROUP_TYPE, VIEW_STATE } from '~/data/Enums';

const route = useRoute();
const router = useRouter();
const store = useModelStore();
const config = useRuntimeConfig();
const session = useSessionStore();

const clubs: Ref<Array<Club>> = ref([]);
const venues: Ref<Array<Venue>> = ref([]);
const orgs: Ref<Array<Organization>> = ref([]);

const state= ref<VIEW_STATE>(VIEW_STATE.PENDING);
const primaryState = ref<VIEW_STATE>(VIEW_STATE.PENDING);
const failed: Ref<boolean | undefined> = ref(undefined);
            
const event: Ref<Event | undefined> = ref(undefined);

/**
 * COMPUTED VARIABLES
 */
const isAuthenticated = computed<boolean>(() => {
    return session.authStatus === AUTH_STATUS.authenticated;
});

const eventID = computed<string>(() => {
    return Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id;
});

const eventTitle = computed<string>(() => {
    return event.value?.title ?? 'Olympsis Events';
});

const eventBody = computed<string>(() => {
    return event.value?.body ?? 'Join olympsis to find sports events near you!';
})

const eventState = computed<EVENT_STATE>(() => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const thirtyMinutesAgo = timestamp - (30 * 60);
    const twoHoursAgo = timestamp - (2 * 60 * 60);

    const startTime = (event.value?.startTime) ?? 0;
    const stopTime = (event.value?.stopTime) ?? 0;

    if (
        (stopTime !== 0 && stopTime < timestamp) ||
        (startTime !== 0 && startTime < twoHoursAgo)
    ) {
        return EVENT_STATE.COMPLETED;
    } else if (startTime !== undefined && startTime < thirtyMinutesAgo) {
        return EVENT_STATE.LIVE;
    } else {
        return EVENT_STATE.PENDING;
    }
});

const eventStatusText = computed<string>(() => {
    const minParticipants = event.value?.minParticipants;

    if (eventState.value === EVENT_STATE.COMPLETED) {
        return 'Ended'
    } else if (eventState.value === EVENT_STATE.LIVE) {
        return 'Live'
    } else if (minParticipants && minParticipants < (event.value?.participants?.length ?? 0)) {
        return 'Pending';
    } else {
        return 'Game On!'
    }
});

const eventImageURL = computed<string | undefined>(() => {
    return event.value?.imageURL ? generateImageURL(event.value?.imageURL) : undefined;
});

const organizers = computed<string>(() => {
    const arr = event.value?.organizers;
    const names: string[] = [];

    if (arr && (clubs.value.length != 0 || orgs.value.length != 0)) {
        arr.forEach((organizer) => {
            switch(organizer.type) {
                case GROUP_TYPE.CLUB:
                    const c = clubs.value.find((c) => { return c.id == organizer.id });
                    if (c?.name) {
                        names.push(c?.name);
                    }
                case GROUP_TYPE.ORGANIZATION:
                    const o = orgs.value.find((o) => { return o.id == organizer.id });
                    if (o?.name) {
                        names.push(o.name);
                    }
            }
        });
    }

    if (names.length == 1) {
        return names[0];
    } else if (names.length == 2) {
        return `${names[0]} and ${names[1]}`
    } else if (names.length > 2) {
        return `${names[0]} and ${names.length - 1} others`;
    } else {
        return 'Unknown Group'
    }
});

const venueName = computed<string>(() => {
    const names: string[] = [];
    const descriptors = event.value?.venues;
    if (descriptors) {
        descriptors.forEach((d) => {
            const venue = venues.value.find((v) => { return v.id == d.id });
            if (venue) {
                if (venue.name) {
                    names.push(venue.name);
                }
            } else if(d.name) {
                names.push(d.name);
            }
        });
    }

    if (names.length == 1) {
        return names[0];
    } else if (names.length > 1) {
        return `${names[0]} & ${names.length-1} more`
    } else {
        return 'Unknown Venue';
    }
});

const venueLocation = computed<string>(() => {
    const cities: Map<string, number> = new Map();
    const states: Map<string, number> = new Map();
    const countries: Map<string, number> = new Map();

    const descriptors = event.value?.venues;
    if (descriptors) {
        descriptors.forEach((d) => {
            const venue = venues.value.find((v) => { return v.id == d.id });
            if (venue) {
                const city = venue.city;
                const state = venue.state;
                const country = venue.country;

                if (city) {
                    const exists = cities.get(city);
                    if (exists) {
                        cities.set(city, exists + 1)
                    } else {
                        cities.set(city, 1);
                    }
                }

                if (state) {
                    const exists = states.get(state);
                    if (exists) {
                        states.set(state, exists + 1)
                    } else {
                        states.set(state, 1);
                    }
                }

                if (country) {
                    const exists = countries.get(country);
                    if (exists) {
                        countries.set(country, exists + 1)
                    } else {
                        countries.set(country, 1);
                    }
                }
            } else {
                const city = d.city;
                const state = d.state;
                const country = d.country;

                if (city) {
                    const exists = cities.get(city);
                    if (exists) {
                        cities.set(city, exists + 1)
                    } else {
                        cities.set(city, 1);
                    }
                }

                if (state) {
                    const exists = states.get(state);
                    if (exists) {
                        states.set(state, exists + 1)
                    } else {
                        states.set(state, 1);
                    }
                }

                if (country) {
                    const exists = countries.get(country);
                    if (exists) {
                        countries.set(country, exists + 1)
                    } else {
                        countries.set(country, 1);
                    }
                }
            }
        });
    }

    if (cities.size > 1) {
        if (states.size > 1) {
            if (countries.size > 1) {
                const names: string[] = [];
                countries.forEach((v, k) => {
                    names.push(k);
                });

                return names.join(' & ');
            }
            const iterator = countries.keys();
            return iterator.next().value ?? 'Unknown Location';
        }
        const iterator = states.keys();
        const iterator2 = countries.keys();
        const state = iterator.next().value;
        const country = iterator2.next().value;
    
        if (state && country) {
            return `${state}, ${country}`;
        } else {
            return 'Unknown Location';
        }
    } else {
        const iterator = cities.keys();
        const iterator2 = states.keys();
        const state = iterator2.next().value;
        const city = iterator.next().value;

        if (city && state) {
            return `${city}, ${state}`;
        } else {
            return 'Unknown Location';
        }
    }
});

const eventDate = computed<string>(() => {
    return event.value?.timeToString() ?? '';
});

const eventDescription = computed<string>(() => {
    return event.value?.body ?? '';
});

async function loadEventData(id: string | undefined) {
    let clubsArr: Club[] = [];
    let orgsArr: Organization[] = [];
    let venuesArr: Venue[] = [];
    state.value = VIEW_STATE.LOADING;

    let promises: any[] = [];

    // Fetch event info
    if (id) {
        // Try to find event in memory
        const local = session.events.find((e) => e.id == id);
        if (local) {
            event.value = local
        } else {
            // Get the event remotely
            try {
                const remote = await session.eventService.getEvent(id);
                if (remote) {
                    event.value = remote;
                    store.setEvent(remote);
                } else {
                    failed.value = true;
                    return;
                }
            } catch {
                failed.value = true;
                return;
            }
        }
        const title = `${event.value?.title} - Olympsis Events`;
        const description = 'Join this sports event on Olympsis!';
    } else {
        // router.push('/events');
        return;
    }

    if (event.value?.organizers) {
        event.value?.organizers.forEach(async (o) => {
            switch (o.type) {
                case GROUP_TYPE.CLUB:
                    if (o.id) {
                        promises.push(store.getClubByID(o.id));
                    }
                    break;
                case GROUP_TYPE.ORGANIZATION:
                    if (o.id) {
                        promises.push(store.getOrganizationByID(o.id));
                    }
                    break;
            }
        })
    }

    if (event.value?.venues) {
        event.value?.venues.forEach(async (v) => {
            if (v.id) {
                promises.push(store.getVenueByID(v.id));
            }
        });
    }

    await Promise.allSettled(promises)
        .then((results) => {
            results.forEach((p) => {
                if (p.status === 'fulfilled') {
                    if (Object.getPrototypeOf(p.value) === Club.prototype) {
                        clubsArr.push(p.value);
                    } else if (Object.getPrototypeOf(p.value) === Organization.prototype) {
                        orgsArr.push(p.value);
                    } else if (Object.getPrototypeOf(p.value) === Venue.prototype) {
                        venuesArr.push(p.value);
                    }
                } else {
                    console.debug('%c Failed to fetch model on event load.', 'color: red;')
                }
            })
        })

    clubs.value = clubsArr;
    orgs.value = orgsArr;
    venues.value = venuesArr;
    state.value = VIEW_STATE.SUCCESS;
    failed.value = false;

    useSeoMeta({
        title: () => eventTitle.value,
        description: () => eventBody.value,

        ogTitle: () => eventTitle.value,
        ogImage: () => eventImageURL.value,
        ogDescription: () => eventBody.value,

        twitterCard: 'summary_large_image',

        appleItunesApp: {
            appId: config.public.APP_ID,
            appArgument: `/events/${eventID.value}`
        }
    });
}

await loadEventData(eventID.value)
</script>

<style scoped>
</style>