<template>
  <div id="app">
	<LoadingView v-if="isLoading"/>
	<FailedView v-if="hasFailed"/>
    <NuxtPage/>
  </div>
</template>

<script setup lang="ts">
import { AUTH_STATUS, VIEW_STATE } from './data/Enums';

import FailedView from './components/AppState/FailedView/FailedView.vue';
import LoadingView from '~/components/AppState/LoadingView/LoadingView.vue';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const appState: Ref<VIEW_STATE> = ref(VIEW_STATE.LOADING);
const authState: Ref<AUTH_STATUS> = ref(AUTH_STATUS.unauthenticated);

const isLoading = computed<boolean>(() => {
	// if (route.fullPath === '/signin') { debugger; }
	return session.loadingState === VIEW_STATE.LOADING || session.loadingState == VIEW_STATE.PENDING;
});

const hasFailed = computed<boolean>(() => {
	return session.loadingState === VIEW_STATE.FAILURE;
});


// session.$subscribe((_, state) => {
//     handleStateChanges(state);
// });

/**
 * We want to react to authentication state updates and app state updates.
 * If the user is unauthenticated 
 * @param state - the session store's state
 */
 function handleStateChanges(state: any) {

	// if auth state changes log it
	if (authState.value != state.authStatus) {
		authState.value = state.authStatus;
		console.log(`AUTH_STATE: ${VIEW_STATE[state.authStatus].toUpperCase()}`);
	}

	// if app state changes log it
	if (appState.value != state.loadingState) {
		appState.value = state.loadingState;
		console.log(`APP_STATE: ${VIEW_STATE[state.loadingState].toUpperCase()}`);
	}

	// We only need to handle logged in & logged out state changes for now.
	const route = router.currentRoute.value.path;
	if (authState.value === AUTH_STATUS.authenticated && appState.value === VIEW_STATE.SUCCESS) {
		if (route === '/signin') {
			router.push('/home');
		}
	}
}
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
