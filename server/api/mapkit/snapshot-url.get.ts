import { SignJWT, importPKCS8 } from 'jose';
import { createSign } from 'crypto';

/**
 * Server-side endpoint that builds a signed Apple MapKit snapshot URL.
 * Accepts query params (e.g. center, size, scale, etc.) and returns
 * the full signed URL that the client can use in an <img> tag.
 *
 * Query params:
 *   - center (required): "longitude,latitude"
 *   - size (optional): e.g. "600x400"
 *   - scale (optional): 1 or 2
 *   - any other valid Apple snapshot params
 *
 * Returns: { url: string }
 */
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const teamId = config.APL_TEAM_ID;
    const keyId = config.APL_KEY_ID;
    const privateKeyPem = config.MAPKIT_KEY;

    if (!privateKeyPem || !teamId || !keyId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MapKit configuration is missing on the server.',
        });
    }

    // Build the query string from client-provided params
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    }

    // Construct the path that Apple expects to be signed
    const snapshotPath = `/api/v1/snapshot?${params.toString()}`;
    const completePath = `${snapshotPath}&teamId=${teamId}&keyId=${keyId}`;

    // Sign the path using ECDSA with SHA-256 (same algorithm the client used before with jsrsasign)
    const cleanedKey = privateKeyPem.replace(/\\n/g, '\n');
    const sign = createSign('SHA256');
    sign.update(completePath);
    const signatureBuffer = sign.sign(cleanedKey);
    const signature = signatureBuffer.toString('base64');

    const url = `https://snapshot.apple-mapkit.com${completePath}&signature=${signature}`;

    return { url };
});
