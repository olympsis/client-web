<template>
	<div id="app">
		<Toast/>
		<NuxtPage/>
		<LocationDialog/>
	</div>
</template>
  
<script setup lang="ts">

import Toast from 'primevue/toast';
import LocationDialog from './components/System/LocationDialog/LocationDialog.vue';
import { SystemService } from './data/services/SystemService';

onMounted(async () => {
	const auth = useAuth();
	const session = useSessionStore();

	try {
		const systemService = new SystemService();
		const config = await systemService.getConfig();
		session.tags = config.tags;
		session.sports = config.sports;
	} catch(error) {
		console.error("Something Unexpected Happened!")
	}

	/**
	 * We fetch venues and events nearby on first app load if user is authenticated.
	 * We have other views that will be available to the public such as /events
	 * That page will fetch events data by itself if someone isn't authenticated and is visiting the site.
	 */
		if (auth.isAuthenticated) {
		await session.loadVenuesAndEvents();
	}
})

useHead({
	htmlAttrs: {
		lang: "en"
	},
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
