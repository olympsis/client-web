<template>
    <div id="bold-text-button-label">
        <div v-if="isPrimary || isDestructive" id="button" :class="{ primary: isPrimary, destructive: isDestructive }">
            <img src="@/assets/icons/car/car.white.svg">
            <p>{{ text }}</p>
        </div>
        <div v-else id="button">
            <picture>
                <source srcset="@/assets/icons/car/car.white.svg" media="(prefers-color-scheme: dark)">
                <img src="@/assets/icons/car/car.svg">
            </picture>
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    text: { type: String, required: true },
    isPrimary: { type: Boolean },
    isDestructive: { type: Boolean }
});
</script>

<style scoped>
#bold-text-button-label {
    width: 100%;
    display: flex;
    align-items: center;

    p {
        font-weight: bold;
    }

    #button {
        width: 100%;
        display: flex;
        height: 5.5rem;
        cursor: pointer;
        font-size: 0.85rem;
        border-radius: 20px !important;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: var(--primary-label-color);
        border: var(--icon-border-color) solid 1px;
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