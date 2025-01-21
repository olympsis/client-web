<template>
    <div id="bold-text-button-label">
        <div id="text" v-if="model === VIEW_STATE.PENDING">
            {{ text }}
        </div>
        <div v-if="model === VIEW_STATE.LOADING" class="event-status-loader"/>
    </div>
</template>

<script setup lang="ts">
import { VIEW_STATE } from '~/data/Enums';

const model = defineModel({ default: VIEW_STATE.LOADING });
const props = defineProps({ text: { type: String, required: true }});

</script>

<style scoped>
@import url('/assets/css/main.css');

#bold-text-button-label {
    width: 100%;
    display: flex;
    height: 3.5rem;
    border: unset;
    color: white;
    cursor: pointer;
    font-size: 1.3rem;
    font-weight: bold;
    font-style: italic;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    border-radius: var(--button-border-radius);
    background-color: var(--primary-brand-color);
}

/* HTML: <div class="loader"></div> */
.loader {
    width: 2rem;
    height: 2rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background: 
    radial-gradient(farthest-side,white 94%,#0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%,white);
    mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
    animation: l13 1s infinite linear;
}
@keyframes l13{ 
  100%{transform: rotate(1turn)}
}
</style>