import { SignJWT, importPKCS8 } from 'jose';

/**
 * Server-side MapKit JWT generator.
 * Signs a JWT with the Apple MapKit private key using ES256.
 * This keeps the private key off the client entirely.
 *
 * MapKit JS requires a signed JWT (with alg, kid, origin claims) for
 * mapkit.init(). This is distinct from the Apple Maps access token
 * used for REST API calls, which comes from the backend.
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

    // Clean escaped newlines that may come from env vars
    const cleanedKey = privateKeyPem.replace(/\\n/g, '\n');

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
