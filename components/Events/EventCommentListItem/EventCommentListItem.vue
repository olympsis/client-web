<template>
    <li id="event-comment-list-item">
        <UserIcon :user="comment.user" :size="2.5"/>
        <div id="body">
            <div id="header">
                <div id="full-name">{{ fullName }}</div>
                <div id="timestamp">{{ calculateTimeAgo(comment.createdAt, true) }}</div>
            </div>
            <div id="content">
                <div id="text">{{ comment.text }}</div>
            </div>
            <div id="reactions">
                <!-- Grouped reaction badges (e.g. 👍 3) — click to toggle off your own -->
                <ReactionDisplay
                    :reactions="comment.reactions"
                    :currentUserId="currentUserId"
                    @toggle="handleReactionToggle"
                />
                <!-- Smiley button to open/close the emoji picker -->
                <button class="reaction-button" @click="showPicker = !showPicker">
                    <span class="reaction-icon">&#9786;</span>
                </button>
                <!-- Horizontal emoji picker row — hidden by default -->
                <ReactionPicker
                    v-if="showPicker"
                    :excludeTypes="currentUserReactionTypes"
                    @select="handleReactionSelect"
                />
            </div>
        </div>
        <div id="footer">
            <button id="menu-button" @click="toggle">
                <picture>
                    <source srcset="@/assets/icons/ellipsis/ellipsis.white.svg" media="(prefers-color-scheme: dark)"/>
                    <img src="@/assets/icons/ellipsis/ellipsis.svg"/>
                </picture>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"></Menu>
        </div>
    </li>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu';
import { EventComment } from '~/data/models/EventModels';
import { COMMENT_REACTION_TYPE } from '~/data/Enums';
import UserIcon from '~/components/UserIcon/UserIcon.vue';
import ReactionDisplay from '~/components/Events/ReactionDisplay/ReactionDisplay.vue';
import ReactionPicker from '~/components/Events/ReactionPicker/ReactionPicker.vue';
import { calculateTimeAgo } from '~/utils/time-helpers';

const props = defineProps({
    comment: { type: EventComment, required: true }
});

const session = useSessionStore();
const emit = defineEmits(['report', 'delete', 'addReaction', 'removeReaction']);
const menu = ref();
const showPicker = ref(false);

/** Current user's ID for highlighting their reactions */
const currentUserId = computed<string>(() => {
    return session.user?.userId ?? '';
});

/**
 * Reaction types the current user has already used on this comment.
 * Used to disable those types in the picker (one-per-type enforcement).
 */
const currentUserReactionTypes = computed<COMMENT_REACTION_TYPE[]>(() => {
    const userId = currentUserId.value;
    if (!userId) return [];
    return props.comment.reactions
        .filter((r) => r.user?.userId === userId)
        .map((r) => r.type);
});

/** When a user picks a new reaction from the emoji picker */
function handleReactionSelect(type: COMMENT_REACTION_TYPE) {
    showPicker.value = false;
    emit('addReaction', { commentId: props.comment.id, type });
}

/**
 * When a user clicks a reaction badge in the display:
 * - If they have that reaction already (reactionId present), emit removeReaction
 * - If they don't have it, emit addReaction
 */
function handleReactionToggle(payload: { type: COMMENT_REACTION_TYPE; reactionId?: string }) {
    if (payload.reactionId) {
        emit('removeReaction', { commentId: props.comment.id, reactionId: payload.reactionId });
    } else {
        emit('addReaction', { commentId: props.comment.id, type: payload.type });
    }
}

const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Report Comment',
                icon: 'pi pi-flag',
                command: () => {
                    emit('report', { comment: props.comment });
                }
            }
        ]
    }
]);

const toggle = (event: any) => {
    menu.value.toggle(event);
};

/**
 * Displays the commenter's full name, falling back to "Olympsis User"
 * if the user snippet is missing (e.g. deleted account).
 */
const fullName = computed<string>(() => {
    const user = props.comment.user;
    if (!user) return 'Olympsis User';
    const first = user.firstName ?? 'Olympsis';
    const last = user.lastName ?? 'User';
    return `${first} ${last}`;
});

/**
 * On mount, check if the current user owns this comment.
 * If so, add a "Delete Comment" option to the menu.
 */
onMounted(() => {
    const user = session.user;
    if (user && user.userId) {
        if (props.comment.user?.userId === user.userId) {
            items.value = [
                {
                    label: 'Options',
                    items: [
                        {
                            label: 'Report Comment',
                            icon: 'pi pi-flag',
                            command: () => {
                                emit('report', { comment: props.comment });
                            }
                        },
                        {
                            label: 'Delete Comment',
                            icon: 'pi pi-trash',
                            command: () => {
                                emit('delete', { id: props.comment.id });
                            }
                        }
                    ]
                }
            ];
        }
    }
});
</script>

<style scoped>
#event-comment-list-item {
    width: 100%;
    display: flex;
    list-style-type: none;
    align-items: flex-start;

    #body {
        margin: 0rem 0.5rem;
        flex: 1;

        #header {
            display: flex;
            align-items: center;

            #full-name {
                font-size: 0.95rem;
                font-weight: bold;
                color: var(--primary-label-color);
            }

            #timestamp {
                font-size: 0.8rem;
                margin-left: 0.5rem;
                color: var(--olympsis-gray);
            }
        }

        #content {
            margin-top: 0.15rem;

            #text {
                text-align: left;
                font-size: 0.95rem;
                color: var(--primary-label-color);
            }
        }

        #reactions {
            margin-top: 0.35rem;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.35rem;

            .reaction-button {
                border: unset;
                cursor: pointer;
                padding: 0.15rem 0.4rem;
                border-radius: 1rem;
                background-color: var(--secondary-background-color);

                .reaction-icon {
                    font-size: 1rem;
                }
            }
        }
    }

    #footer {
        margin-left: auto;

        #menu-button {
            border: unset;
            cursor: pointer;
            background: unset;

            img {
                width: 2rem;
                height: 1rem;
            }
        }
    }
}
</style>
