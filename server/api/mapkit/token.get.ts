import { SignJWT, importPKCS8 } from 'jose';

/**
 * Server-side MapKit JWT generator.
 * Signs a JWT with the Apple MapKit private key using ES256.
 * This keeps the private key off the client entirely.
 *
 * Returns: { token: string }
 */
export default defineEventHandler(async () => {
    const config = useRuntimeConfig();

    const teamId = config.APL_TEAM_ID;
    const keyId = config.APL_KEY_ID;
    const privateKeyPem = config.MAPKIT_KEY;
    const origin = config.public.MAPKIT_ORIGIN;

    if (!privateKeyPem || !teamId || !keyId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MapKit configuration is missing on the server.',
        });
    }

    // Clean the PEM key that may arrive mangled from env vars / Docker build-args.
    // Handles: literal "\n" strings, double-escaped "\\n", surrounding quotes,
    // and keys stored as a single line without any newline markers.
    let cleanedKey = privateKeyPem
        .replace(/^["']|["']$/g, '')   // strip surrounding quotes
        .replace(/\\n/g, '\n');        // convert literal \n to real newlines

    // If the key is still a single line (no real newlines between header/footer),
    // reconstruct proper PEM format by inserting newlines every 64 chars.
    if (!cleanedKey.includes('\n') || cleanedKey.split('\n').length <= 3) {
        const base64Body = cleanedKey
            .replace(/-----BEGIN PRIVATE KEY-----/g, '')
            .replace(/-----END PRIVATE KEY-----/g, '')
            .replace(/\s/g, '');

        // Re-wrap at 64-char lines per PEM spec
        const wrapped = base64Body.match(/.{1,64}/g)?.join('\n') ?? base64Body;
        cleanedKey = `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----`;
    }

    const privateKey = await importPKCS8(cleanedKey, 'ES256');

    const now = Math.floor(Date.now() / 1000);

    const jwt = await new SignJWT({ origin })
        .setProtectedHeader({ alg: 'ES256', kid: keyId, typ: 'JWT' })
        .setIssuer(teamId)
        .setIssuedAt(now)
        .setExpirationTime(now + 3600) // 1 hour
        .sign(privateKey);

    return { token: jwt };
});
