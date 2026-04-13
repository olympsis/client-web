import { useSessionStore } from '@/stores/session-store';
import { SystemService } from '@/data/services/SystemService';

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
 * Fetches an Apple Maps access token from the backend server.
 * The backend handles JWT signing, Apple token exchange, and Redis caching.
 * Caches the token in the session store.
 *
 * @returns a promise containing the access token string
 */
async function getMapkitServerToken() : Promise<string> {
    const session = useSessionStore();
    if (session.mapKitServerToken) {
        return session.mapKitServerToken;
    }

    const service = new SystemService();
    const token = await service.getMapkitServerToken();
    session.mapKitServerToken = token;
    return token;
}

/**
 * Fetches a MapKit JS auth token (JWT) from the local Nuxt server endpoint.
 * This JWT contains the alg, kid, and origin claims that mapkit.init() requires.
 * Distinct from the access token used for REST API calls.
 * Caches the token in the session store.
 *
 * @returns a promise containing the JWT string
 */
async function generateMapkitAuthToken() : Promise<string> {
    const session = useSessionStore();
    if (session.mapkitToken) {
        return session.mapkitToken;
    }

    const { token } = await $fetch<{ token: string }>('/api/mapkit/token');
    session.mapkitToken = token;
    return token;
}

export {
    getDirections,
    getMapkitServerToken,
    generateMapkitAuthToken,
}
