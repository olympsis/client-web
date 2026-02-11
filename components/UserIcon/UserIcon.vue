<template>
    <div id="user-icon" >
        <img 
            v-if="user && image !== undefined && !imageFailed"
            :src="image" 
            class="image" 
            :style="{ width: `${size}rem`, height: `${size}rem`}"
            @error="onImageError"
        />
        <div v-else class="icon"  :style="{ width: `${size}rem`, height: `${size}rem`}">
            <img :style="{ width: `${size}rem`, height: `${size}rem`, borderRadius: '50%'}" src="@/assets/images/default-profile.jpeg" class="action-button">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { UserSnippet } from '@/data/models/UserModels';
import { generateImageURL } from '~/utils/image-helpers';

const props = defineProps<{
    user: UserSnippet | undefined,
    size: number
}>();

const image = computed<string | undefined>(() => {
    if (!props.user?.imageURL) return undefined;
    return generateImageURL(props.user?.imageURL);
});

const imageFailed = ref(false);

const onImageError = () => {
    imageFailed.value = true;
};

</script>

<style scoped>

#user-icon {
    border-radius: 50%;
    height: fit-content;
}

.image {
    object-fit: cover;
    border-radius: 50%;
    background-color: var(--tertiary-background-color);
}
.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--tertiary-background-color);
}
</style>