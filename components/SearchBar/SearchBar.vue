<template>
    <div id="search-bar">
        <picture>
            <source srcset="@/assets/icons/search/search.white.svg" media="(prefers-color-scheme: dark)">
            <img src="@/assets/icons/search/search.svg">
        </picture>
        <input type="text" v-model="model" :placeholder="placeholder ?? $t('common.searchPlaceholder')">
    </div>
</template>

<script setup lang="ts">
const model = defineModel('value',{ required: true });
const { placeholder } = defineProps<{ placeholder?: string }>();
</script>

<style scoped>
#search-bar {
    width: 100%;
    display: flex;
    min-width: 0; /* Allow shrinking inside flex containers */
    border-radius: 20px;
    align-items: center;
    padding: 0.25rem 0rem;
    border: 1px solid var(--component-border);
    background-color: var(--secondary-background-color);
    transition: border-color 0.2s ease;

    /* Focus styling when input inside is focused */
    &:focus-within {
        outline: none;
        border-color: var(--quaternary-brand-color); /* Blue border - adjust to your preferred color */
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--quaternary-brand-color) 10%, transparent);
    }

    picture {
        width: 2rem;
        height: 2rem;
        flex-shrink: 0; /* Keep icon from collapsing */
        margin: 0rem 1rem;

        img {
            margin-top: 0.25rem;
        }
    }

    input {
        width: 100%;
        min-width: 0; /* Override intrinsic input size so it can shrink */
        height: 1.5rem;
        border: unset;
        font-size: 1.1rem;
        margin-right: 1rem;
        color: var(--primary-label-color);
        background-color: inherit;

        /* Remove default focus styling from input */
        &:focus {
            outline: none;
        }
    }
}
</style>