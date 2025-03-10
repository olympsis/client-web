<template>
	<div id="app">
		<Analytics/>
		<SpeedInsights/>
		<Toast/>
		<LoadingView v-if="isLoading"/>
		<FailedView v-if="hasFailed"/>
		<NuxtPage/>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { VIEW_STATE } from './data/Enums';
import { Analytics } from '@vercel/analytics/nuxt';
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

import Toast from 'primevue/toast';
import FailedView from './components/AppState/FailedView/FailedView.vue';
import LoadingView from '~/components/AppState/LoadingView/LoadingView.vue';

const auth = useAuth();
const session = useSessionStore();

const isLoading = computed<boolean>(() => {
	return auth.isLoading.value;
});

const hasFailed = computed<boolean>(() => {
	return session.loadingState === VIEW_STATE.FAILURE;
});

// Initialize loading state correctly
onMounted(() => {
	// For first page load, ensure we start in loading state
	if (!session.hasLoaded) {
		session.loadingState = VIEW_STATE.LOADING;
	}
});

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
