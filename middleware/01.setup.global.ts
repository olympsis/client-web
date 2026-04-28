import { VIEW_STATE } from "~/data/Enums";
import { useSessionStore } from "../stores/session-store";
import { useAuthStore } from "../stores/auth-store";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    const authStore = useAuthStore();
    const sessionStore = useSessionStore();

    // Check if this is navigation between routes
    const isNavigating = !!from.name;

    /*
       Query-only changes on the same path (e.g. flipping the
       `?showVenues=true` toggle on /events, opening a modal that
       writes to the URL, etc.) re-run middleware in Nuxt 3 by
       default. Re-evaluating auth gating on those is at best
       wasted work and at worst causes a flicker-redirect to
       /signin if the auth store transiently reports
       unauthenticated during the transition. The user hasn't
       actually navigated to a new page, so just early-return.
    */
    if (isNavigating && to.path === from.path) {
        return;
    }

    // Routes that can be viewed without authentication or session initialization
    const isPublicRoute = to.path === '/signin' ||
                          to.path === '/landing-page' ||
                          to.path === '/about-us' ||
                          to.path === '/contact-us' ||
                          to.path === '/terms-of-use' ||
                          to.path === '/privacy-policy' ||
                          to.path === '/events' ||
                          to.path === '/events/new' ||
                          to.path.match(/^\/events\/([a-zA-Z0-9]+)$/) !== null ||
                          to.path.match(/^\/venues\/([a-zA-Z0-9]+)$/) !== null ||
                          to.path.match(/^\/groups\/search\/([a-zA-Z0-9]+)$/) !== null;

    // Initialize auth if needed
    if (!authStore.isAuthInitialized) {
        await authStore.initAuth();
    }

    /*
       Init session for authenticated users.

       On non-public routes we await so the page can rely on session data
       (profile, groups, etc.) being present before render.

       On public routes (e.g. cold-loading directly to /events while
       signed in) we still need session.init to run — otherwise
       session.user stays undefined and downstream components like the
       NavigationBar avatar, the events page filter seeder, and anything
       reading user/groups never hydrate. Kick it off in the background
       so the page renders immediately and reactive refs fill in as
       init resolves.
    */
    if (authStore.isAuthenticated && !sessionStore.hasLoaded) {
        if (isPublicRoute) {
            sessionStore.init();
        } else {
            await sessionStore.init();
        }
    }

    // If this is navigation (not initial load) and we're already loaded,
    // force success state and don't reload
    if (isNavigating && sessionStore.hasLoaded) {
        sessionStore.loadingState = VIEW_STATE.SUCCESS;
    }

    // Authenticated users go to /events, unauthenticated go to landing page
    if (to.path === '/') {
        return navigateTo(authStore.isAuthenticated ? '/events' : '/landing-page');
    }

    // If authenticated user tries to access signin or landing page, redirect to events
    if (authStore.isAuthenticated && (to.path === '/signin' || to.path === '/landing-page')) {
        return navigateTo('/events');
    }

    // TODO:// remove after app launch
    // Redirect disabled routes (home, groups, rooms) to /events
    if (to.path === '/home' || to.path.startsWith('/groups') || to.path.startsWith('/rooms')) {
        // Allow group search detail pages for SEO/sharing links
        const isGroupSearchDetail = to.path.match(/^\/groups\/search\/([a-zA-Z0-9]+)$/);
        if (!isGroupSearchDetail) {
            return navigateTo('/events');
        }
    }

    // Redirect unauthenticated users from non-public routes
    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo({
            path: '/signin',
            query: { redirect: to.fullPath }
        });
    }
});