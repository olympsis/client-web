<template>
    <div id="event-rsvp-modal">
        <div id="header">
            <h1>RSVP</h1>

            <button class="button" @click="$emit('close')">
                <picture class="centered">
                    <source srcset="@/assets/icons/xmark/xmark.white.svg" media="(prefers-color-scheme: dark)">
                    <img src="@/assets/icons/xmark/xmark.svg">
                </picture>
            </button>
        </div>
        <div id="options">
            <button id="yes" @click="$emit('rsvp', { response: 'yes', hide: hideRSVP })">
                i'm in!
            </button>
            <button id="maybe" @click="$emit('rsvp', { response: 'maybe', hide: hideRSVP })">
                maybe
            </button>
        </div>
        <div id="anonymous">
            <div id="content">
                <div id="title" :style="{ color: isDarkBackground ? '#FFFFFF' : '#000000' }">
                    Hide my RSVP
                </div>
                <div id="sub-title" :style="{ color: isDarkBackground ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }">
                    Keep your attendance private from others.
                </div>
            </div>
            <Toggle v-model:checked="hideRSVP"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Event } from '@/data/models/EventModels';
import Toggle from '~/components/Toggle/Toggle.vue';

const props = defineProps({
    event: { type: Event, required: true },
    isDarkBackground: { type: Boolean, default: true }
});

const hideRSVP = ref(false);
</script>

<style scoped>
#event-rsvp-modal {
    min-width: 20rem;
    max-width: 25rem;
    border-radius: 20px;
    background-color: var(--secondary-background-color);

    #header {
        display: flex;
        padding: 0.5rem;
        align-items: center;
        justify-content: space-between;

        h1 {
            font-size: 1rem;
            font-weight: normal;
            white-space: nowrap;
            margin: auto;
            color: var(--primary-label-color);
        }

        .button {
            width: 1.5rem;
            height: 1.5rem;
            cursor: pointer;
            border-radius: 10px;
            border: var(--component-border) solid 1px;
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

    #anonymous {
        display: flex;
        padding: 1rem;
        align-items: center;
        justify-content: space-between;

        #title {
            font-weight: 500;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }

        #sub-title {
            color: gray;
            font-size: 0.85rem;
            margin-right: 0.5rem;
        }
    }
}
</style>