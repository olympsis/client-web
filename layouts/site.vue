<template>
	<NavigationBar/>
	<slot/>
	<BottomBar/>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import BottomBar from '~/components/site/BottomBar/BottomBar.vue';
</script>
