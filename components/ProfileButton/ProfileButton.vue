<template>
    <div class="wrapper">
        <div v-if="$props.imageURL && !imageFailed">
            <img class= "circular-image" alt="Profile Image" :src="$props.imageURL" @error="handleImageFailure"/>
        </div>
        <div v-else class="default-image">
            <img src="@/assets/icons/person/person.white.svg">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    imageURL: string | undefined
}>()

const imageFailed = ref(false);

function handleImageFailure() {
    imageFailed.value = true;
}

</script>

<style scoped>
.wrapper {
    display: flex;
    min-width: 40px;
    min-height: 40px;
    align-items: center;
    justify-content: center;
}

.circular-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--component-border-color);
}

.default-image {
    display: flex;
    min-width: 40px;
    min-height: 40px;
    object-fit: cover;
    border-radius: 50%;    
    align-items: center;
    justify-content: center;
    background-color: var(--olympsis-light-gray);
    border: 1.5px solid var(--component-border-color);

    img {
        width: 1.3rem;
        height: 1.3rem;
    }
}
</style>