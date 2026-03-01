import { browserSessionPersistence, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        appId: config.public.FB_APP_ID,
        apiKey: config.public.FB_API_KEY,
        projectId: config.public.FB_PROJECT_ID,
        authDomain: config.public.FB_AUTH_DOMAIN,
        storageBucket: config.public.FB_STORAGE_BUCKET,
        measurementId: config.public.FB_MEASUREMENT_ID,
        messagingSenderId: config.public.FB_MESSAGING_SENDER_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const analytics = getAnalytics(app);

    nuxtApp.provide('auth', auth);
    nuxtApp.vueApp.provide('auth', auth);
    nuxtApp.provide('analytics', analytics);
    nuxtApp.vueApp.provide('analytics', analytics);
});