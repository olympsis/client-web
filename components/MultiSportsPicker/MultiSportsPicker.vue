<template>
    <ul id="event-sports-picker">
        <li v-for="sport in sports" :class="{ sport: true, selected: model.find((s) => s.name == sport.name) !== undefined }" @click="handleSelectedSport(sport)">
            {{ sport.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { Sport } from '~/data/models/GenericModels';

const props = defineProps({ 
    sports: { type: Array<Sport>, required: true },
    multiSelect: { type: Boolean, default: false } 
});
const model = defineModel<Array<Sport>>({ 
    default: [] 
});

function handleSelectedSport(sport: Sport) {
    if (props.multiSelect) {
        const index = model.value.findIndex((s) => s.name === sport.name)
        if (index !== -1) {
            model.value.splice(index, 1);
        } else {
            model.value.push(sport);
        }
    } else {
        model.value = [sport];
    }
}
</script>

<style scoped>
#event-sports-picker {
    padding: 0;
    width: 100%;
    gap: 0.5rem;
    display: flex;
    padding: 1rem 0rem;
    overflow-y: scroll;
    flex-direction: row;
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