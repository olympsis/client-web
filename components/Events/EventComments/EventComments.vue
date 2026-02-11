<template>
    <div id="event-comments">
        <h2>Comments</h2>
        <div id="text-field">
            <textarea placeholder="Add a Comment"/>
            <button>Comment</button>
        </div>
        <ul id="comments">
            <li v-for="comment in comments" class="comment">
                <EventCommentListItem
                    :comment="comment"
                    @addReaction="handleAddReaction"
                    @removeReaction="handleRemoveReaction"
                />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Event, EventComment, CommentReaction } from '~/data/models/EventModels';
import { COMMENT_REACTION_TYPE } from '~/data/Enums';
import { EventService } from '~/data/services/EventService';
import { UserSnippet } from '~/data/models/UserModels';
import EventCommentListItem from '../EventCommentListItem/EventCommentListItem.vue';

const event = defineModel('event', {
    type: Event,
    required: true
});

const session = useSessionStore();
const eventService = new EventService();

const comments = computed<EventComment[]>(() => {
    return event.value.comments;
});

/**
 * Finds a comment in the event's comments array by its ID.
 * Returns undefined if no matching comment exists.
 */
function findComment(commentId: string): EventComment | undefined {
    return event.value.comments.find((c) => c.id === commentId);
}

/**
 * Handles adding a reaction to a comment with optimistic UI:
 * 1. Immediately adds the reaction locally (with a temp ID)
 * 2. Sends the API request
 * 3. On success: updates the temp ID with the real server ID
 * 4. On failure: rolls back the optimistic reaction
 */
async function handleAddReaction(payload: { commentId: string; type: COMMENT_REACTION_TYPE }) {
    const comment = findComment(payload.commentId);
    if (!comment) return;

    const user = session.user;
    if (!user?.uuid) return;

    // Build an optimistic reaction with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticReaction = new CommentReaction(
        tempId,
        payload.type,
        new Date(),
        new UserSnippet(user.uuid, user.firstName, user.lastName, user.username, user.imageURL)
    );

    // Optimistic update: add reaction immediately
    comment.reactions.push(optimisticReaction);

    // Send API request
    const reactionId = await eventService.addCommentReaction(
        comment.eventId,
        payload.commentId,
        payload.type
    );

    if (reactionId) {
        // Replace the temp ID with the real server ID
        optimisticReaction.id = reactionId;
    } else {
        // Rollback: remove the optimistic reaction on failure
        const index = comment.reactions.findIndex((r) => r.id === tempId);
        if (index !== -1) {
            comment.reactions.splice(index, 1);
        }
    }
}

/**
 * Handles removing a reaction from a comment with optimistic UI:
 * 1. Immediately removes the reaction locally
 * 2. Sends the API request
 * 3. On failure: rolls back by re-inserting the removed reaction
 */
async function handleRemoveReaction(payload: { commentId: string; reactionId: string }) {
    const comment = findComment(payload.commentId);
    if (!comment) return;

    // Find and remove the reaction optimistically
    const index = comment.reactions.findIndex((r) => r.id === payload.reactionId);
    if (index === -1) return;

    const removedReaction = comment.reactions[index];
    comment.reactions.splice(index, 1);
    if (!removedReaction) return;

    // Send API request
    const success = await eventService.removeCommentReaction(
        comment.eventId,
        payload.commentId,
        payload.reactionId
    );

    if (!success) {
        // Rollback: re-insert the reaction on failure
        comment.reactions.splice(index, 0, removedReaction);
    }
}
</script>

<style scoped>
#event-comments {
    #text-field {
        width: 100%;
        display: flex;
        margin-top: 0.5rem;
        align-items: center;
        flex-direction: row;

        textarea {
            width: 100%;
            height: 2rem;
            border: unset;
            font-size: 1rem;
            min-height: 2rem;
            margin-right: 1rem;
            border-radius: 20px;
            padding: 0.4rem 0.75rem;
            background-color: var(--secondary-background-color);
        }

        button {
            height: 2rem;
            border: unset;
            color: white;
            font-weight: bold;
            padding: 0rem 1rem;
            border-radius: 20px;
            background-color: var(--primary-brand-color);
        }
    }
}
</style>
