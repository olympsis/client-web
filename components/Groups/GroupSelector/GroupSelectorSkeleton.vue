<template>
    <div class="background">
        <ScrollPanel style="width: 100%; height: 13rem;">
            <div class="container">
            <div class="skeleton logo"></div>
            <div class="skeleton label"></div>
            </div>

            <div class="container">
                <div class="skeleton logo"></div>
                <div class="skeleton label"></div>
            </div>

            <div class="container">
                <div class="skeleton logo"></div>
                <div class="skeleton label"></div>
            </div>
        </ScrollPanel>
    </div>
</template>

<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel';
</script>

<style scoped>
.background {
    width: 25rem;
    height: 13rem;
    display: flex;
    border-radius: 10px;
    flex-direction: column;
}
.container {
    display: flex;
    margin: 1rem 1rem;
    align-items: center;
}
.logo {
    height: 3rem;
    width: 3rem;
    border-radius: 10px;
}
.label {
    height: 1.5rem;
    width: 10rem;
    border-radius: 5px;
    margin: 0rem 1rem;
}
</style>