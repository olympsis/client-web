<template>
    <div class="wrapper" :class="{ selected: isSelected }" >
        <img :src="`/images/sports/${sport.valueOf()}/${sport.valueOf()}.svg`"
        />
        {{ sportToString(sport) }}
    </div>
</template>

<script setup lang="ts">

import type { PropType } from 'vue';
import { SPORTS, sportToString } from '@/data/Enums';

const props = defineProps({
    sport: { type: String as PropType<SPORTS>, required: true },
    isSelected: { type: Boolean, required: false }
});
</script>

<style scoped>
.wrapper {
    width: 5rem;
    height: 5rem;
    display: flex;
    cursor: pointer;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-transform: capitalize;

    font-size: 0.5rem;
    border-radius: 50%;
    text-transform: uppercase;
    margin: 0.25rem 0.5rem;
    color: var(--primary-label-color);
    background-color: var(--tertiary-background-color);
    border: 0.2rem solid var(--tertiary-background-color);

    img {
        size: 0.2rem;
        height: 1.5rem;
        width: 1.5rem;
    }
}

.selected {
    border: 0.2rem solid var(--secondary-brand-color);
}
</style>