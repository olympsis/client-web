import { AUTH_STATUS } from "~/data/Enums";
import type { RouteLocationNormalizedGeneric } from "vue-router";

function handleAuthorizationStatus(subscription: () => void, state: any, to: RouteLocationNormalizedGeneric) {
	subscription();
	return handleRoutes(state, to);
}

function handleRoutes(state: any, to: RouteLocationNormalizedGeneric) {
	if (to.fullPath.includes('/signin') || 
		to.fullPath.includes('/home')
	){
		return handleHomeRoutes(state, to);
	} else if (to.fullPath.includes('/groups')) {
		return handleGroupsRoutes(state, to);
	} else if (to.fullPath.includes('/events')) {
		return handleEventRoutes(state, to);
	} else if (to.fullPath.includes('/profile')) {
		return handleProfileRoutes(state, to);
	}
}

function handleHomeRoutes(status: any, to: RouteLocationNormalizedGeneric) {
	if (status.authStatus === AUTH_STATUS.authenticated) {
		if (to.fullPath.includes('/signin')) {
			return navigateTo('/home');
		}	
	} else {
		if (to.fullPath.includes('/home')) {
			return navigateTo('signin');
		}
	}
}

function handleGroupsRoutes(sessionStore: any, to: RouteLocationNormalizedGeneric) {
	if (sessionStore.groups.length == 0 && to.fullPath !== '/groups/search') {
		return navigateTo('/groups/search');
	}
}

function handleEventRoutes(status: any, to: RouteLocationNormalizedGeneric) {
    if (status.authStatus !== AUTH_STATUS.authenticated && !to.fullPath.match(/\/events\/(\d+)/)) {
		return navigateTo('/signin');
    }
}

function handleProfileRoutes(status: any, to: RouteLocationNormalizedGeneric) {
	if (status.authStatus !== AUTH_STATUS.authenticated) {
		return navigateTo('/signin');
	}
}

export {
    handleRoutes,
    handleHomeRoutes,
    handleEventRoutes,
    handleGroupsRoutes,
    handleAuthorizationStatus
}