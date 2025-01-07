import { useSessionStore } from "~/stores/session-store";

export default defineNuxtRouteMiddleware((to, from) => {

    // We don't care about auth on the server side
    if (import.meta.server) return;

    // Check for auth on the client side
    if (import.meta.client) {
        const session = useSessionStore();
        session.checkAuthorizationStatus();
    }
});