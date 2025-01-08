<template>
    <div class="container">
        <h2>Announcements</h2>
        <Galleria v-if="state !== VIEW_STATE.LOADING" :value="images" :showThumbnails="false" :showItemNavigators="true">
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
    .container {
        width: auto;
        height: 100%;
        max-height: 1000px;

        h2 {
            margin-bottom: 1rem;
            margin-left: 1rem;
            color: var(--primary-label-color);
            font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
        } 

        .image {
            width: 100%;
            height: auto;
            border-radius: 10px;
        }

        @media (max-width: 940px) {
            .image {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }
        }

        @media (max-width: 675px) {
            .image {
                border-radius: unset;
            }
        }
    }
</style>
