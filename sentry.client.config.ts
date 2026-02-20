import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: useRuntimeConfig().public.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  environment: process.env.MODE == 'dev' ? 'development' : 'production',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.MODE == 'dev',
});
