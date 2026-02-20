import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AUTH_STATUS } from '~/data/Enums';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { AuthenticationFacade } from '~/data/facades/AuthenticationFacade';

export const useAuthStore = defineStore('auth', () => {

    const authenticator = new AuthenticationFacade();

    const isAuthInitialized = ref(false);
    const firebaseUser = ref<User | null>(null);
    const authStatus = ref<AUTH_STATUS>(AUTH_STATUS.unknown);

    const userId = computed(() => firebaseUser.value?.uid || null);
    const isLoading = computed(() => !isAuthInitialized.value || authStatus.value === AUTH_STATUS.not_finished);
    const isAuthenticated = computed(() => authStatus.value === AUTH_STATUS.authenticated && !!firebaseUser.value);

    async function initAuth() {
        if (isAuthInitialized.value) return;

        const nuxtApp = useNuxtApp();
        const auth = nuxtApp.$auth as Auth;

        const config = useRuntimeConfig();

        return new Promise<void>((resolve) => {
            if (config.public.MODE == 'dev') {
                firebaseUser.value = { uid: 'dev-user' } as User;
                authStatus.value = AUTH_STATUS.authenticated;
                isAuthInitialized.value = true;
                resolve();
                return;
            }
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                firebaseUser.value = user;
                
                if (user) {
                    authStatus.value = AUTH_STATUS.authenticated;
                } else {
                    authStatus.value = AUTH_STATUS.unauthenticated;
                }
                
                isAuthInitialized.value = true;
                unsubscribe();
                resolve();
            });
        });
    }

    function resetState() {
        isAuthInitialized.value = false;
    }
  
    async function signInWithGoogle() {
        try {
            const response = await authenticator.signInWithGoogle();
            return response;
        } catch (error) {
            console.error('Failed to sign in with Google:', error);
            return null;
        }
    }
  
    async function signInWithApple() {
        try {
            const response = await authenticator.signInWithApple();
            return response;
        } catch (error) {
            console.error('Failed to sign in with Apple:', error);
            return null;
        }
    }
  
    async function signOut() {
        try {
            const success = await authenticator.signOut();
            if (success) {
            authStatus.value = AUTH_STATUS.unauthenticated;
            }
            return success;
        } catch (error) {
            console.error('Failed to sign out:', error);
            return false;
        }
    }
  
    async function deleteAccount() {
        try {
            const success = await authenticator.deleteAccount();
            if (success) {
            authStatus.value = AUTH_STATUS.unauthenticated;
            }
            return success;
        } catch (error) {
            console.error('Failed to delete account:', error);
            throw error;
        }
    }

    return {
        // State
        firebaseUser,
        authStatus,
        isAuthInitialized,

        // Getters
        isAuthenticated,
        isLoading,
        userId,

        // Actions
        initAuth,
        resetState,
        signInWithGoogle,
        signInWithApple,
        signOut,
        deleteAccount
    };
});