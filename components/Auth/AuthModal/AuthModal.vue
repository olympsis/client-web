<template>
    <AuthenticationCard 
        v-if="!hasCreated"
        :show-cancel="true"
        @close="$emit('cancel')"
        @apple="handleSignInWithApple" 
        @google="handleSignInWithGoogle"
    />
    <CreateUserCard 
        v-else 
        @submit="handleAuthCompletion" 
        :state="createState"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { UserDTO } from '~/data/models/UserModels';
import { AuthenticationFacade } from '@/data/facades/AuthenticationFacade';

import CreateUserCard from '../CreateUserCard/CreateUserCard.vue';
import AuthenticationCard from '../AuthenticationCard/AuthenticationCard.vue';

const emit = defineEmits([
    'userAuthenticated',
    'cancel'
]);

const hasCreated = ref<boolean>(false);
const createState = ref<VIEW_STATE>(VIEW_STATE.PENDING);

const authenticator = new AuthenticationFacade();

/**
 * A wrapper around the authenticator's sign in with apple function.
 * We handle the event thrown by the button and call the authenticator.
 * We want to capture the response and store it here to complete the auth process later.
 * If the user is not a new user then we emit the completed auth event.
 */
async function handleSignInWithApple() {
    const response = await authenticator.signInWithApple();
    if (response) { 
        if (!response?.isNewUser) { emit('userAuthenticated'); return; }
        hasCreated.value = true;
    }
}

/**
 * A wrapper around the authenticator's sign in with apple function.
 * We handle the event thrown by the button and call the authenticator.
 * We want to capture the response and store it here to complete the auth process later.
 * If the user is not a new user then we emit the completed auth event.
 */
async function handleSignInWithGoogle() {
    const response = await authenticator.signInWithGoogle();
    if (response) { 
        if (!response?.isNewUser) { emit('userAuthenticated'); return; }
        hasCreated.value = true;
    }
}

/**
 * A wrapper around the authenticator's complete user sign up function.
 * We handle the event thrown by the CreateUserCard to finish the sign up process.
 * When finished emit the completed auth event.
 * @param event object pushed up from the create user card.
 */
async function handleAuthCompletion(event: any) {

    const userData = new UserDTO();
    userData.username = event.username
    userData.sports = event.sports

    createState.value = VIEW_STATE.LOADING;

    const created = await authenticator.completeUserSignUp(userData);

    if (created) {
        createState.value = VIEW_STATE.SUCCESS;
        emit('userAuthenticated');
    } else {
        createState.value = VIEW_STATE.PENDING;
    }
}
</script>

<style scoped>
</style>