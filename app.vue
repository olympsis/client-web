<template>
	<div id="app">
		<Analytics/>
		<SpeedInsights/>
		<Toast/>
		<NuxtPage/>
	</div>
</template>
  
<script setup lang="ts">
import Toast from 'primevue/toast';
import { Analytics } from '@vercel/analytics/nuxt';
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
  
useHead({
	htmlAttrs: {
		lang: "en"
	}
});
</script>

<style scoped>
#app {
	margin: 0;
	width: 100vw;
	height: 100dvh;
	display: flex;
	overflow-y: auto;
	overflow-x: hidden;
	align-items: center;
	flex-direction: column;
	-webkit-overflow-scrolling: touch;
	background-color: var(--primary-background-color);
}
</style>
