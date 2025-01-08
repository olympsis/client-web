<template>
    <div id="navigation-card">
        <div v-if="state !== VIEW_STATE.LOADING" id="navigation-card-container">
            <div class="routes">
                <router-link to="/terms-of-use" class="link" style="margin-bottom: 0.2rem;">Terms of Use</router-link>
                <router-link to="/privacy-policy" class="link">Privacy Policy</router-link>
            </div>
            <div class="copyright">
                Copyright © 2024 Olympsis Inc. All rights Reserved.
            </div>
        </div>
        <Skeleton v-if="state === VIEW_STATE.LOADING" class="mb-2 container" style="width: 25rem; height: 7rem;"/>
    </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import { VIEW_STATE } from '@/data/Enums';

const props = defineProps<{
    state: VIEW_STATE
}>()

</script>

<style scoped>
#navigation-card-container {
    min-width: 22rem;
    max-height: 7rem;
    background-color: var(--secondary-background-color);
    padding: 1rem 1rem;
    border-radius: 10px;
    flex-direction: column !important;
    justify-content: space-between;

    .routes {
        display: flex;
        flex-direction: column;
        
        .link {
            color: unset;
            font-size: 0.9rem;
            color: var(--primary-label-color);
            font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
        }
    }

    .copyright {
        margin: 1rem 0rem;
        font-size: 0.8rem;
        color: var(--primary-label-color);
        font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
    }
}

@media (max-width: 940px) {
    #navigation-card-container {
        width: unset;
    }
}
</style>