<template>
  <main id="signin">
    <AuthenticationCard
        v-if="step === 'auth'"
        @apple="handleSignInWithApple"
        @google="handleSignInWithGoogle"
    />
	<CompleteProfileCard
		v-if="step === 'complete-profile'"
		:initial-full-name="authResponse?.fullName"
		:initial-email="authResponse?.email"
		@submit="handleProfileCompletion"
	/>
  </main>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import { ref, type Ref } from 'vue';
import { UserDTO } from '~/data/models/UserModels';
import { AuthenticationFacade, type AuthFacadeResponse } from '~/data/facades/AuthenticationFacade';

import AuthenticationCard from '~/components/Auth/AuthenticationCard/AuthenticationCard.vue';
import CompleteProfileCard from '~/components/Auth/CompleteProfileCard/CompleteProfileCard.vue';

definePageMeta({ layout: 'site' });

const auth = useAuth();
const session = useSessionStore();
const authenticator = new AuthenticationFacade();

type SignInStep = 'auth' | 'complete-profile';
const step: Ref<SignInStep> = ref('auth');

const authResponse: Ref<AuthFacadeResponse | null> = ref(null);

async function navigateToApp() {
	auth.resetState();
	session.resetSession();
	// TODO:// remove after app launch — revert to /home
	await navigateTo({
		path: '/events',
		query: { from: '/signin' }
	});
}

async function handleSignInWithApple() {
	const response = await auth.signInWithApple();
	if (response) {
		if (response.isNewUser) {
			authResponse.value = response;
			step.value = 'complete-profile';
		} else {
			await navigateToApp();
		}
	}
}

async function handleSignInWithGoogle() {
	const response = await auth.signInWithGoogle();
	if (response) {
		if (response.isNewUser) {
			authResponse.value = response;
			step.value = 'complete-profile';
		} else {
			await navigateToApp();
		}
	}
}

/**
 * Called when the user submits the full profile form.
 * Registers with the backend, updates user data, then navigates to /events.
 */
async function handleProfileCompletion(event: {
	firstName: string,
	lastName: string,
	email: string,
	username: string,
	sports: any[]
}) {
	if (!authResponse.value) return;

	// Update auth response with user-provided info and register
	authResponse.value.fullName = `${event.firstName} ${event.lastName}`;
	authResponse.value.email = event.email;

	const registered = await authenticator.registerUser(authResponse.value);
	if (!registered) {
		console.error('Failed to register user with backend');
		return;
	}

	// Update user profile with username and sports
	const userData = new UserDTO();
	userData.username = event.username;
	userData.sports = event.sports.map((s: any) => s.name);

	const completed = await authenticator.completeUserSignUp(userData);
	if (completed) {
		await navigateToApp();
	} else {
		console.error('Failed to complete user signup');
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

@media screen and (max-width: 599px) {
	#main {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url('@/assets/images/sports-small.webp');
	}
}
</style>
