<template>
    <div id="bold-text-button-label">
        <div id="button" :class="{ primary: isPrimary, destructive: isDestructive }">
            <picture>
                <source :srcset="imageSrcDark" media="(prefers-color-scheme: dark)">
                <img :src="imageSrc">
            </picture>
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({ 
    text: { type: String, required: true },
    icon: { type: String, required: true },
    isPrimary: { type: Boolean },
    isDestructive: { type: Boolean }
});

const imageSrc = computed<string>(() => {
    return `/icons/${props.icon}/${props.icon}.svg`;
});

const imageSrcDark = computed<string>(() => {
    return `/icons/${props.icon}/${props.icon}.white.svg`;
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
        font-size: 0.85rem;
        border-radius: 1rem;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: var(--primary-label-color);
        border-radius: var(--button-border-radius);
        background-color: var(--secondary-background-color);

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