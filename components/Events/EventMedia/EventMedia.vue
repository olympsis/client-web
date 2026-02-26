<template>
    <div id="event-media">
        <LabelsList :tags="tags" :limit="3"/>
        <div id="share" @click="handleEventSharing">
            <img src="@/assets/icons/share/share.white.svg" alt="share button icon">
        </div>
        <img id="media" alt="The event's media. An image or video flyer." :src="generateImageURL(event.mediaURL)">
    </div>
</template>

<script setup lang="ts">
import { useToast } from '#imports';
import { generateImageURL } from '#imports';
import { Event } from '~/data/models/EventModels';
import LabelsList from '../../LabelsList/LabelsList.vue';

const props = defineProps({
    event: { type: Event, required: true }
});

const toast = useToast();
const tags = computed<string[]>(() => {
    var labels = [];
    if (props.event.isFull()) {
        labels.push('full');
    } 
    if (props.event.isCompetition()) {
        labels.push('tournament');
    }

    return [...labels, ...props.event.sports, ...props.event.tags];
});
function handleEventSharing() {
    navigator.clipboard.writeText(window.location.href);
    toast.add({ severity: 'secondary', summary: 'Link Copied', detail: 'You\'ve copied the link to this event', life: 3000 });
}

</script>

<style scoped>
#event-media {
    width: 100%;
    grid-area: media;
    max-width: 30rem;
    position: relative;

    #labels-list {
        margin: 1rem;
        position: absolute;
        padding-bottom: 0.5rem;
        max-width: calc(100% - 80px);
    }

    #media {
        width: 100%;
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
        border: 1px solid var(--component-border-color);
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