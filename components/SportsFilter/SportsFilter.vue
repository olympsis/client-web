<template>
    <ul id="sports-filter">
        <li v-for="sport in sports" :class="{ sport: true, selected: model.find((s) => s.name == sport.name) !== undefined }" @click="handleSelectedSport(sport)">
            {{ sport.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { Sport } from '~/data/models/GenericModels';

const session = useSessionStore();

const model = defineModel<Array<Sport>>({ 
    default: [] 
});

const sports = computed<Array<Sport>>(() => {
    const user = session.user;
    if (!user) return session.sports;
    if (!user.sports || user.sports.length === 0) return session.sports;
    
    const userSportsSet = new Set(user.sports);
    
    // Get all sports from enum and sort them
    return session.sports.sort((a, b) => {
        // If user has sport A but not B, A should come first
        if (userSportsSet.has(a.name) && !userSportsSet.has(b.name)) {
            return -1;
        }
        // If user has sport B but not A, B should come first
        if (!userSportsSet.has(a.name) && userSportsSet.has(b.name)) {
            return 1;
        }
        // If both or neither sports are in user's list, maintain original order
        // This is implicitly done by returning 0, which keeps original order
        return 0;
    });
});

function handleSelectedSport(sport: Sport) {
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
    columns: 2;
    width: 100%;
    padding: 1rem 0rem;
    overflow-x: scroll;
    list-style-type: none;
    max-width: var(--desktop-max-width);

    .sport {
        display: flex;
        cursor: pointer;
        align-items: center;
        border-radius: 16px;
        white-space: nowrap;
        margin-bottom: 0.5rem;
        padding: 0.25rem 0.75rem;
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