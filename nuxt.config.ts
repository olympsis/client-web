import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
	compatibilityDate: '2025-01-01',
	devtools: { enabled: true },
	css: [
		'~/assets/css/main.css'
	],
	modules: [
		'@pinia/nuxt',
		'@nuxtjs/robots',
		'@nuxtjs/storybook',
		'@primevue/nuxt-module',
	],
	build: {
		transpile: ['malakbel']
	},
	runtimeConfig: {
		public: {
			MODE: process.env.mode ?? 'dev',
			
			API: process.env.API ?? '',

			APP_ID: process.env.APP_ID ?? '',
			APL_KEY_ID: process.env.APL_KEY_ID ?? '',
			APL_TEAM_ID: process.env.APL_TEAM_ID ?? '',
			APL_MAPKIT_SNAPSHOT_TOKEN: process.env.APL_MAPKIT_SNAPSHOT_TOKEN ?? '',

			MAPKIT_ORIGIN: process.env.MAPKIT_ORIGIN ?? '',
			MAPKIT_KEY: process.env.MAPKIT_KEY ?? '',

			FB_APP_ID: process.env.FB_APP_ID ?? '',
			FB_API_KEY: process.env.FB_API_KEY ?? '',
			FB_PROJECT_ID: process.env.FB_PROJECT_ID ?? '',
			FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN ?? '',
			FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET ?? '',
			FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID ?? '',
			FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID ?? ''
		}
	},

	routeRules: {
		// Sites routes
		'/': {
			redirect: '/signin'
		},
		'/signin': { prerender: true },
		'/about-us': { prerender: true },
		'/contact-us': { prerender: true },
		'/terms-of-use': { prerender: true },
		'/privacy-policy': { prerender: true },

		'/home': { ssr: false },
		'/groups': { ssr: false },
		'/groups/search': { ssr: false },
		'/events': { ssr: false },
		'/profile': { ssr: false },

		'/events/**': { ssr: true },
		'/groups/search/**': { ssr: true}

	},
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
			],
			meta: [
				{
					name: 'theme-color',
					content: '#262E57'
				}
			]
		}
	},

	robots: {
		blockAiBots: true,
		blockNonSeoBots: true
	},

	primevue: {
        options: {
            theme: {
                preset: Aura
            }
        }
    }
});