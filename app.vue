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
import { VIEW_STATE } from './data/Enums';
import { Analytics } from '@vercel/analytics/nuxt';
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

import Toast from 'primevue/toast';
import FailedView from './components/AppState/FailedView/FailedView.vue';
import LoadingView from '~/components/AppState/LoadingView/LoadingView.vue';

const session = useSessionStore();

const isLoading = computed<boolean>(() => {
	return session.loadingState === VIEW_STATE.LOADING || session.loadingState == VIEW_STATE.PENDING;
});

const hasFailed = computed<boolean>(() => {
	return session.loadingState === VIEW_STATE.FAILURE;
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
