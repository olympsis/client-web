/**
 * Dev-only middleware that removes the X-Frame-Options header
 * so Storybook (port 6006) can embed pages from the Nuxt dev server (port 3000) in iframes.
 * This only runs in development mode — production builds are unaffected.
 */
export default defineEventHandler((event) => {
	if (import.meta.dev) {
		// Remove the restrictive header so Storybook can render components in iframes
		removeResponseHeader(event, "X-Frame-Options");
	}
});
