<template>
  <NavigationBar />
  <main id="main">
    <AuthenticationCard 
        v-if="!isSignedUp" 
        @apple="handleSignInWithApple" 
        @google="handleSignInWithGoogle"
    />
    <Transition>
        <CreateUserCard 
            v-if="isSignedUp" 
            @submit="handleAuthCompletion" 
            :state="createState"
        />
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { VIEW_STATE } from '~/data/Enums';
import { UserDTO } from '~/data/models/UserModels';
import { useSessionStore } from '~/stores/session-store';
import { AuthenticationFacade } from '~/data/facades/AuthenticationFacade';

import NavigationBar from '~/components/NavigationBar/NavigationBar.vue';
import CreateUserCard from '~/components/Auth/CreateUserCard/CreateUserCard.vue';
import AuthenticationCard from '~/components/Auth/AuthenticationCard/AuthenticationCard.vue';

const session = useSessionStore();
const authenticator = new AuthenticationFacade();

const isSignedUp: Ref<boolean> = ref(false);
const createState = ref(VIEW_STATE.PENDING);

async function handleSignInWithApple() {
  const response = await authenticator.signInWithApple();
  if (response) { 
      if (response?.isNewUser) { 
          isSignedUp.value = true;
      } else {
          session.checkAuthorizationStatus();
      }
  }
}

async function handleSignInWithGoogle() {
  const response = await authenticator.signInWithGoogle();
  if (response) { 
      if (response?.isNewUser) { 
          isSignedUp.value = true;
      } else {
          session.checkAuthorizationStatus();
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
      session.checkAuthorizationStatus();
  } else {
      createState.value = VIEW_STATE.PENDING;
  }
}
</script>

<style scoped>
#main {
display: flex;
flex-grow: 1;
height: 100%;
width: 100%;
flex-direction: column;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
background-image: url('~/assets/images/sports.webp');
}

#create-user-card {
  margin: auto;
}

@media screen and (max-width: 599px) {
#main {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('~/assets/images/sports-small.webp');
}
}
</style>