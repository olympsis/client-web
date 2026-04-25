<template>
    <div id="reaction-picker">
        <button
            v-for="reactionType in allReactionTypes"
            :key="reactionType"
            class="picker-button"
            :class="{ 'picker-button--disabled': isExcluded(reactionType) }"
            :disabled="isExcluded(reactionType)"
            @click="emit('select', reactionType)"
        >
            {{ reactionTypeToEmoji(reactionType) }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { COMMENT_REACTION_TYPE, reactionTypeToEmoji } from '~/data/Enums';

const props = defineProps({
    /** Reaction types the current user already used — shown as disabled/grayed out */
    excludeTypes: {
        type: Array as PropType<COMMENT_REACTION_TYPE[]>,
        default: () => []
    }
});

const emit = defineEmits<{
    select: [type: COMMENT_REACTION_TYPE]
}>();

/** All available reaction types to display in the picker */
const allReactionTypes = Object.values(COMMENT_REACTION_TYPE);

function isExcluded(type: COMMENT_REACTION_TYPE): boolean {
    return props.excludeTypes.includes(type);
}
</script>

<style scoped>
#reaction-picker {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 1rem;
    background-color: var(--secondary-background-color);

    .picker-button {
        border: unset;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.2rem 0.35rem;
        border-radius: 0.5rem;
        background: transparent;
        transition: background-color 0.15s ease;

        &:hover:not(:disabled) {
            background-color: var(--tertiary-background-color, rgba(0, 0, 0, 0.08));
        }

        /*
           Native CSS nesting parses `&--disabled` as `& --disabled` (a custom
           property type selector), which is invalid. Use the explicit class
           form so the build doesn't warn.
        */
        &.picker-button--disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }
    }
}
</style>
