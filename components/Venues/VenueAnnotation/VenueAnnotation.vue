<template>
    <div class="container">
        <div v-if="hasEvents" class="pill"></div>
        <img v-if="imageFailed" src="@/assets/icons/image/image.white.svg" class="failed">
        <img v-else :src="imageURL" :onerror="handleFailedImage"/>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Venue } from '~/data/models/VenueModels';
import { generateImageURL } from '~/utils/Image';

const props = defineProps({
    venue: { type: Venue, required: true },
    hasEvents: { type: Boolean }
});

var imageFailed = ref(false);

var hasEvents = computed(() => {
    return props.hasEvents;
});

var imageURL = computed(() => {
    const images = props.venue.images;
    if (images) {
        const url = images[0];
        if (url) {
            return generateImageURL(url);
        }
    }
    return undefined;
});

var handleFailedImage = () => {
    imageFailed.value = true;
};

</script>

<style scoped>
.container {
    width: 3rem;
    height: 3rem;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-brand-color);

    .failed {
        width: 1rem;
        height: 1rem;
    }

    img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
    }

    .pill {
        top: 1rem;
        left: 3rem;
        width: 0.8rem;
        height: 0.8rem;
        position: absolute;
        border-radius: 50%;
        background-color: red;
    }
}
</style>