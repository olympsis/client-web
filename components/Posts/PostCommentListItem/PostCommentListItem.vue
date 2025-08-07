<template>
    <li id="post-comment-list-item">
        <UserIcon :user="comment.user" :size="2.5"/>
        <div id="body">
            <div id="header">
                <div id="username">
                    {{ comment.user?.username ?? 'olympsis-user'}}
                </div>
                <div id="timestamp">
                    {{ calculateTimeAgo(comment.createdAt, false) }}
                </div>
            </div>
            <div id="content">
                <div id="text">
                    {{ comment.text }}
                </div>
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
import { Comment } from '~/data/models/GenericModels';
import UserIcon from '~/components/UserIcon/UserIcon.vue';

const props = defineProps({
    comment: { type: Comment, required: true }
});

const session = useSessionStore();
const emit = defineEmits(['report', 'delete']);
const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Report Comment',
                icon: 'pi pi-bug',
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

onMounted(() => {
    const user = session.user;
    if (user && user.uuid) {
        if (props.comment.user?.uuid === user.uuid) {
            items.value = [
                {
                    label: 'Options',
                    items: [
                        {
                            label: 'Report Comment',
                            icon: 'pi pi-bug',
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
            ]
        }
    }
});
</script>

<style scoped>
#post-comment-list-item {
    width: 100%;
    display: flex;

    #body {
        margin: 0rem 0.5rem;

        #header {
            display: flex;

            #username {
                font-size: 0.9rem;
                font-weight: bold;
                margin-bottom: 0.15rem;
                color: var(--olympsis-gray);
            }

            #timestamp {
                font-size: 0.8rem;
                font-weight: bold;
                margin: 0rem 1rem;
                color: var(--olympsis-gray);
            }
        }

        #content {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            #text {
                text-align: left;
                font-size: 0.95rem;
            }
        }
    }

    #footer {
        margin-left: auto;
        button {
            width: 2rem;
            height: 1rem;
            border: unset;
            cursor: pointer;
            background: unset;
        }
    }
}
</style>