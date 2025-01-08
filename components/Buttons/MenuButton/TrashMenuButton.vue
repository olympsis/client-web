<template>
    <div id="menu-button" class="destructive">
        <button v-if="state === VIEW_STATE.PENDING" id="button" @click="$emit('click')">
            <img id="icon" src="@/assets/icons/trash/trash.white.svg">
            <div class="text"> {{ text }} </div>
        </button>
        <div v-else id="button-loading">
            <div v-if="state === VIEW_STATE.LOADING" class="bar-loader" :class="{ destructive: isDestructive }"></div>
            <div v-if="state === VIEW_STATE.SUCCESS" class="text">{{ successText }}</div>
            <div v-if="state === VIEW_STATE.FAILED" class="text">{{ failureText }}</div>
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
    background-color: #D6D6D6;

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
        background-color: var(--olympsis-red);

        .text {
            color: white;
        }
    }
}
</style>