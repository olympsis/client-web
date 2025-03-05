<template>
    <div id="event-media">
        <div id="sports">
            <SportLabel v-for="sport in event.sports" :sport="sport"/>
        </div>
        <div id="share" @click="handleEventSharing">
            <img src="@/assets/icons/share/share.white.svg" alt="share button icon">
        </div>
        <img id="media" alt="The event's media. An image or video flyer." :src="generateImageURL(event.imageURL)">
    </div>
</template>

<script setup lang="ts">
import { useToast } from '#imports';
import { generateImageURL } from '#imports';
import { Event } from '~/data/models/EventModels';
import SportLabel from '~/components/SportLabel/SportLabel.vue';

defineProps({
    event: { type: Event, required: true }
});

function handleEventSharing() {
    navigator.clipboard.writeText(window.location.href);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this event', life: 3000 });
}

const toast = useToast();
</script>

<style scoped>
#event-media {
    max-width: 30rem;
    position: relative;

    #sports {
        margin: 1rem;
        position: absolute;
    }

    #media {
        max-width: 30rem;
        border-radius: 10px;
    }

    #share {
        right: 0;
        height: 42px;
        cursor: pointer;
        margin: 0.75rem;
        padding: 0.5rem;
        position: absolute;
        border-radius: 50%;
        border: 1px solid gray;
        text-transform: capitalize;
        backdrop-filter: blur(20px);
        background-blend-mode: hard-light;
        background: rgba(0, 0, 0, 0.56);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

        img {
            height: 24px;
        }
    }
}
</style>