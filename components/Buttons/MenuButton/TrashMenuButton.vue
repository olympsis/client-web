<template>
    <div id="menu-button" class="destructive">
        <button v-if="state === VIEW_STATE.PENDING" id="button" @click="$emit('click')">
            <img id="icon" src="@/assets/icons/trash/trash.white.svg">
            <div class="text"> {{ text }} </div>
        </button>
        <div v-else id="button-loading">
            <div v-if="state === VIEW_STATE.LOADING" class="bar-loader" :class="{ destructive: isDestructive }"></div>
            <div v-if="state === VIEW_STATE.SUCCESS" class="text">{{ successText }}</div>
            <div v-if="state === VIEW_STATE.FAILURE" class="text">{{ failureText }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';

withDefaults(defineProps<{
    text: string,
    successText?: string,
    failureText?: string,
    isDestructive?: boolean
}>(), {
    successText: 'Success',
    failureText: 'Failed',
    isDestructive: false
});

const state = defineModel<VIEW_STATE>(
    { default: VIEW_STATE.PENDING }
);

const emits = defineEmits(
    [
        'click'
    ]
);

</script>
<style scoped>
#menu-button {
    height: 2.5rem;
    border-radius: 10px;

    /* Glassmorphism */
    background: rgba(243, 242, 239, 0.40);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: var(--component-border) solid 1px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    &:hover {
        transform: scale(1.025);
    }

    #button {
        width: 100%;
        height: 100%;
        display: flex;
        border: unset;
        cursor: pointer;
        align-items: center;
        border-radius: 10px;
        background-color: unset;

        #icon {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0rem 0.5rem;
        }
    }

    .text {
        color: black;
        font-size: 0.95rem;
    }

    #button-loading {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    &.destructive {
        /* Red-tinted glass for destructive actions */
        background: rgba(195, 43, 66, 0.65);

        .text {
            color: white;
        }
    }
}

/* Dark-mode glass tint */
@media (prefers-color-scheme: dark) {
    #menu-button {
        background: rgba(0, 0, 0, 0.60);

        .text {
            color: white;
        }

        &.destructive {
            background: rgba(195, 43, 66, 0.65);
        }
    }
}
</style>