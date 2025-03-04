<template>
    <div id="announcements-gallery">
        <h3>Announcements</h3>
        <Galleria 
            v-if="state !== VIEW_STATE.LOADING" 
            :value="images" 
            :showThumbnails="false" 
            :showItemNavigators="true"
            :pt="{
                nextButton: (options) => ({
                    style: {
                        'width': '3rem',
                        'height': '3rem'
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
                        'width': '3rem',
                        'height': '3rem'
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
                <img :src="slotProps.item" class="image" />
            </template>
        </Galleria>

        <Skeleton v-if="state === VIEW_STATE.LOADING" class="mb-2 image" style="width: 45vw; height: 84vh;"></Skeleton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Skeleton from 'primevue/skeleton';
import Galleria from 'primevue/galleria';

import { VIEW_STATE } from "~/data/Enums";
import { useSessionStore } from "~/stores/session-store";

const sessionStore = useSessionStore()

const state = computed<VIEW_STATE>(() => {
    return sessionStore.loadingState;
});

const images = computed<string[]>(() => {
    return sessionStore.announcements;
})
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
        color: var(--primary-label-color);
        font-family: 'Inter';
    } 

    .image {
        width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 10px;
    }

    @media (max-width: 970px) {
        .image {
            width: 100%;
            height: auto;
            border: unset;
            border-radius: unset;
        }
    }
}
</style>
