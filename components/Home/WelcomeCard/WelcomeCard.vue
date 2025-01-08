<template>
    <div>
        <div v-if="state != VIEW_STATE.LOADING" class="container">
            <h1> Welcome Back{{$props.name}}, </h1>
            <h2> ready to play?</h2>
        </div>
        <Skeleton v-if="state === VIEW_STATE.LOADING" class="mb-2 container" borderRadius="10px" style="width: 25rem; height: 12rem;"></Skeleton>
    </div>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import { VIEW_STATE } from '~/data/Enums';

const props = defineProps<{
    name: string | undefined,
    state: VIEW_STATE
}>();

</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
    height: 12rem;
    padding: 2rem 2rem;
    flex-direction: column !important;
    justify-content: unset !important;;
    background-color: var(--secondary-background-color);
    border-radius: 10px;
}
h1 {
    font-weight: 300;
    font-size: 1.8rem;
    color: var(--primary-label-color);
    font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
}
h2 {
    color: gray;
    font-weight: 200;
    font-size: 1.6rem;
    font-family: 'Helvetica Nue', 'Arial', 'Roboto', sans-serif;
}

@media (max-width: 1280px) {
    .container {
        width: unset;
    }
}

@media (max-width: 675px) {
    .container {
        margin: 0rem 1rem;
    }
}

@media (max-width: 430px) {
    .container {
        width: unset;
        height: 10rem;
        padding: 2rm 1.5rem;
    }
}
</style>