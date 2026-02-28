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
    overflow-x: auto;
    flex-direction: row;
    list-style-type: none;
    max-width: var(--desktop-max-width);

    .sport {
        display: flex;
        cursor: pointer;
        align-items: center;
        border-radius: 20px;
        white-space: nowrap;
        padding: 0.35rem 0.85rem;
        justify-content: center;
        text-transform: capitalize;
        color: var(--primary-label-color);
        border: var(--component-border) solid 1px;
        background-color: var(--secondary-background-color);

        &:not(.selected):hover {
            background-color: var(--tertiary-background-color);
        }
    }

    .selected {
        color: white;
        border-color: var(--primary-brand-color);
        background-color: var(--primary-brand-color);
    }

}
</style>