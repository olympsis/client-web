<template>
    <div class="container" :style="{ width: `${size}rem`, height: `${size}rem`}">
        <img v-if="image" class="image" :style="{ width: `${size}rem`, height: `${size}rem`}" :src="logo" />
        <div v-else class="icon">
            <picture v-if="type === 'club'">
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
import { computed } from 'vue';
import { GROUP_TYPE } from '~/data/Enums';
import { generateImageURL } from '~/utils/image-helpers';

const props = defineProps<{
    type: GROUP_TYPE,
    image: string | undefined,
    size: Number | undefined
}>()

const logo = computed(() => {
    if (props.image) {
        return generateImageURL(props.image);
    } else {
        return undefined;
    }
});

</script>

<style scoped>
.container {
    background-color: var(--tertiary-background-color);
    border-radius: 10px;

    .image {
        border-radius: 10px;
    }

    .icon {
        padding: 1rem;
    }
}
</style>