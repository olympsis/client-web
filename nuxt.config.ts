import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
				compatibilityDate: "2025-01-01",
				devtools: { enabled: true },

				css: [
								"~/assets/css/main.css",
								"~/assets/css/modal.css",
								"~/assets/css/popup.css",
								"~/assets/css/dialog.css",
								"~/assets/css/animations.css",
				],

				modules: [
				 "@pinia/nuxt",
				 "@nuxtjs/robots",
				 "@nuxtjs/storybook",
				 "@sentry/nuxt/module",
				 "@primevue/nuxt-module",
				 "@nuxtjs/i18n",
				],

				build: {
								transpile: ["malakbel"],
				},

				runtimeConfig: {
								public: {
												MODE: process.env.mode ?? "dev",

												API: process.env.API ?? "",
												USER_ID: process.env.USER_ID ?? "",

												APP_ID: process.env.APL_APP_ID ?? "",
												APL_KEY_ID: process.env.APL_KEY_ID ?? "",
												APL_TEAM_ID: process.env.APL_TEAM_ID ?? "",
												APL_MAPKIT_SNAPSHOT_TOKEN: process.env.APL_MAPKIT_SNAPSHOT_TOKEN ?? "",

												MAPKIT_ORIGIN: process.env.MAPKIT_ORIGIN ?? "",
												MAPKIT_KEY: process.env.MAPKIT_KEY ?? "",

												FB_APP_ID: process.env.FB_APP_ID ?? "",
												FB_API_KEY: process.env.FB_API_KEY ?? "",
												FB_PROJECT_ID: process.env.FB_PROJECT_ID ?? "",
												FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN ?? "",
												FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET ?? "",
												FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID ?? "",
												FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID ?? "",
								},
				},

				routeRules: {
								// Sites routes
								"/": {
																								redirect: "/signin",
								},
								"/signin": { ssr: false },
								"/about-us": { prerender: true },
								"/contact-us": { prerender: true },
								"/terms-of-use": { prerender: true },
								"/privacy-policy": { prerender: true },

								"/home": { ssr: false },
								"/groups": { ssr: false },
								"/groups/search": { ssr: false },
								"/events": { ssr: false },
								"/profile": { ssr: false },

								"/events/**": { ssr: true },
								"/groups/search/**": { ssr: true },
				},

				app: {
								head: {
												link: [
																{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
																{ rel: "apple-touch-icon", type: "image/x-icon", href: "/favicon.ico" }
												],
												meta: [
																{
																				name: "theme-color",
																				content: "#FFFFFF",
																				media: "(prefers-color-scheme: light)",
																},
																{
																				name: "theme-color",
																				content: "#1E1E1E",
																				media: "(prefers-color-scheme: dark)",
																},
												],
								},
				},

				robots: {
								blockAiBots: true,
								blockNonSeoBots: true,
				},

				primevue: {
								options: {
												theme: {
																preset: Aura,
												},
								},
								components: {
												prefix: "Prime",
												exclude: ["Editor", "Form", "Chart", "FormField"],
								},
				},

				spaLoadingTemplate: "loading.html",

			i18n: {
							locales: [
											{ code: "en", language: "en-US", file: "en.json", name: "English" },
											{ code: "es", language: "es-ES", file: "es.json", name: "Español" },
											{ code: "fr", language: "fr-FR", file: "fr.json", name: "Français" },
							],
							defaultLocale: "en",
							lazy: true,
							langDir: "locales",
							strategy: "no_prefix",  // URLs stay clean without locale prefix
							detectBrowserLanguage: {
											useCookie: true,
											cookieKey: "i18n_redirected",
											redirectOn: "root",  // Only redirect on root path
							},
			},

				sentry: {
								sourceMapsUploadOptions: {
												org: "olympsis",
												project: "client-web",
								},

								autoInjectServerSentry: "top-level-import",
				},

				sourcemap: {
								client: "hidden",
				},
});