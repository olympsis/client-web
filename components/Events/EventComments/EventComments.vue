<template>
    <div id="event-comments">
        <h2>Comments</h2>
        <div id="text-field">
            <textarea
                v-model="commentText"
                placeholder="Add a Comment"
                maxlength="1000"
                rows="1"
                @input="autoResize"
            />
            <button @click="addComment" :style="{ cursor: 'pointer' }">Comment</button>
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
import { ref } from 'vue';
import { COMMENT_REACTION_TYPE } from '~/data/Enums';
import { UserSnippet } from '~/data/models/UserModels';
import { EventService } from '~/data/services/EventService';
import { Event, EventComment, CommentReaction } from '~/data/models/EventModels';

import EventCommentListItem from '../EventCommentListItem/EventCommentListItem.vue';

const event = defineModel('event', {
    type: Event,
    required: true
});

const commentText = ref('');

const session = useSessionStore();
const eventService = new EventService();

/**
 * Auto-resizes the textarea to fit its content.
 * Resets height to auto first so it can shrink when text is deleted,
 * then sets it to scrollHeight to match the actual content height.
 */
function autoResize(e: InputEvent) {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Adds a new comment to the event with optimistic UI:
 * 1. Immediately adds the comment locally (with a temp ID)
 * 2. Clears the textarea and resets its height
 * 3. Sends the API request
 * 4. On success: updates the temp ID with the real server ID
 * 5. On failure: rolls back the optimistic comment
 */
async function addComment() {
    const text = commentText.value.trim();
    if (!text) return;

    const user = session.user;
    if (!user?.uuid) return;

    const eventId = event.value.id;

    // Build an optimistic comment with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = new EventComment(
        tempId,
        text,
        eventId,
        new Date(),
        undefined,// new UserSnippet(user.uuid, user.firstName, user.lastName, user.username, user.imageURL),
        []
    );

    // Optimistic update: add comment immediately and clear the input
    event.value.comments.push(optimisticComment);
    commentText.value = '';

    // Send API request
    const commentId = await eventService.addComment(eventId, text);

    if (commentId) {
        // Replace the temp ID with the real server ID
        optimisticComment.id = commentId;
    } else {
        // Rollback: remove the optimistic comment on failure
        const index = event.value.comments.findIndex((c) => c.id === tempId);
        if (index !== -1) {
            event.value.comments.splice(index, 1);
        }
    }
}

const comments = computed<EventComment[]>(() => {
    return [...event.value.comments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
    grid-area: comments;
    #text-field {
        width: 100%;
        display: flex;
        margin-top: 0.5rem;
        align-items: center;
        flex-direction: row;

        textarea {
            width: 100%;
            resize: none;
            border: var(--component-border-color) solid 1px;
            overflow: hidden;
            font-size: 0.8rem;
            line-height: 1.2rem;
            margin-right: 1rem;
            border-radius: 20px;
            padding: 0.4rem 0.75rem;
            color: inherit;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.35);
        }

        button {
            height: 2rem;
            color: white;
            font-weight: bold;
            padding: 0rem 1rem;
            border-radius: 20px;
            border: var(--component-border-color) solid 1px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(38, 46, 87, 0.85); /* --primary-brand-color at 0.85 opacity */
        }
    }

    #comments {
        padding: 0.5rem 0rem;
        list-style-type: none;

        li {
            margin: 1rem 0.5rem;
        }
    }
}
</style>
