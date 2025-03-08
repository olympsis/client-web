<template>
    <li id="post-list-item">
        <!-- Post Header -->
        <div class="header">
            <!-- User Information -->
            <div class="user-info">
                <UserIcon :user=post.poster :size="2"/>
                <a class="username">{{ post.poster?.username }}</a>
            </div>

            <!-- Options Button -->
            <button type="button" @click="toggle" class="button">
                <picture>
                    <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)"/>
                    <img src="@/assets/icons/ellipsis/ellipsis.svg" class="button-image">
                </picture>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"></Menu>
        </div>
        
        <!-- Post Body -->
        <img v-if="post.images && !imagesFailed" :src="generateImageURL(post.images[0]) ?? undefined" class="image" @error="onImageError"/>
        <div v-if="imagesFailed" class="failed-image">
            <picture>
                <source srcset="@/assets/icons/image/image.white.svg" media="(prefers-color-scheme: dark)"/>
                <img src="@/assets/icons/image/image.svg" class="button-image">
            </picture>
        </div>
    
        <a class="body">{{ post.body }}</a>

        <!-- Post Footer -->
        <div class="footer">
            <a class="timestamp">{{ calculateTimeAgo(post.createdAt ?? 0) }}</a>
            <div class="actions">
                
                <!-- Like Button -->
                <button class="button like" @click="toggleLike">
                    <picture v-if="!isLiked">
                        <source srcset="@/assets/icons/heart/heart.white.svg" media="(prefers-color-scheme: dark)"/>
                        <img src="@/assets/icons/heart/heart.svg" class="button-image">
                    </picture>
                    <img src="@/assets/icons/heart/heart.fill.red.svg" class="button-image" v-else >
                </button>

                <!-- Comment Button -->
                <button class="button comment" @click="emit('comments', { id: post.id })">
                    <picture>
                        <source srcset="@/assets/icons/comment/comment.white.svg" media="(prefers-color-scheme: dark)"/>
                        <img src="@/assets/icons/comment/comment.svg" class="button-image">
                    </picture>
                </button>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Post } from '@/data/models/PostModels';
import { calculateTimeAgo } from '~/utils/time-helpers';
import { generateImageURL } from '~/utils/image-helpers';
import { Like } from '~/data/models/GenericModels';
import { PostService } from '@/data/services/PostService';

import Menu from 'primevue/menu';
import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    post: { type: Post, required: true }
});

const toast = useToast();
const session = useSessionStore();
const emit = defineEmits(['comments', 'report', 'delete']);

const service = new PostService();

let isLiked = ref(false);
let imagesFailed = ref(false);

const onImageError = () => {
    imagesFailed.value = true;
};

const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Report Post',
                icon: 'pi pi-bug',
                command: () => {
                    emit('report', { post: props.post });
                }
            },
            {
                label: 'Delete Post',
                icon: 'pi pi-trash',
                command: () => {
                    handleDeletion()
                }
            }
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};

async function toggleLike() {
    const uuid = session.user?.uuid;
    if (!uuid) { return; }

    const hasLiked = props.post.likes?.find((l) => l.uuid === uuid);
    if (hasLiked) {
        try {
            const un_liked = await service.unLikePost(props.post.id, hasLiked.id);
            if (!un_liked) { return; }

            const idx = props.post.likes?.findIndex((l) => l.id == hasLiked.id);
            if (!idx) { return; }
            props.post.likes?.splice(idx, 1);

            isLiked.value = false;
        } catch(error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove like from post!', life: 3000 });
            console.error(`Failed to remove like from post. Error: ${error}`);
        }
    } else {
        try {
            const id = await service.likePost(props.post.id);
            const like = new Like(
                id,
                uuid,
                new Date().getTime()/1000
            );

            if (props.post.likes) {
                props.post.likes.push(like);
            } else {
                props.post.likes = [like];
            }

            isLiked.value = true;
        } catch(error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to like post!', life: 3000 });
            console.error(`Failed to like post. Error: ${error}`);
        }
    }
};

async function handleDeletion() {
    const deleted = await service.deletePost(props.post.id);
    // TODO: - FIX SERVER SIDE
    emit('delete');
}

onMounted(() => {
    // Handle if user liked post
    const uuid = session.user?.uuid;
    if (!uuid) { return; }
    if (props.post.likes?.find((l) => l.uuid === uuid)) {
        isLiked.value = true;
    }
});

</script>

<style scoped>
#post-list-item {
    width: auto;
    height: auto;
    margin: 0 auto;
    max-width: 42rem;
    border-radius: 16px;
    background-color: var(--secondary-background-color);

    .header {
        display: flex;
        flex-grow: 1;
        padding: 1rem;
        align-items: center;
        justify-content: space-between;

        .user-info {
            display: flex;
            align-items: center;
            
            .username {
                font-size: 1rem;
                margin: 0rem 1rem;
                white-space: nowrap;
                color: var(--primary-label-color);
            }
        }
    }

    .image {
        width: 100%;
        height: auto;
        margin-bottom: 1rem;
    }

    .failed-image {
        display: flex;
        width: 40rem;
        height: 40rem;
        align-items: center;
        margin-bottom: 1rem;
        justify-content: center;
        background-color: var(--tertiary-background-color);
    }

    .body {
        display: flex;
        padding: 0rem 1rem;
        font-size: 1rem;
        color: var(--primary-label-color);
    }

    .footer {
        display: flex;
        padding: 1rem;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;

        .timestamp {
            color: gray;
            font-size: 0.8rem;
        }

        .actions {
            display: flex;
        }
    }

    .button {
        all: unset;
        cursor: pointer;
        margin: 0rem 0.5rem;

        picture {
            display: flex;
            align-items: center;
        }
    }

    .button-image {
        width: 1.5rem;
        height: 1.5rem;
    }
}

</style>