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
        margin: 0.75rem 0rem;
        margin-left: 0.5rem;

        &:hover .link-title {
            text-decoration: underline;
        }
    }

    .icon {
        width: 42px;
        height: 42px;
        flex-shrink: 0;

        img {
            padding: 0.5rem;
            border-radius: 10px;
            border: var(--icon-border-color) solid 1px;
            background-color: var(--secondary-background-color);
        }
    }

    .link-title {
        margin-left: 0.5rem;
        font-weight: 500;
        color: var(--tertiary-brand-color);
    }
}
</style>
