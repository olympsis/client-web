<template>
    <ul id="tags-filter">
        <li v-for="tag in tags" :class="{ sport: true, selected: model.find((s) => s.name == tag.name) !== undefined }" @click="handleSelectedTag(tag)">
            {{ tag.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { Tag } from '~/data/models/GenericModels';

const session = useSessionStore();

const model = defineModel<Array<Tag>>({ 
    default: [] 
});

const tags = computed<Array<Tag>>(() => {
    return session.tags;
});

function handleSelectedTag(tag: Tag) {
    const index = model.value.findIndex((s) => s === tag)
    if (index !== -1) {
        model.value.splice(index, 1);
    } else {
        model.value.push(tag);
    }
}
</script>

<style scoped>
#tags-filter {
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