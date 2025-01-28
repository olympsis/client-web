<template>
    <div id="event-delete-all-modal">
        <div id="header">
            <button class="button" @click="$emit('close')">
                <picture>
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
           
            <div>This is Recurring Event</div>
        </div>
        <div id="body">
            <div id="title"> Would you like to delete all of the recurring events? </div>
            <div class="sub-title">*You will delete all following events.</div>
            <div class="sub-title">*This action cannot be undone.</div>
        </div>
        <div id="footer">
            <TextButton
                text="Yes"
                :model-value="state"
                class="button yes"
                @click="$emit('yes')"
            />
            <button class="button no" @click="$emit('no')">
                No
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '@/data/Enums';

import TextButton from '@/components/Buttons/LoadingButtons/TextButton/TextButton.vue';

const emit = defineEmits([
    'no',
    'yes',
    'close'
]);

const state = ref<VIEW_STATE>(VIEW_STATE.PENDING);
</script>

<style>
#event-delete-all-modal {
    
    max-width: 25rem;
    border-radius: 15px;
    background-color: var(--primary-background-color);

    #header {
        width: 100%;
        display: flex;
        
        align-items: center;
        padding: 0.75rem 0rem;
        justify-content: center;
        border-radius: 15px 15px 0px 0px;
        color: var(--primary-label-color);

        button {
            margin-left: 1rem;
            height: 24px !important;
            background-color: var(--tertiary-background-color);
        }

        div {
            font-size: 0.9rem;
            margin: 0rem auto;
        }
    }

    #body {
        width: 100%;
        display: flex;
        padding: 0rem 1rem;
        margin: 1rem 0rem;
        align-items: start;
        flex-direction: column;
        justify-content: center;

        #title {
            font-weight: bold;
            text-align: center;
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: var(--primary-label-color);
        }

        .sub-title {
            color: gray;
            font-style: italic;
            font-size: 0.75rem;
        }
    }

    #footer {
        width: 100%;
        display: flex;
        padding: 1rem;

        .button {
            width: 100%;
            height: unset;
            border: unset;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            font-size: 1.25rem;
            border-radius: 10px;
        }

        .yes {
            color: white;
            margin-right: 0.5rem;
            background-color: var(--olympsis-red);
        }

        .no {
            margin-left: 0.5rem;
            color: var(--primary-label-color);
            background-color: var(--tertiary-background-color);
        }
    }
}
</style>