import { 
    handleRoutes,
    handleAuthorizationStatus,
} from "~/utils/router-helpers";
import { AUTH_STATUS } from "~/data/Enums";

export default defineNuxtRouteMiddleware((to, from) => {

    // We don't care about auth on the server side
    if (import.meta.server) return;

    // Check for auth on the client side
    if (import.meta.client) {
        const session = useSessionStore();
        
        if (session.authStatus === AUTH_STATUS.unknown) {
            session.checkAuthorizationStatus();
    
            const subscription = session.$subscribe((_, state) => {
                return handleAuthorizationStatus(subscription, state, to);
            });

        } else {
            return handleRoutes(session, to);
        }
    }

});