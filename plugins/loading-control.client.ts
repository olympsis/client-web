import { VIEW_STATE } from "~/data/Enums";

export default defineNuxtPlugin({
    name: 'loading-control',
    setup() {
		const sessionStore = useSessionStore();
		const isInitialLoad = useState('isInitialLoad', () => true);
		
		// On initial client-side rendering, set loading state
		if (isInitialLoad.value) {
			sessionStore.loadingState = VIEW_STATE.LOADING;
			isInitialLoad.value = false;
		}
		
		// Add a reliable guard against loading state during navigation
		const router = useRouter();
		router.beforeEach((to, from) => {
			// If this isn't the first navigation (app already loaded)
			if (from.name && sessionStore.hasLoaded) {
				// Force loading state to success during navigation
				sessionStore.loadingState = VIEW_STATE.SUCCESS;
			}
			return true;
		});
    }
});