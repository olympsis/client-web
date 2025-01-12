<template>
    <div>
        <NavigationBar/>
        <NuxtPage :page-key="route => route.fullPath"/>
    </div>
</template>


<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
</script>