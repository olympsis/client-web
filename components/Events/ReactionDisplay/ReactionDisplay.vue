<template>
    <div id="reaction-display" v-if="groupedReactions.length > 0">
        <button
            v-for="group in groupedReactions"
            :key="group.type"
            class="reaction-badge"
            :class="{ 'reaction-badge--active': group.currentUserReactionId !== undefined }"
            @click="handleToggle(group)"
        >
            <span class="reaction-emoji">{{ reactionTypeToEmoji(group.type) }}</span>
            <span class="reaction-count">{{ group.count }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { COMMENT_REACTION_TYPE, reactionTypeToEmoji } from '~/data/Enums';
import type { CommentReaction } from '~/data/models/EventModels';

interface ReactionGroup {
    type: COMMENT_REACTION_TYPE;
    count: number;
    /** If the current user has this reaction, store its ID for removal */
    currentUserReactionId?: string;
}

const props = defineProps({
    reactions: {
        type: Array as PropType<CommentReaction[]>,
        default: () => []
    },
    currentUserId: {
        type: String,
        default: ''
    }
});

const emit = defineEmits<{
    toggle: [payload: { type: COMMENT_REACTION_TYPE; reactionId?: string }]
}>();

/**
 * Groups reactions by type, counts them, and checks if the current user
 * has reacted with each type (to highlight and enable toggle-off).
 */
const groupedReactions = computed<ReactionGroup[]>(() => {
    const groups = new Map<COMMENT_REACTION_TYPE, ReactionGroup>();

    for (const reaction of props.reactions) {
        const existing = groups.get(reaction.type);
        if (existing) {
            existing.count++;
            // Track if the current user has this reaction type
            if (reaction.user?.userId === props.currentUserId) {
                existing.currentUserReactionId = reaction.id;
            }
        } else {
            groups.set(reaction.type, {
                type: reaction.type,
                count: 1,
                currentUserReactionId: reaction.user?.userId === props.currentUserId ? reaction.id : undefined
            });
        }
    }

    return Array.from(groups.values());
});

function handleToggle(group: ReactionGroup) {
    emit('toggle', {
        type: group.type,
        reactionId: group.currentUserReactionId
    });
}
</script>

<style scoped>
#reaction-display {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;

    .reaction-badge {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        border: 1px solid transparent;
        cursor: pointer;
        padding: 0.1rem 0.4rem;
        border-radius: 1rem;
        background-color: var(--secondary-background-color);
        transition: border-color 0.15s ease;

        .reaction-emoji {
            font-size: 0.9rem;
        }

        .reaction-count {
            font-size: 0.8rem;
            color: var(--olympsis-gray);
        }

        &--active {
            border-color: var(--primary-brand-color);

            .reaction-count {
                color: var(--primary-brand-color);
            }
        }

        &:hover {
            background-color: var(--tertiary-background-color, rgba(0, 0, 0, 0.08));
        }
    }
}
</style>
