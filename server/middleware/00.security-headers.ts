/**
 * Security headers middleware.
 * The "00." prefix ensures this runs BEFORE storybook-headers.ts,
 * which removes X-Frame-Options in dev so Storybook iframes work.
 *
 * CSP is enforced — blocks requests to unlisted origins.
 */
export default defineEventHandler((event) => {
    // Prevent MIME-type sniffing
    setResponseHeader(event, 'X-Content-Type-Options', 'nosniff');

    // Block framing from external origins (SAMEORIGIN allows Firebase auth iframes)
    setResponseHeader(event, 'X-Frame-Options', 'SAMEORIGIN');

    // Control referrer information
    setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');

    // Enforce HTTPS (only meaningful in production behind TLS)
    setResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Allowed sources:
    //   - Apple MapKit (maps-api, apple-mapkit, snapshot)
    //   - Firebase (*.googleapis.com, *.firebaseio.com, *.firebaseapp.com)
    //   - Sentry ingest (*.ingest.us.sentry.io)
    //   - Google Analytics (*.google-analytics.com)
    //   - Self + inline (for Nuxt/Vue hydration)
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.apple-mapkit.com https://appleid.cdn-apple.com https://*.firebaseio.com https://apis.google.com https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://snapshot.apple-mapkit.com https://*.apple-mapkit.com https://*.googleapis.com https://www.googletagmanager.com",
        "font-src 'self' data:",
        "connect-src 'self' wss: https://api.olympsis.com https://maps-api.apple.com https://*.apple-mapkit.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.ingest.us.sentry.io https://*.google-analytics.com https://appleid.apple.com",
        "frame-src 'self' https://*.firebaseapp.com https://apis.google.com https://appleid.apple.com",
        "object-src 'none'",
        "base-uri 'self'",
    ].join('; ');

    setResponseHeader(event, 'Content-Security-Policy', csp);
});
