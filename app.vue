<template>
  <div id="app">
    <div id="splash" v-if="appState == VIEW_STATE.LOADING || appState == VIEW_STATE.PENDING">
        <LoadingView/>
    </div>
    <NuxtPage v-if="appState == VIEW_STATE.SUCCESS"/>
  </div>
</template>

<script setup lang="ts">
import { AUTH_STATUS, VIEW_STATE } from './data/Enums';


const router = useRouter();
const session = useSessionStore();

const appState: Ref<VIEW_STATE> = ref(VIEW_STATE.LOADING);
const authState: Ref<AUTH_STATUS> = ref(AUTH_STATUS.unauthenticated);

session.$subscribe((_, state) => {
    handleStateChanges(state);
});

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
			// router.push('/home');
		}
	} 
	// else if (authState.value === AUTH_STATUS.unauthenticated && appState.value === VIEW_STATE.SUCCESS) {
	// 	// TODO: I need to handle routing better and listening to auth changes as well
	// 	if (!window.location.href.match(/\/events\/[a-f0-9]{24}/i) || !window.location.href.match(/\/groups\/search\/[a-f0-9]{24}/i)) {
	// 		router.push('/signin');
	// 	}
	// }
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
