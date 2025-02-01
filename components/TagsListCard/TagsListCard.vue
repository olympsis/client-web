<template>
    <!-- Title -->
    <h1> Tags </h1>
    <small>Use tags to refine your club search and discover the perfect fit for you.</small>

    <!-- Body -->
    <div id="tags-container">
        <ul id="tags-list">
            <div :style="{ 'margin-top': '1rem' }"/>
            
            <li class="tag" v-for="tag in tags">
                <div class="button" :class="{ 'selected-button': isSelected(tag) }" @click="toggleTagSelection(tag)" />
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
    "Beginner",
    "Amateur",
    "Experienced",
    "Competitive",
    "Men Only",
    "Women Only",
    "Sunday League"
]);

const selectedTags: Ref<Array<string>> = ref([]);

function toggleTagSelection(tag: string) {
    const index = selectedTags.value.findIndex((t) => { return t === tag });
    if (index !== -1) {
        selectedTags.value.splice(index, 1)
        emits('selectedChanged', { selectedTags: selectedTags.value })
    } else {
        selectedTags.value.push(tag);
        emits('selectedChanged', { selectedTags: selectedTags.value })
    }
}

function isSelected(tag: string) : boolean {
    const found = selectedTags.value.find((t) => { return t === tag });
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

#tags-container {
    height: 12rem;
    grid-area: tags;
    min-width: 22rem;
    margin-top: 0.5rem;
    border-radius: 10px;
    padding-right: 0.25rem;
    background-color: var(--secondary-background-color);

    #tags-list {
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
            cursor: pointer;
            border-radius: 50%;
            border: 1px solid var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }

        .selected-button {
            margin: 1rem;
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