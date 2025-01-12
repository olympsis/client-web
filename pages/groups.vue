<template>
    <div>
        <NavigationBar/>
        <NuxtPage :key="$route.fullPath"/>
    </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
</script>