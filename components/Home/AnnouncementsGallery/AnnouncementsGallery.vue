<template>
    <div id="announcements-gallery">
        <h3>Announcements</h3>
        <Galleria 
            v-if="state !== VIEW_STATE.LOADING" 
            :value="announcements" 
            :showThumbnails="false" 
            :showItemNavigators="true"
            class="galleria"
            :pt="{
                nextButton: (options) => ({
                    style: {
                        'z-index': '10',
                        'width': '3rem',
                        'height': '3rem',
                        'margin-right': '1rem'
                    }
                }),
                nextIcon: (options) => ({
                    style: {
                        'width': '2rem',
                        'height': '2rem'
                    }
                }),
                prevButton: (options) => ({
                    style: {
                        'z-index': '10',
                        'width': '3rem',
                        'height': '3rem',
                        'margin-left': '1rem'
                    }
                }),
                prevIcon: (options) => ({
                    style: {
                        'width': '2rem',
                        'height': '2rem'
                    }
                })
            }"
        >
            <template #item="slotProps">
                <div id="announcement">
                    <img :src="generateImageURL(slotProps.item.mediaURL)" class="image" />
                    <div id="info">
                        <div class="title" :style="{}">{{ slotProps.item.title }}</div>
                        <div class="subtitle" :style="{}">{{ slotProps.item.subtitle }}</div>
                        <button class="action" :style="{}" @click="navigateTo(slotProps.item.actionButton.url)">{{ slotProps.item.actionButton.text }}</button>
                    </div>
                </div>
            </template>
        </Galleria>

        <Skeleton v-if="state === VIEW_STATE.LOADING" id="skeleton" class="mb-2 image"></Skeleton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Skeleton from 'primevue/skeleton';
import Galleria from 'primevue/galleria';

import { VIEW_STATE } from "~/data/Enums";
import { useSessionStore } from "~/stores/session-store";
import { type Announcement } from "~/data/models/AnnouncementModels";
import { AnnouncementService } from "~/data/services/AnnouncementService";

const session = useSessionStore();
const service = new AnnouncementService();
const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);

const announcements = computed<Announcement[]>(() => {
    return session.announcements;
});

onMounted(async() => {
    if (session.announcements.length > 0) return;
    state.value = VIEW_STATE.LOADING;

    const resp = await service.getAnnouncements();
    if (!resp) return;

    session.announcements = resp.announcements;
    state.value = VIEW_STATE.SUCCESS;
});
</script>

<style scoped>
#announcements-gallery {
    width: 100%;
    height: 100%;
    grid-area: main;
    overflow: hidden;
    margin: 2rem 0rem;
    max-height: 1000px;

    * {
        border: unset;
    }

    h3 {
        margin-left: 1rem;
        margin-bottom: 1rem;        
        font-family: 'Inter';
        color: var(--primary-label-color);
    } 

    #skeleton {
        margin: 0rem 1rem;
        border-radius: 18px;
        width: auto !important;
        height: 32.5rem !important;
    }

    #announcement {
        width: 100%;
        height: 32.5rem;
    }

    #info {
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding: 2rem;
        display: flex;
        position: absolute;
        flex-direction: column;
    }

    .image {
        width: 100%;
        height: 32.5rem;
        object-fit: cover;
        position: relative;
        border-radius: 10px;
    }

    .title {
        width: 70%;
        color: white;
        font-weight: bold;
        font-size: xx-large;
        font-family: 'Archivo';
        text-shadow: 0px 0px 8px rgba(38,46,87,0.5);
    }

    .subtitle {
        width: 70%;
        color: white;
        font-size: x-large;
        margin-top: 0.5rem;
        font-weight: normal;
        text-shadow: 0px 0px 8px rgba(38,46,87,0.5);
    }

    .action {
        color: white;
        cursor: pointer;
        margin-top: auto;
        font-weight: bold;
        font-size: large;
        font-style: italic;
        border-radius: 30px;
        margin-bottom: 1rem;
        align-self: flex-end;
        justify-self: flex-end;
        padding: 0.75rem 1.5rem;
        text-transform: uppercase;
        background-color: var(--primary-brand-color);
    }

    @media (max-width: 970px) {
        #announcement {
            height: 28rem;
            margin: 0rem 0.5rem;
        }
        
        .image {
            height: 28rem;
        }

        .title {
            width: 90%;
        }

        .subtitle {
            width: 90%;
        }

        .action {

        }
    }

}
</style>
