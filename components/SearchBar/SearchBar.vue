<template>
    <div id="search-bar">
        <picture>
            <source srcset="@/assets/icons/search/search.white.svg" media="(prefers-color-scheme: dark)">
            <img src="@/assets/icons/search/search.svg">
        </picture>
        <input type="text" v-model="model">
    </div>
</template>

<script setup lang="ts">
const model = defineModel('value',{ required: true });
</script>

<style scoped>
#search-bar {
    width: 100%;
    display: flex;
    border-radius: 10px;
    align-items: center;
    padding: 0.25rem 0rem;
    background-color: var(--secondary-background-color);

    picture {
        width: 2rem;
        height: 2rem;
        margin: 0rem 1rem;

        img {
            margin-top: 0.25rem;
        }
    }

    input {
        width: 100%;
        height: 1.5rem;
        border: unset;
        font-size: 1.1rem;
        margin-right: 1rem;
        color: var(--primary-label-color);
        background-color: var(--secondary-background-color);
    }
}
</style>