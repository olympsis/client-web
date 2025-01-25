import * as jsrsasign from 'jsrsasign';
import { importPKCS8, SignJWT } from 'jose';
import { useSessionStore } from '@/stores/session-store';

/**
 * Token options for maps token
 * - teamID: Team ID from Apple Developer account
 * - keyID: Key ID from Apple Developer account
 * - privateKeyPath: The path to the private key file from your Apple Developer account (P8 format)
 * - expiresIn: Expiration time in seconds
 */
interface TokenOptions {
    teamId: string;
    keyId: string;
    privateKey: string;
    expiresIn: number;
}

/**
 * This function opens a new window that leads us either to Apple Maps on the device or Apple Maps on the web.
 * We check the userAgent to determine which application to route to.
 * 
 * @param coordinates Array containing [long,lat] of destination
 */
function getDirections(coordinates: Array<number>) {

    const longitude = coordinates[0]
    const latitude = coordinates[1]

    // Check if the user is on an Apple Platform
    const isMacOrIOS = /Macintosh|iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isMacOrIOS) {
        // Open Apple Maps
        const appleMapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
        window.open(appleMapsUrl, '_blank');
    } else {
        // Open Apple Maps on the Web
        const googleMapsUrl = `https://beta.maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
        window.open(googleMapsUrl, '_blank');
    }
}

/**
 * Fetches a token for mapkit from Apple Servers using token given to us by the developers console.
 * If we already have a token in the session store just return that.
 * 
 * @param token token from apple service keys
 * @returns a promise containing a token or undefined
 */
async function getMapkitServerToken() : Promise<string> {
    const session = useSessionStore();
    if (session.mapKitServerToken) {
        return session.mapKitServerToken;
    }

    try {
        const token = await generateMapkitAuthToken();
        const response = await fetch(
            'https://maps-api.apple.com/v1/token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        if (response.ok) {
            const json = await response.json();
            return json['accessToken'];
        } else {
            throw(`Status Code: ${response.status}`);
        }
    } catch (error) {
        throw(error);
    }
}

/**
 * Generates a mapkit auth token that we can use to generate a maps token to interact with the mapkit api.
 * 
 * @param options a Token Options Object
 * @returns a string promise containing the token
 */
function createMapsAuthToken(options: TokenOptions): string {
    const config = useRuntimeConfig();
    const { teamId, keyId, privateKey, expiresIn } = options;

    // Get the current time and expiration time in terms of seconds since UNIX Epoch
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + expiresIn;

    // Create the header
    const header = {
        alg: 'ES256',  // Algorithm used for signing
        kid: keyId,    // Key ID from Apple Developer account
        typ: 'JWT'     // Type of token
    };

    // Create the payload with required claims
    const payload = {
        iss: teamId,   // Issuer claim (team ID)
        iat: issuedAt,  // Issued at time (seconds since UNIX Epoch)
        exp: expiration, // Expiration time (seconds since UNIX Epoch)
        origin: config.public.MAPKIT_ORIGIN
    };

    // Create the JWT
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);

    // Clean the private key
    const cleanedKey = privateKey.replace(/\\n/g, '\n');

    // Sign the token using jsrsasign
    const sJWT = jsrsasign.KJUR.jws.JWS.sign(
        'ES256',           // algorithm
        sHeader,           // header
        sPayload,         // payload
        cleanedKey,       // private key
        'pkcs8pem'        // private key format
    );

    return sJWT;
}

/**
 * Fetches data from configs to generate the mapkit auth token needed for the real mapkit token.
 * If session store contains a token return that instead.
 * 
 * @returns returns the auth token string needed to get the maps token.
 */
async function generateMapkitAuthToken() : Promise<string> {
    const config = useRuntimeConfig();
    const session = useSessionStore();
    if (session.mapkitToken) {
        return session.mapkitToken;
    } else {
        const options: TokenOptions = {
            keyId: config.public.APL_KEY_ID,
            teamId: config.public.APL_TEAM_ID,
            privateKey: config.public.MAPKIT_KEY.trim(),
            expiresIn: 3600
        }

        const token = await createMapsAuthToken(options);
        session.mapkitToken = token;
        return token;
    }
}

/**
 * Fetches a map image of a location from the mapkitJS server API
 * @param location - [long, lat] or [city, state] position to get image for
 * @returns the blob data of the image 
 */
async function getMapSnapshot(location: any[]): Promise<Blob> {
    const config = useRuntimeConfig();
    const token = config.public.APL_MAPKIT_SNAPSHOT_TOKEN;
    const coordinates = location.join(',');
    const response = await fetch(
        `https://snapshot.apple-mapkit.com/api/v1/snapshot?center=${coordinates}&token=${token}`
    );

    if (!response.ok) {
        throw new Error(`Failed to get Map Snapshot. HTTP Error! Status: ${response.status}`);
    }

    return await response.blob();
}

/**
 * Generates a signed URL to fetch image from mapkitJS server
 * @param params - the string value of the query params for a mapkit snapshot
 * @returns 
 */
function generateMapSnapshotSignedURL(params: string): string {
    const config = useRuntimeConfig();
    const snapshotPath = `/api/v1/snapshot?${params}`;
    const completePath = `${snapshotPath}&teamId=${config.public.APL_TEAM_ID}&keyId=${config.public.APL_KEY_ID}`;
    const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withECDSA' });
    const key = jsrsasign.KEYUTIL.getKey(config.public.MAPKIT_KEY.trim());

    sig.init(key);
    sig.updateString(completePath);
    
    return `${completePath}&signature=${jsrsasign.hextob64(sig.sign())}`;
}

export {
    getDirections,
    getMapSnapshot,
    getMapkitServerToken,
    generateMapkitAuthToken,
    generateMapSnapshotSignedURL
}