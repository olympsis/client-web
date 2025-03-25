<template>
    <ul id="event-tags-list" @mouseleave="showMore = false">
        <li 
            v-for="tag in tagsFiltered" 
            :class="{ 
                tag: true, 
                full: tag == 'full',
                paid: tag.includes('$'),
                tournament: tag == 'tournament' 
            }"
        >{{ tag }}</li>

        <div id="more" v-if="tags.length > limit && !showMore" @mouseover="showMore = true">{{ `+${tags.length - 3}` }}</div>
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
</script>

<style scoped>
#event-tags-list {
    gap: 0.25rem;
    display: flex;
    padding: unset;
    overflow-y: scroll;
    list-style-type: none;

    .tag {
        color: white;
        font-weight: 500;
        font-size: 0.8rem;
        border-radius: 20px;
        border-radius: 20px;
        white-space: nowrap;
        padding: 0.5rem 1rem;
        border: 1px solid gray;
        text-transform: capitalize;
        backdrop-filter: blur(20px);
        background-blend-mode: hard-light;
        background: rgba(0, 0, 0, 0.56);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .full {
        color: var(--secondary-brand-color);
    }

    .paid {
        color: var(--tertiary-brand-color);
    }

    .tournament {
        color: var(--quaternary-brand-color);
    }

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
        border: 1px solid gray;
        backdrop-filter: blur(20px);
        background: rgba(0, 0, 0, 0.56);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
}
</style>