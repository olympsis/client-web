<template>
    <ul id="labels-list" @mouseleave="showMore = false">
        <li v-for="tag in tagsFiltered" :key="tag">
            <TabLabel :label="tag" :variant="getVariant(tag)" />
        </li>

        <div id="more" v-if="tags.length > limit && !showMore" @mouseover="showMore = true">{{ `+${tags.length - limit}` }}</div>
    </ul>
</template>

<script setup lang="ts">
const props = defineProps({
    tags: { type: Array<string>, required: true },
    limit: { type: Number, default: 3 }
});

const showMore = ref<boolean>(false);
const tagsFiltered = computed<string[]>(() => {
    return showMore.value ? props.tags : props.tags.slice(0, props.limit);
});

/** Maps a tag string to its TabLabel variant based on content. */
function getVariant(tag: string): 'default' | 'full' | 'paid' | 'waitlist' | 'tournament' {
    if (tag === 'full') return 'full';
    if (tag === 'waitlist') return 'waitlist';
    if (tag.includes('$')) return 'paid';
    if (tag === 'tournament') return 'tournament';
    return 'default';
}
</script>

<style scoped>
#labels-list {
    gap: 0.25rem;
    display: flex;
    padding: unset;
    overflow-y: scroll;
    list-style-type: none;

    #more {
        display: flex;
        padding: 1rem;
        width: 0.8rem;
        height: 0.8rem;
        color: white;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: bold;
        border-radius: 20px;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--component-border-color);
        backdrop-filter: blur(20px);
        background: rgba(0, 0, 0, 0.56);
        -webkit-backdrop-filter: blur(20px);
    }
}
</style>
