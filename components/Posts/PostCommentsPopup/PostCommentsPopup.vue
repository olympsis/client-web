<template>
    <div id="post-comments-popup" class="popup">
        <div class="header">
            <button class="secondary button" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg"/>
                </picture>
            </button>
        </div>
        
        <ul id="body" class="body">
            <PostCommentListItem
                v-for="comment in comments" 
                :comment="comment" 
                @report="handleCommentReport" 
                @delete="handleCommentDeletion"
            />
        </ul>

        <div id="actions">
            <textarea type="text" v-model="inputText"/>
            <button class="button" @click="handleAddComment(inputText)">
                Comment
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Post } from '~/data/models/PostModels';
import { UserSnippet } from '~/data/models/UserModels';
import { PostService } from '~/data/services/PostService';
import { Comment, CommentDao } from '~/data/models/GenericModels';

import PostCommentListItem from '../PostCommentListItem/PostCommentListItem.vue';

const toast = useToast();
const session = useSessionStore();
const service = new PostService();

const props = defineProps({
    post: { type: Post, required: true }
});

const comments = computed<Comment[]>(() => {
    return props.post?.comments ?? [];
});

const inputText = ref<string>('');

function handleCommentReport(event: any) {
    console.error('REPORTS NOT IMPLEMENTED YET!');
}

async function handleAddComment(text: string) {
    if (text === '') { return; }
    const user = session.user;
    if (!user?.userId) { return; }

    const dao = new CommentDao(
        user.userId,
        text
    );

    try {
        const id = await service.addComment(props.post.id, dao);
        const comment = new Comment(
            id,
            new UserSnippet(user.userId, user.username, user.imageURL),
            text,
            new Date()
        );
        props.post.comments.push(comment);
        inputText.value = '';
    } catch (error) {
        console.error('Failed to create comment! Error: ' + error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add comment!', life: 3000 });
    }
}

async function handleCommentDeletion(event: { id: string }) {
    if (!event.id) { return; }
    const idx = props.post.comments.findIndex((c) => c.id === event.id);
    if (idx === -1) { return };

    try {
        const isDeleted = await service.removeComment(props.post.id, event.id);
        if (!isDeleted) { return; }
        props.post.comments.splice(idx, 1);
    } catch(error) {
        console.error('Failed to remove comment. Error: ' + error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove comment!', life: 3000 });
    }
}

</script>

<style scoped>
#post-comments-popup {
    width: 100%;
    padding: 1rem;
    max-width: 35rem;

    button {
        padding: 0.5rem;
    }

    #body {
        padding: 0;
        width: 100%;
        display: flex;
        margin-top: 1rem;
        min-height: 20rem;
        overflow-y: scroll;
        list-style-type: none;
        flex-direction: column;

        li {
            margin: 0.5rem 0rem;
        }
    }

    #actions {
        width: 100%;
        display: flex;

        textarea {
            width: 100%;
            border: unset;
            min-height: 2rem;
            font-size: 1.25rem;
            margin-right: 1rem;
            border-radius: 10px;
            padding: 0.15rem 0.5rem;
            background-color: var(--secondary-background-color);
        }

        button {
            color: white;
            background-color: var(--primary-brand-color);
        }
    }
}
</style>