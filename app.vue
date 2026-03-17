<template>
	<div id="app">
		<ClientOnly><Toast/></ClientOnly>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
		<LocationDialog/>
	</div>
</template>
  
<script setup lang="ts">

import Toast from 'primevue/toast';
import LocationDialog from './components/System/LocationDialog/LocationDialog.vue';
import { SystemService } from './data/services/SystemService';

onMounted(async () => {
	const session = useSessionStore();

	try {
		const systemService = new SystemService();
		const config = await systemService.getConfig();
		session.tags = config.tags;
		session.sports = config.sports;
	} catch(error) {
		console.error("Something Unexpected Happened!")
	}
});

useHead({
	htmlAttrs: {
		lang: "en"
	},
});
</script>

<style scoped>
#app {
	margin: 0;
	width: 100%;
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
