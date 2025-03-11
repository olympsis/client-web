import { VIEW_STATE } from "~/data/Enums";

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
    
    // If this is navigation (not initial load) and we're already loaded, 
    // force success state and don't reload
    if (isNavigating && sessionStore.hasLoaded) {
        sessionStore.loadingState = VIEW_STATE.SUCCESS;
    }
    
    if (authStore.isAuthenticated && to.path === '/signin') {
        return navigateTo('/home');
    }
    
    // Handle protected routes
    if (!authStore.isAuthenticated) {
        return navigateTo({
            path: '/signin',
            query: { redirect: to.fullPath }
        });
    }
    
    // Load session data only if not already loaded
    if (!sessionStore.hasLoaded) {
        await sessionStore.load();
    }
    
    // Handle specific route types
    if (to.path.startsWith('/groups')) {
        return handleGroupsRoutes(sessionStore, to);
    }
});