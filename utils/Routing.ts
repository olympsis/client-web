import { AUTH_STATUS } from "~/data/Enums";
import type { RouteLocationNormalizedGeneric } from "vue-router";

function handleAuthorizationStatus(subscription: () => void, state: any, to: RouteLocationNormalizedGeneric) {
	subscription();
	if (to.fullPath === '/' || to.fullPath === '/signin') {
		return handleHomeRoutes(state, to);
	} else if (to.fullPath.includes('/groups')) {
		return handleGroupsRoutes(state, to);
	} else if (to.fullPath.includes('/events')) {
		return handleEventRoutes(state, to);
	} else {
		return navigateTo(to);
	}
}

function handleRoutes(state: any, to: RouteLocationNormalizedGeneric) {
	if (to.fullPath === '/' || to.fullPath === '/signin') {
		return handleHomeRoutes(state, to);
	} else if (to.fullPath.includes('/groups')) {
		return handleGroupsRoutes(state, to);
	} else if (to.fullPath.includes('/events')) {
		return handleEventRoutes(state, to);
	} else {
		return;
	}
}

function handleHomeRoutes(status: any, to: RouteLocationNormalizedGeneric) {
	if (status.authStatus !== AUTH_STATUS.authenticated) {
		return navigateTo('/signin');
	} else {
        if (to.fullPath === '/' || to.fullPath === '/signin') return navigateTo('/home');
		return;
	}
}

function handleGroupsRoutes(sessionStore: any, to: RouteLocationNormalizedGeneric) {
	if (sessionStore.groups.length == 0 && to.fullPath !== '/groups/search') {
		return navigateTo('/groups/search');
	}
}

function handleEventRoutes(status: any, to: RouteLocationNormalizedGeneric) {
    
	// We want non users to have access to this page
	if (to.fullPath.match(/\/events\/(\d+)/)) {
		return;
    }

	// We still want to route unauthorized users to the auth page
    if (to.fullPath === '/events') {
		if (status.authStatus !== AUTH_STATUS.authenticated) {
			return navigateTo('/signin');
		}
    }
}

export {
    handleRoutes,
    handleHomeRoutes,
    handleEventRoutes,
    handleGroupsRoutes,
    handleAuthorizationStatus
}