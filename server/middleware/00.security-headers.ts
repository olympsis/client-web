/**
 * Security headers middleware.
 * The "00." prefix ensures this runs BEFORE storybook-headers.ts,
 * which removes X-Frame-Options in dev so Storybook iframes work.
 *
 * Using Content-Security-Policy-Report-Only initially so nothing breaks.
 * Once verified in production, switch to Content-Security-Policy to enforce.
 */
export default defineEventHandler((event) => {
    // Prevent MIME-type sniffing
    setResponseHeader(event, 'X-Content-Type-Options', 'nosniff');

    // Block framing (Storybook middleware removes this in dev)
    setResponseHeader(event, 'X-Frame-Options', 'DENY');

    // Control referrer information
    setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');

    // Enforce HTTPS (only meaningful in production behind TLS)
    setResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // CSP in report-only mode — allows everything to work while logging violations.
    // Allowed sources:
    //   - Apple MapKit (maps-api, apple-mapkit, snapshot)
    //   - Firebase (*.googleapis.com, *.firebaseio.com, *.firebaseapp.com)
    //   - Sentry ingest (*.ingest.us.sentry.io)
    //   - Google Analytics (*.google-analytics.com)
    //   - Self + inline (for Nuxt/Vue hydration)
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://snapshot.apple-mapkit.com https://*.apple-mapkit.com https://*.googleapis.com",
        "font-src 'self' data:",
        "connect-src 'self' https://maps-api.apple.com https://*.apple-mapkit.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://*.ingest.us.sentry.io https://*.google-analytics.com",
        "frame-src 'self' https://*.firebaseapp.com",
        "object-src 'none'",
        "base-uri 'self'",
    ].join('; ');

    setResponseHeader(event, 'Content-Security-Policy-Report-Only', csp);
});
