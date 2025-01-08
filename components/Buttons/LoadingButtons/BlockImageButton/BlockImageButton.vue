<template>
    <div id="bold-text-button-label">
        <div id="button" v-if="model === VIEW_STATE.PENDING" :class="{ primary: isPrimary, destructive: isDestructive }">
            <img :src="imageSrc">
            <p>{{ text }}</p>
        </div>
        <div class="loader" v-if="model === VIEW_STATE.LOADING" :class="{ primary: isPrimary, destructive: isDestructive }"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VIEW_STATE } from '~/data/Enums';

const props = defineProps({ 
    text: { type: String, required: true },
    icon: { type: String, required: true },
    isPrimary: { type: Boolean },
    isDestructive: { type: Boolean }
});
const model = defineModel({ default: VIEW_STATE.LOADING });

const imageSrc = computed<string>(() => {
    return `/src/assets/icons/${props.icon}/${props.icon}.white.svg`;
});

</script>

<style scoped>
#bold-text-button-label {
    width: 100%;
    display: flex;
    align-items: center;

    #button {
        width: 100%;
        display: flex;
        height: 5.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        border-radius: 1rem;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border-radius: var(--button-border-radius);

        img {
            width: 2.5rem;
            height: 2.5rem;
        }
    }

    .primary {
        color: white;
        background-color: var(--primary-brand-color);
    }

    .destructive {
        color: white;
        background-color: var(--secondary-brand-color);
    }
}

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