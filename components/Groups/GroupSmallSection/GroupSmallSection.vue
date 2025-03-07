<template>
    <div id="group-small-section">
        <div id="location">
            <h2>Location</h2>
            <img v-if="mapURL" id="map" :src="mapURL"/>
            <div v-else id="map-placeholder"/>
            <div id="details">
                <picture :style="{ width: '42px', height: '42px', margin: '0rem 0.5rem' }" class="icon">
                    <source srcset="@/assets/icons/pin-drop/pin.drop.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/pin-drop/pin.drop.svg">
                </picture>

                <div id="info">
                    <div class="title">{{ (group?.city ?? '') + ', ' + (group?.state ?? '') }}</div>
                </div>
            </div>
        </div>

        <div id="tags" v-if="group.tags?.length > 0">
            <h2>Group Tags</h2>
            <ul class="list">
                <li v-for="tag in group.tags" class="tag">{{ tag }}</li>
            </ul>
        </div>

        <div id="rules" v-if="group.rules?.length > 0">
            <h2>Group Rules</h2>
            <ul class="numbered-list">
                <li v-for="tag in group.rules" class="rule">{{ tag }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';
import { SnapshotService } from '~/data/services/SnapshotService';

const props = defineProps({
   group: { type: Object, required: true }
});

const mapURL = ref<string | undefined> (undefined);
const mapState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

onMounted(() => {
    if (mapURL.value) return;

    const city = props.group?.city ?? '';
    const state = props.group?.state ?? '';
    const country = props.group?.country ?? '';

    mapState.value = VIEW_STATE.LOADING;
    
    const service = new SnapshotService();
    service.getMapSnapshot(`${city}, ${state} ${country}`)
        .then((blob) => {
            mapURL.value = URL.createObjectURL(blob);
            mapState.value = VIEW_STATE.SUCCESS;
        })
        .catch((error) => {
            console.error(`Failed to load snapshot. Error: ${error}`);
            mapState.value = VIEW_STATE.FAILURE;
        });
});
</script>

<style scoped>
#group-small-section {
    padding: 1.25rem;
    max-width: 23rem;
    grid-area: location;
    height: fit-content;
    border-radius: 16px;
    border: rgb(0, 0, 0, 0.2) solid 1px;
    background-color: var(--secondary-background-color);
    #map {
        width: 100%;
        border-radius: 20px;
        margin: 0.5rem 0rem;
    }

    #details {
        display: flex;
    }

    #map-placeholder {
        width: 100%;
        max-height: 20rem;
        margin: 0.5rem 0rem;
        border-radius: 20px;
        background-color: var(--secondary-background-color);
    }

    .icon {
        width: 42px;
        height: 42px;

        img {
            padding: 0.5rem;
            border-radius: 10px;
            border: var(--icon-border-color) solid 1px;
            background-color: var(--tertiary-background-color);
        }
    }

    #info {
        display: flex;
        align-items: center;
    }

    .title {
        font-weight: bold;
    }

    .sub-title {
        font-size: 0.9rem;
    }
}

#tags {
    margin: 1rem 0rem;
}
.list {
    gap: 1rem;
    display: flex;
    overflow-y: scroll;
    padding: 1rem 0rem;
    flex-direction: row;
    list-style-type: none;
}
.tag {
    color: black;
    border-radius: 12px;
    padding: 0.5rem 1rem;
    text-transform: capitalize;
    background-color: #E4E4E4;
    border: rgb(0, 0, 0, 0.1) solid 1px;
}

.numbered-list {
    gap: 0.5rem;
    display: flex;
    margin: 1rem 0rem;
    flex-direction: column;
    list-style-type: decimal;
}
</style>