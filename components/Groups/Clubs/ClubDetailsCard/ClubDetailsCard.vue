<template>
    <div id="club-details-container">
        <div id="header">
            <h1 class="title">{{ title }}</h1>
            <button class="button" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>
        <ScrollPanel style="height: calc(100% - 4.1rem);">
            <div id="images">
                <img id="logo" :src="logo" @error="logoFailed = true" v-if="!logoFailed && logo !== undefined"/>
                <img id="banner" :src="banner" @error="bannerFailed = true" v-if="!bannerFailed && banner !== undefined"/>

                <picture id="default-logo" v-if="logoFailed || logo === undefined">
                    <source srcset="@/assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/group/group.fill.svg"/>
                </picture>

                <picture id="default-banner" v-if="bannerFailed || banner === undefined">
                    <source srcset="@/assets/icons/picture/picture.fill.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/picture/picture.fill.svg"/>
                </picture>
            </div>

            <div id="club-membership-info">
                <div id="visibility">
                    <picture v-if="visibility == 'public'">
                        <source srcset="@/assets/icons/globe/globe.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/globe/globe.svg"/>
                    </picture>

                    <picture v-if="visibility == 'private'">
                        <source srcset="@/assets/icons/lock/lock.white.svg" media="(prefers-color-scheme: dark)">
                        <img src="@/assets/icons/lock/lock.svg"/>
                    </picture>

                    {{ visibility }}
                </div>

                <div id="members-count">
                    {{ membersCount }}
                </div>

                <div id="members-peek">

                </div>
            </div>

            <div id="club-description">
                <h2>About</h2>
                {{ description }}
            </div>

            <div id="map-snapshot">
                <div id="locale"> Located in <strong>{{ locale }} </strong></div>
                <div id="map" ref="mapContainer"></div>
                <div id="founding"> <strong>Established</strong> {{ establishedTime }} </div>
            </div>
        </ScrollPanel>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';
import { Club } from '@/data/models/ClubModels';
import { calculateTimeAgo } from '~/utils/time-helpers';
import { generateImageURL } from '~/utils/image-extensions';
import { Location } from '@/data/models/GenericModels';
import { getMapkitServerToken } from '~/utils/map-helpers';


const props = defineProps({
    club: { type: Club }
});

declare let mapkit: any;
let map: any = null;
const mapContainer = ref(null);

const logoFailed = ref(false);
const bannerFailed = ref(false);

const title = computed(() => {
    return props.club?.name;
});

const banner = computed(() => {
    const url = props.club?.banner;
    if (url) {
        return generateImageURL(url);
    } else {
        return undefined;
    }
});

const logo = computed(() => {
    const url = props.club?.logo;
    if (url) {
        return generateImageURL(url);
    } else {
        return undefined;
    }
});

const visibility = computed(() => {
    return props.club?.visibility;
});

const members = computed(() => {
    return props.club?.members ?? [];
});

const membersCount = computed(() => {
    const _members = props.club?.members ?? [];
    return _members?.length > 1 ? `${_members?.length} members` : `${_members?.length} member`;
});

const description = computed(() => {
    return props.club?.description;
});

const locale = computed(() => {
    return `${props.club?.city} ${props.club?.state}`;
});

const establishedTime = computed(() => {
    return calculateTimeAgo(props.club?.createdAt ?? new Date().getMilliseconds());
});

onMounted(() => {
    const options = {
        showsZoomControl: false,
        showsUserLocation: false,
        tracksUserLocation: false,
        showsMapTypeControl: false,
        showsPointsOfInterest: false,
        showsCompass: mapkit.FeatureVisibility.Hidden
    }

    map = new mapkit.Map(
        mapContainer.value,
        options
    );
    const region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(37.3316850890998, -122.030067374026),
        new mapkit.CoordinateSpan(0.167647972, 0.354985255)
    );
    map.region = region;
});

async function geocode(city: string, state: string) {
    const token = await getMapkitServerToken();
    const response = await fetch(
        `https://maps-api.apple.com/v1/geocode?q=${city}, ${state}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )

    // Decode the response
    const json = await response.json();
    const results = json['results'];
    const result = results[0];

    const data = new Location(
        result.coordinate.latitude,
        result.coordinate.longitude,
        result.structuredAddress.locality,
        result.structuredAddress.administrativeArea,
        result.structuredAddress.administrativeAreaCode,
        result.structuredAddress.postCode,
        result.country,
        result.countryCode
    );

    const region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(data.latitude, data.longitude),
        new mapkit.CoordinateSpan(0.05, 0.2)
    );
    map.region = region;
}

geocode(props.club?.city ?? '', props.club?.state ?? '');

</script>

<style scoped>
#club-details-container {
    max-width: 35rem;
    height: 80vh !important;
    background-color: var(--primary-background-color);

    #header {
        display: flex;
        height: 2rem;
        margin: 1rem;
        align-items: center;
        justify-content: space-between;

        .title {
            font-weight: 600;
            color: var(--primary-label-color);
        }

        .button {
            width: 3rem;
            height: 3rem;
            border: unset;
            cursor: pointer;
            background-color: unset;
        }
    }

    #images {
        margin-bottom: 6rem;

        #logo {
            width: 8rem;
            height: 8rem;
            top: 16rem;
            left: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            border: 4px solid var(--primary-label-color);
            background-color: var(--secondary-background-color);

            img {
                width: 3rem;
                height: 3rem;
            }
        }

        #banner {
            display: flex;
            width: 100%;
            height: 20rem;
            align-items: center;
            justify-content: center;
            background-color: var(--secondary-background-color);

            img {
                width: 3rem;
                height: 3rem;
            }
        }

        #default-banner {
            display: flex;
            width: 100%;
            height: 20rem;
            align-items: center;
            justify-content: center;
            background-color: var(--secondary-background-color);

            img {
                width: 3rem;
                height: 3rem;
            }
        }

        #default-logo {
            width: 8rem;
            height: 8rem;
            top: 16rem;
            left: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            border: 4px solid var(--primary-label-color);
            background-color: var(--secondary-background-color);

            img {
                width: 3rem;
                height: 3rem;
            }
        }
    }

    #club-membership-info {
        margin: 0rem 1rem;
        
        #visibility {
            display: flex;
            align-items: center;
            text-transform: capitalize;
            color: var(--primary-label-color);

            picture {
                margin: 0rem 0.5rem;
            }
        }
    }

    #members-count {
        margin: 0rem 0.5rem;
        color: var(--primary-label-color);
    }

    #club-description {
        margin: 1rem;
        color: var(--primary-label-color);

        h2 {
            margin-bottom: 0.5rem;
        }
    }

    #map-snapshot {
        margin: 1rem 0rem;

        #map {
            width: 100%;
            height: 15rem;
            max-width: 35rem;
            margin: 0.5rem 0rem;
        }

        #locale {
            margin: 0rem 1rem;
            color: var(--primary-label-color);
        }

        #founding {
            margin: 0rem 1rem;
            color: var(--primary-label-color);
        }
    }
}
</style>