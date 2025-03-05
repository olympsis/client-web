<template>
    <div id="sport-label">{{ sport }}</div>
</template>

<script setup lang="ts">
defineProps({
    sport: { type: String, required: true }
})
</script>

<style scoped>
#sport-label {
    color: white;
    font-size: 0.8rem;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    text-transform: capitalize;
    background-blend-mode: hard-light;

    border-radius: 20px;
    backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.56);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid gray;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
</style>