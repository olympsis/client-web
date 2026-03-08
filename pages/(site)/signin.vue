<template>
  <main id="signin">
    <AuthenticationCard
        v-if="step === 'auth'"
        @apple="handleSignInWithApple"
        @google="handleSignInWithGoogle"
    />
	<CompleteProfileCard
		v-if="step === 'complete-profile'"
		:initial-first-name="authResponse?.fullName?.split(' ')[0]"
		:initial-last-name="authResponse?.fullName?.split(' ')[1]"
		:initial-email="authResponse?.email"
		:state="profileState"
		@submit="handleProfileCompletion"
	/>
    <CreateUserCard
		v-if="step === 'create-user'"
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
import { AuthenticationFacade, type AuthFacadeResponse } from '~/data/facades/AuthenticationFacade';

import CreateUserCard from '~/components/Auth/CreateUserCard/CreateUserCard.vue';
import AuthenticationCard from '~/components/Auth/AuthenticationCard/AuthenticationCard.vue';
import CompleteProfileCard from '~/components/Auth/CompleteProfileCard/CompleteProfileCard.vue';

definePageMeta({ layout: 'site' });

const auth = useAuth();
const session = useSessionStore();
const authenticator = new AuthenticationFacade();

// Tracks which step of the sign-up flow we're on
type SignInStep = 'auth' | 'complete-profile' | 'create-user';
const step: Ref<SignInStep> = ref('auth');

const authResponse: Ref<AuthFacadeResponse | null> = ref(null);
const profileState = ref(VIEW_STATE.PENDING);
const createState = ref(VIEW_STATE.PENDING);

/**
 * Checks if a new user is missing required profile info (name/email).
 * Apple often doesn't provide these after the first authorization.
 */
function needsProfileCompletion(response: AuthFacadeResponse): boolean {
	const nameParts = response.fullName ? response.fullName.trim().split(' ') : [];
	const hasFirstName = (nameParts[0] ?? '').length > 0;
	const hasLastName = (nameParts[1] ?? '').length > 0;
	const hasEmail = (response.email ?? '').length > 0;
	return !hasFirstName || !hasLastName || !hasEmail;
}

/**
 * Handles the new user flow after authentication.
 * If profile info is missing, shows the profile completion card.
 * Otherwise registers with the backend and moves to username/sports.
 */
async function handleNewUser(response: AuthFacadeResponse) {
	authResponse.value = response;
	if (needsProfileCompletion(response)) {
		step.value = 'complete-profile';
	} else {
		await registerAndContinue(response);
	}
}

/**
 * Registers the user with the backend and advances to username/sports step.
 */
async function registerAndContinue(response: AuthFacadeResponse) {
	const registered = await authenticator.registerUser(response);
	if (registered) {
		step.value = 'create-user';
	} else {
		console.error('Failed to register user with backend');
	}
}

async function handleSignInWithApple() {
	const response = await auth.signInWithApple();
	if (response) {
		if (response.isNewUser) {
			await handleNewUser(response);
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
		if (response.isNewUser) {
			await handleNewUser(response);
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

/**
 * Called when the user submits the CompleteProfileCard.
 * Updates the auth response with user-provided info, registers
 * with the backend, then advances to the username/sports step.
 */
async function handleProfileCompletion(event: { firstName: string, lastName: string, email: string }) {
	if (!authResponse.value) return;

	profileState.value = VIEW_STATE.LOADING;

	// Update the stored auth response with user-provided info
	authResponse.value.fullName = `${event.firstName} ${event.lastName}`;
	authResponse.value.email = event.email;

	await registerAndContinue(authResponse.value);
	profileState.value = VIEW_STATE.PENDING;
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