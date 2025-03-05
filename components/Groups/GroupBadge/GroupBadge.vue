<template>
    <div id="group-badge" :style="{ width: `${size}rem`, height: `${size}rem`}">
        <img v-if="imageURL && !imageFailed" class="image" :style="{ width: `${size}rem`, height: `${size}rem`}" :src="generateImageURL(imageURL ?? '')" @error="imageFailed = true"/>
        <div v-else class="icon" :style="{ height: '24px'}">
            <picture v-if="type === 0" :style="{ height: '24px'}">
                <source srcset="@/assets/icons/group/group.fill.white.svg" media="(prefers-color-scheme: dark)"/>
                <img src="@/assets/icons/group/group.fill.svg" class="action-button">
            </picture>
            <picture v-else>
                <source srcset="@/assets/icons/building/building.white.svg" media="(prefers-color-scheme: dark)"/>
                <img src="@/assets/icons/building/building.svg" class="action-button">
            </picture>
        </div>
    </div>
</template>

<script setup lang="ts">
import { generateImageURL } from '#imports';

defineProps({
    type: { type: Number, required: true },
    imageURL: { type: String, required: false },
    size: { type: Number, required: true },
});

const imageFailed = ref(false);
</script>

<style scoped>
#group-badge {
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    border: var(--olympsis-light-gray) solid 2px;
    background-color: var(--secondary-background-color);

    .image {
        border-radius: 50%;
        border: var(--olympsis-light-gray) solid 2px;
    }
}
</style>