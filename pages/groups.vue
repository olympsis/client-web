<template>
    <div>
        <NavigationBar/>
        <NuxtPage :page-key="route => route.fullPath"/>
    </div>
</template>


<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Add verbose logging
onMounted(() => {
    console.log('Parent route mounted, path:', route.path);
    console.log('Full route object:', route);
});

// Watch for route changes
watch(
    () => route.path,
    (newPath) => {
        console.log('Route changed to:', newPath);
    },
    { immediate: true }
);
</script>