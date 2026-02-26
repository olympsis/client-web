/**
 * Proxies image requests through the server to bypass CORS restrictions.
 * Only allows URLs from the Olympsis GCS bucket to prevent misuse as an open proxy.
 *
 * Usage: /api/image-proxy?url=https://storage.googleapis.com/olympsis-...
 */
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const url = query.url as string;

    if (!url) {
        throw createError({ statusCode: 400, message: 'Missing url parameter' });
    }

    // Only allow Olympsis GCS bucket URLs
    if (!url.startsWith('https://storage.googleapis.com/olympsis-')) {
        throw createError({ statusCode: 403, message: 'URL not allowed' });
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw createError({ statusCode: response.status, message: 'Failed to fetch image' });
    }

    const buffer = await response.arrayBuffer();

    setResponseHeader(event, 'Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

    return Buffer.from(buffer);
});
