<template>
    <ul id="multi-tags-picker">
        <li v-for="tag in tags" :class="{ selected: model.find((s) => s.name == tag.name) !== undefined }" @click="handleSelectedTag(tag)">
            {{ tag.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { Tag } from '~/data/models/GenericModels';

const props = defineProps({ 
    tags: { type: Array<Tag>, required: true },
    multiSelect: { type: Boolean, default: true } 
});
const model = defineModel<Array<Tag>>({ 
    default: [] 
});

function handleSelectedTag(tag: Tag) {
    if (props.multiSelect) {
        const index = model.value.findIndex((t) => t.name === tag.name)
        if (index !== -1) {
            model.value.splice(index, 1);
        } else {
            model.value.push(tag);
        }
    } else {
        model.value = [tag];
    }
}
</script>

<style scoped>
#multi-tags-picker {
    gap: 0.5rem;
    display: flex;
    padding: 1rem 0rem;
    overflow-x: auto;
    flex-direction: row;
    list-style-type: none;
    margin-bottom: 0.5rem;

    li {
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