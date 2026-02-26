<template>
    <div id="event-external-links">
        <div v-for="(link, index) in links" :key="index" class="link-item" @click="openLink(link.url)">
            <!-- Link icon with dark mode support -->
            <picture class="icon">
                <source srcset="@/assets/icons/link/link.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/link/link.svg">
            </picture>

            <div class="link-title">{{ link.title }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventLink } from '~/data/models/EventModels';

defineProps({
    links: { type: Array<EventLink>, required: true }
});

function openLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
#event-external-links {
    grid-area: links;
    .link-item {
        display: flex;
        cursor: pointer;
        align-items: center;
        margin: 0.5rem 0rem;
        margin-left: 0.5rem;

        &:hover .link-title {
            text-decoration: underline;
        }
    }

    .icon {
        display: flex;
        padding: 0.25rem 0.60rem;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        border: var(--component-border-color) solid 1px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.12);
    }

    .link-title {
        margin-left: 0.5rem;
        font-weight: 500;
        color: var(--tertiary-brand-color);
    }
}
</style>
