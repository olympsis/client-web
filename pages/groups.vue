<template>
    <div>
        <NavigationBar/>
        <Suspense>
            <NuxtPage :key="$route.fullPath"/>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
</script>