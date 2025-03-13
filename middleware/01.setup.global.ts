import { VIEW_STATE } from "~/data/Enums";
import { useSessionStore } from "../stores/session-store";
import { useAuthStore } from "../stores/auth-store";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    
    const authStore = useAuthStore();
    const sessionStore = useSessionStore();
    
    // Check if this is navigation between routes
    const isNavigating = !!from.name;
    
    // Initialize auth if needed
    if (!authStore.isAuthInitialized) {
        await authStore.initAuth();
    }

    // Load session data only if not already loaded
    if (authStore.isAuthInitialized && !sessionStore.hasLoaded) {
        await sessionStore.load();
    }

    // If this is navigation (not initial load) and we're already loaded, 
    // force success state and don't reload
    if (isNavigating && sessionStore.hasLoaded) {
        sessionStore.loadingState = VIEW_STATE.SUCCESS;
    }
    
    // If authenticated user tries to access signin, redirect to home
    if (authStore.isAuthenticated && to.path === '/signin') {
        return navigateTo('/home');
    }
    
    // Handle /groups path redirection rule
    if (to.path.startsWith('/groups')) {
        const isGroupsSearchPattern = to.path === '/groups/search' || to.path.match(/^\/groups\/search\/(\d+)$/);
        if (!isGroupsSearchPattern && sessionStore.user?.clubs?.length == 0) {
            return navigateTo('/groups/search');
        }
    }
    
    // Define public routes that don't require authentication
    const isPublicRoute = to.path === '/signin' ||
                            to.path === '/contact-us' ||
                            to.path === '/terms-of-use' ||
                            to.path === '/privacy-policy' ||
                            to.path.match(/^\/events\/([a-zA-Z0-9]+)$/) !== null || 
                            to.path.match(/^\/groups\/search\/([a-zA-Z0-9]+)$/) !== null;
    
    // Redirect unauthenticated users from non-public routes
    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo({
            path: '/signin',
            query: { redirect: to.fullPath }
        });
    }
});