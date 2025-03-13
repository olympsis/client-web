import { AUTH_STATUS } from "~/data/Enums";
import type { RouteLocationNormalizedGeneric } from "vue-router";

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

function handleGroupsRoutes(to: RouteLocationNormalizedGeneric) {
	const authStore = useAuthStore();
	if (to.fullPath !== '/groups/search' && !to.fullPath.match(/\/groups\/search\/(\d+)/)) {
		return navigateTo('/groups/search');
	}
}

function handleEventRoutes(to: RouteLocationNormalizedGeneric) {
	const authStore = useAuthStore();
    if (!authStore.isAuthenticated && to.fullPath.includes('/events/new')) {
		return navigateTo('/signin');
    }
}

export {
    handleRoutes,
    handleHomeRoutes,
    handleEventRoutes,
    handleGroupsRoutes
}