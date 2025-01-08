<template>
    <div id="message-bubble" :class="{ isUser: props.isUser }">
        <UserIcon :user="undefined" :size="2"/>
        <div id="message-content">
            <div id="sender">{{ username }}</div>
            <div id="text">{{ message?.body }}</div>
        </div>    
    </div>
</template>

<script setup lang="ts">

import { computed, type ComputedRef, ref, type Ref } from 'vue';
import { ChatMessage } from '@/data/models/ChatModels';
import { UserSnippet } from '@/data/models/UserModels';

import UserIcon from '@/components/UserIcon/UserIcon.vue';

const props = defineProps({
    isUser: Boolean,
    message: ChatMessage
});

const user: Ref<UserSnippet | undefined> = ref(undefined);
const username: ComputedRef<string> = computed(() => {
    return user.value?.username ?? 'olympsis-user';
});

</script>

<style scoped>
#message-bubble {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    &.isUser {
        flex-flow: row-reverse;
        
        #message-content {
            #sender {
                display: none;
            }
            
            #text {
                max-width: 60vw;
                color: white;
                margin-left: auto;
                width: fit-content;
                margin-right: 0.5rem;
                background-color: var(--primary-brand-color);
            }
        }
    }

    #message-content {
        display: flex;
        flex-direction: column;

        #sender {
            color: gray;
            font-size: 0.6rem;
            margin-left: 1rem;
            margin-bottom: 0.25rem;
        }

        #text {
            max-width: 60vw;
            width: fit-content;
            margin-right: auto;
            margin-left: 0.5rem;
            padding: 0.5rem 0.75rem;
            color: var(--primary-label-color);
            border-radius: var(--button-border-radius);
            background-color: var(--secondary-background-color);
        }
    }
}
</style>