<template>
    <div id="event-rsvp-modal">
        <div id="header">
            <h1>RSVP</h1>

            <button class="button" @click="$emit('close')">
                <picture class="centered">
                    <source srcset="@assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>
        <div id="options">
            <button id="yes" @click="$emit('rsvp', { response: 'yes' })">
                yes!
            </button>
            <button id="maybe" @click="$emit('rsvp', { response: 'maybe' })">
                maybe
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '@/data/models/EventModels';

const props = defineProps({
    event: { type: Event, required: true }
});
</script>

<style scoped>
#event-rsvp-modal {
    width: 20rem;
    border-radius: 20px;
    background-color: var(--secondary-background-color);

    #header {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        justify-content: space-between;

        h1 {
            font-size: 1rem;
            font-weight: normal;
            white-space: nowrap;
            margin: auto;
            color: var(--primary-label-color);
        }

        .button {
            width: 2.5rem;
            height: 2.5rem;
            border: unset;
            cursor: pointer;
            border-radius: 10px;
            background-color: var(--tertiary-background-color);

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    #options {
        display: flex;
        flex-direction: column;

        #yes {
            background-color: var(--primary-brand-color);
        }

        #maybe {
            border-radius: 0px 0px 20px 20px;
            background-color: var(--secondary-brand-color);
        }

        button {
            border: unset;
            color: white;
            height: 4rem;
            cursor: pointer;
            font-size: 1.5rem;
            font-style: italic;
            font-weight: bolder;
            text-transform: uppercase;
        }
    }

    .centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>