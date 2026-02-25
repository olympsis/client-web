<template>
    <div :class="['tab-label', variant]">{{ label }}</div>
</template>

<script setup lang="ts">
/**
 * TabLabel - A pill-shaped label component with variant styling.
 *
 * Variants control the background color:
 * - "default": dark translucent background, white text
 * - "full": red background (--secondary-brand-color), white text
 * - "paid": gold background (--tertiary-brand-color), white text
 * - "waitlist": gold background (--tertiary-brand-color), white text
 * - "tournament": teal background (--quaternary-brand-color), dark text
 */
defineProps({
    label: { type: String, required: true },
    variant: {
        type: String as () => 'default' | 'full' | 'paid' | 'waitlist' | 'tournament',
        default: 'default'
    }
})
</script>

<style scoped>
.tab-label {
    color: white;
    font-weight: 500;
    font-size: 0.8rem;
    border-radius: 20px;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    border: 1px solid var(--component-border-color);
    text-transform: capitalize;
    backdrop-filter: blur(20px);
    background-blend-mode: hard-light;
    background: rgba(0, 0, 0, 0.60);
    -webkit-backdrop-filter: blur(20px);
}

.tab-label.full {
    background: var(--secondary-brand-color);
}

.tab-label.paid {
    background: var(--tertiary-brand-color);
}

.tab-label.waitlist {
    background: var(--tertiary-brand-color);
}

.tab-label.tournament {
    color: black;
    background: var(--quaternary-brand-color);
}
</style>
