import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth-store';

export function useAuth() {
    const authStore = useAuthStore();
  
    // Reactive state (using storeToRefs for reactivity)
    const { 
        firebaseUser,
        authStatus, 
        isAuthenticated, 
        isLoading,
        userId
    } = storeToRefs(authStore);
  
    // Methods
    const { 
        initAuth,
        signInWithGoogle,
        signInWithApple,
        signOut,
        deleteAccount
    } = authStore;
  
    return {
        // State
        authStatus,
        firebaseUser,
        isAuthenticated,
        isLoading,
        userId,

        // Methods
        initAuth,
        signInWithGoogle,
        signInWithApple,
        signOut,
        deleteAccount
    };
}