<template>
    <!-- Title -->
    <h1> Sports </h1>
    <small>Filter clubs by selecting specific sports to find the ones that match your interests.</small>

    <!-- Body -->
    <div id="container">
        <ul id="list">
            <div :style="{ 'margin-top': '1rem' }"/>
            
            <li class="tag" v-for="tag in tags">
                <div class="button" :class="{ 'selected-button': isSelected(tag) }" @click="toggleSportSelection(tag)" />
                {{ tag }}
            </li>

            <div :style="{ 'margin-bottom': '1rem' }"/>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

const emits = defineEmits(['selectedChanged']);
const tags: Ref<Array<string>> = ref([
    "Soccer",
    "Running",
    "Tennis",
    "Cycling",
    "Volleyball",
    "Golf",
    "Pickleball",
    "Basketball"
]);

const selectedSports: Ref<Array<string>> = ref([]);

function toggleSportSelection(tag: string) {
    const index = selectedSports.value.findIndex((t) => { return t === tag.toLowerCase() });
    if (index !== -1) {
        selectedSports.value.splice(index, 1)
        emits('selectedChanged', { selectedSports: selectedSports.value })
    } else {
        selectedSports.value.push(tag.toLowerCase());
        emits('selectedChanged', { selectedSports: selectedSports.value })
    }
}

function isSelected(tag: string) : boolean {
    const found = selectedSports.value.find((t) => { return t === tag.toLowerCase() });
    return found ? true : false
}

</script>

<style scoped>
h1 {
    font-size: 1.5rem;
    color: var(--primary-label-color);
}
small {
    color: gray;
}

#container {
    height: 12rem;
    min-width: 22rem;
    margin-top: 0.5rem;
    border-radius: 10px;
    padding-right: 0.25rem;
    background-color: var(--secondary-background-color);

    #list {
        width: 100%;
        height: 12rem;
        overflow-y: scroll;
        list-style-type: none;
        padding: 0;
    }

    .tag {
        display: flex;
        margin: 0.25rem 1rem;
        font-size: 1.1rem;
        align-items: center;
        color: var(--primary-label-color);

        .button {
            margin: 1rem;
            width: 1.2rem;
            height: 1.2rem;
            cursor: pointer;
            border-radius: 50%;
            border: 1px solid var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        .selected-button {
            margin: 1rem;
            width: 1.2rem;
            height: 1.2rem;
            cursor: pointer;
            border-radius: 50%;
            background-color: var(--secondary-brand-color);
        }

        input {
            width: 1rem;
            height: 1rem;
            margin: 1rem;
        }
    }
}
</style>