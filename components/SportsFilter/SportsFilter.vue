<template>
    <ul id="sports-filter">
        <li v-for="sport in sports" :class="{ sport: true, selected: model.find((s) => s == sport) !== undefined }" @click="handleSelectedSport(sport)">
            {{ sport }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { SPORTS } from '@/data/Enums';

const session = useSessionStore();

const model = defineModel<Array<SPORTS>>({ 
    default: [] 
});

const sports = computed<Array<SPORTS>>(() => {
    const user = session.user;
    if (!user) return Object.values(SPORTS);
    if (!user.sports || user.sports.length === 0) return Object.values(SPORTS);
    
    const userSportsSet = new Set(user.sports);
    
    // Get all sports from enum and sort them
    return Object.values(SPORTS).sort((a, b) => {
        // If user has sport A but not B, A should come first
        if (userSportsSet.has(a) && !userSportsSet.has(b)) {
            return -1;
        }
        // If user has sport B but not A, B should come first
        if (!userSportsSet.has(a) && userSportsSet.has(b)) {
            return 1;
        }
        // If both or neither sports are in user's list, maintain original order
        // This is implicitly done by returning 0, which keeps original order
        return 0;
    });
});

function handleSelectedSport(sport: SPORTS) {
    const index = model.value.findIndex((s) => s === sport)
    if (index !== -1) {
        model.value.splice(index, 1);
    } else {
        model.value.push(sport);
    }
}
</script>

<style scoped>
#sports-filter {
    gap: 1rem;
    padding: 0;
    width: 100%;
    display: flex;
    padding: 1rem 0rem;
    overflow-x: scroll;
    flex-direction: row;
    list-style-type: none;
    max-width: var(--desktop-max-width);

    .sport {
        display: flex;
        cursor: pointer;
        align-items: center;
        border-radius: 16px;
        padding: 0.15rem 1rem;
        justify-content: center;
        text-transform: capitalize;
        border: var(--component-border) solid 1px;
        background-color: var(--secondary-background-color);
    }

    .selected {
        border: var(--secondary-brand-color) solid 1px;
    }
    
}
</style>