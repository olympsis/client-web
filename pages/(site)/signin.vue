<template>
  <main id="signin">
    <AuthenticationCard 
        v-if="!isSignedUp" 
        @apple="handleSignInWithApple" 
        @google="handleSignInWithGoogle"
    />
    <CreateUserCard 
		v-if="isSignedUp" 
		@submit="handleAuthCompletion" 
		:state="createState"
	/>
  </main>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import { ref, type Ref } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { UserDTO } from '~/data/models/UserModels';
import { AuthenticationFacade } from '~/data/facades/AuthenticationFacade';

import CreateUserCard from '~/components/Auth/CreateUserCard/CreateUserCard.vue';
import AuthenticationCard from '~/components/Auth/AuthenticationCard/AuthenticationCard.vue';

definePageMeta({ layout: 'site' });

const auth = useAuth();
const session = useSessionStore();
const authenticator = new AuthenticationFacade();

const isSignedUp: Ref<boolean> = ref(false);
const createState = ref(VIEW_STATE.PENDING);

async function handleSignInWithApple() {
	const response = await auth.signInWithApple();
	if (response) { 
		if (response?.isNewUser) { 
			isSignedUp.value = true;
		} else {
			auth.resetState();
			session.resetSession();
			// TODO:// remove after app launch — revert to /home
			await navigateTo({
				path: '/events',
				query: { from: '/signin' }
			});
		}
	}
}

async function handleSignInWithGoogle() {
	const response = await auth.signInWithGoogle();
	if (response) {
		if (response?.isNewUser) {
			isSignedUp.value = true;
		} else {
			auth.resetState();
			session.resetSession();
			// TODO:// remove after app launch — revert to /home
			await navigateTo({
				path: '/events',
				query: { from: '/signin' }
			});
		}
	}
}

async function handleAuthCompletion(event: any) {
  const userData = new UserDTO();
  userData.username = event.username
  userData.sports = event.sports

  createState.value = VIEW_STATE.LOADING;

  const created = await authenticator.completeUserSignUp(userData);
  if (created) {
		createState.value = VIEW_STATE.SUCCESS;
		auth.resetState();
		session.resetSession();
		// TODO:// remove after app launch — revert to /groups/search
		await navigateTo({
			path: '/events',
			query: { from: '/signin' }
		});
  } else {
      createState.value = VIEW_STATE.PENDING;
  }
}

const config = useRuntimeConfig();
useSeoMeta({
    title: 'Olympsis',
    ogTitle: 'Olympsis',
    description: 'Join Olympsis to find sports events around you!',
    ogDescription: 'Join Olympsis to find sports events around you!',
	appleItunesApp: {
        appId: config.public.APP_ID
    }
});

</script>

<style scoped>
#signin {
	display: flex;
	flex-grow: 1;
	height: 100%;
	width: 100%;
	flex-direction: column;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url('@/assets/images/sports.webp');
}

#create-user-card {
	margin: auto;
}

@media screen and (max-width: 599px) {
	#main {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url('@/assets/images/sports-small.webp');
	}
}
</style>