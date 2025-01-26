<template>
    <div id="post-feed">
        <!-- Post List -->
        <ul id="post-list" v-if="state !== VIEW_STATE.LOADING"> 
            <PostListItem 
            v-for="post in posts" 
            :post="post" 
            @comments="handleShowComments"
            @report=""
            @deleted="handleDeletedPost(post.id)"
            />
        </ul>

        <!-- No Posts View -->
        <div 
            v-if="state !== VIEW_STATE.LOADING && (posts?.length == 0 || posts == undefined)" 
            :style="{ 'display': 'flex', 'align-items': 'center', 'margin': '5rem 0rem' }"
        >
            <a style="margin: 0rem auto; color: var(--primary-label-color);"> No Posts </a>
        </div>

        <!-- Failed Post List -->
        <div 
            class="failed" 
            v-if="state === VIEW_STATE.FAILURE"
            :style="{ 'display': 'flex', 'align-items': 'center', 'margin': '5rem 0rem' }"
        >
            <a style="margin: 0rem auto; color: var(--primary-label-color);"> Failed to get posts </a>
        </div>

        <!-- Post Skeleton List -->
        <ul id="post-list" v-if="state === VIEW_STATE.LOADING">
            <PostListItemSkeleton :has-image="false"/>
            <PostListItemSkeleton :has-image="true"/>
            <PostListItemSkeleton :has-image="false"/>
        </ul>
    </div>
    <Dialog 
        ref="post-comments" 
        position="center" 
        blockScroll
        :showHeader="false" 
        v-model:visible="showCommentsDialog"
        :style="{ 'top': '10px', 'max-width': '32rem', 'max-height': '80vh', 'overflow-y': 'hidden'}"
    >
        <template #container="{closeCallback}">
            <PostCommentsPopup v-if="selectedPost" :post="selectedPost" @close="closeCallback"/>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VIEW_STATE } from '@/data/Enums';
import { Post } from '@/data/models/PostModels';
import { useSessionStore } from '@/stores/session-store';
import { useGroupsViewModel } from '@/stores/groups-view-model';

import Dialog from 'primevue/dialog';
import PostCommentsPopup from '../PostCommentsPopup/PostCommentsPopup.vue';
import PostListItem from '@/components/Posts/PostListItem/PostListItem.vue';
import PostListItemSkeleton from '../PostListItem/PostListItemSkeleton.vue';

const session = useSessionStore();
const viewModel = useGroupsViewModel();

const state = computed<VIEW_STATE>(() => {
    return viewModel.state;
});

const posts = computed<Post[]>(() => {
    return viewModel.posts
        .sort((a, b) => b.createdAt - a.createdAt);
});

function handleDeletedPost(id: string) {
    const idx = viewModel.posts.findIndex((p) => p.id === id);
    if (idx !== -1) viewModel.posts.splice(idx, 1);
    viewModel.posts = viewModel.posts;
}

const showCommentsDialog = ref(false);
const selectedPost = ref<Post | undefined>(undefined);

function handleNewPost(post: Post) {
    viewModel.posts.push(post);
}

function handleShowComments(event: { id: string }) {
    const post = posts.value.find((p) => p.id === event.id);
    if (!post) { return; }
    selectedPost.value = post;
    showCommentsDialog.value = true;
}

defineExpose({
    handleNewPost
});

</script>

<style scoped>
#post-feed {
    width: 100%;
    display: flex;
    overflow: visible;
    flex-direction: column;

    #post-list {
        padding: 0;
        list-style-type: none;

        li {
            margin: 1rem auto;
        }

        li:last-child {
            margin-bottom: 10rem;
        }

        #header {
            display: none;
            grid-area: header;
            justify-content: space-between;
            color: var(--primary-label-color);

            h1 {
                font-weight: 900;
            }

            #trailing {
                display: flex;

                #plus {
                    width: 2rem;
                    height: 2rem;
                    cursor: pointer;
                    margin: 0rem 0.5rem;

                    img {
                        width: 2rem;
                        height: 2rem;
                    }
                }

                #chats {
                    width: 2rem;
                    height: 2rem;
                    cursor: pointer;
                    margin: 0rem 0.5rem;
                    margin-top: 0.2rem;

                    img {
                        width: 2rem;
                        height: 2rem;
                    }
                }

                #settings {
                    width: 2rem;
                    height: 2rem;
                    cursor: pointer;
                    margin: 0rem 0.5rem;

                    img {
                        width: 2rem;
                        height: 2rem;
                    }
                }
            }
        }
    }
} 
</style>