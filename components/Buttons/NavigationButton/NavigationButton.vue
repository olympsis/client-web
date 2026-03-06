<template>
    <NuxtLink :to="to" class="navigation-button" :class="variant">
        <!-- Optional icon slot, rendered only if an icon CSS var is provided -->
        <div v-if="icon" class="icon" :style="{ backgroundImage: `var(${icon})` }" />
        <span class="label">{{ text }}</span>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
    /** Route path the button navigates to */
    to: { type: String, required: true },
    /** Button display text */
    text: { type: String, required: true },
    /** CSS variable name for the icon, e.g. '--events-icon' */
    icon: { type: String, default: '' },
    /** Visual variant: 'light' (white bg) or 'dark' (brand bg) */
    variant: { type: String, default: 'light' }
});
</script>

<style scoped>
.navigation-button {
    gap: 0.5rem;
    display: flex;
    cursor: pointer;
    height: 2.25rem;
    width: fit-content;
    align-items: center;
    text-decoration: none;
    border-radius: 0.65rem;
    padding: 0.35rem 1.15rem;
    transition: opacity 0.2s ease;
    border: 1.75px solid var(--olympsis-gray);

    &:hover {
        opacity: 0.8;
    }

    .icon {
        width: 1.5rem;
        height: 1.5rem;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
}

/* Light variant — glass background, white text */
.light {
    color: white;
    border: var(--component-border-color) solid 1px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.12);

    .label {
        font-size: 1rem;
        font-weight: 400;
        color: white;
    }

    /* Force icon white since glass sits on the dark navbar */
    .icon {
        filter: brightness(0) invert(1);
    }
}

/* Dark variant — brand background, white text */
.dark {
    background-color: var(--primary-brand-color);

    .label {
        font-size: 1rem;
        font-weight: 400;
        color: black;
    }
}
</style>
