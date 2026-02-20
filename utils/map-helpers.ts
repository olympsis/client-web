import { useSessionStore } from '@/stores/session-store';

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
 * Fetches an Apple Maps access token via the server-side endpoint.
 * The server signs the JWT with the private key (never exposed to the client)
 * and exchanges it with Apple for an access token.
 * Caches the token in the session store.
 *
 * @returns a promise containing the access token string
 */
async function getMapkitServerToken() : Promise<string> {
    const session = useSessionStore();
    if (session.mapKitServerToken) {
        return session.mapKitServerToken;
    }

    // Server endpoint handles JWT signing + Apple token exchange
    const { accessToken } = await $fetch<{ accessToken: string }>('/api/mapkit/server-token');
    session.mapKitServerToken = accessToken;
    return accessToken;
}

/**
 * Fetches a MapKit auth token (JWT) from the server-side endpoint.
 * The server signs the JWT — the private key never leaves the server.
 * Caches the token in the session store.
 *
 * @returns a promise containing the auth token string
 */
async function generateMapkitAuthToken() : Promise<string> {
    const session = useSessionStore();
    if (session.mapkitToken) {
        return session.mapkitToken;
    }

    // Server endpoint handles JWT creation with the private key
    const { token } = await $fetch<{ token: string }>('/api/mapkit/token');
    session.mapkitToken = token;
    return token;
}

/**
 * Fetches a map image of a location via the server-side signed snapshot URL.
 * The server signs the URL with the private key so it never touches the client.
 *
 * @param location - [long, lat] or [city, state] position to get image for
 * @returns the blob data of the image
 */
async function getMapSnapshot(location: any[]): Promise<Blob> {
    const coordinates = location.join(',');

    // Server builds the signed snapshot URL
    const { url } = await $fetch<{ url: string }>('/api/mapkit/snapshot-url', {
        query: { center: coordinates },
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to get Map Snapshot. HTTP Error! Status: ${response.status}`);
    }

    return await response.blob();
}

/**
 * Generates a signed snapshot URL via the server-side endpoint.
 * The server signs the URL with the private key so it never touches the client.
 *
 * @param params - the query params string for a mapkit snapshot (e.g. "center=40.7,-74.0&size=600x400")
 * @returns a promise containing the full signed URL
 */
async function generateMapSnapshotSignedURL(params: string): Promise<string> {
    // Parse the params string into key-value pairs for the server endpoint
    const searchParams = new URLSearchParams(params);
    const query: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
        query[key] = value;
    }

    const { url } = await $fetch<{ url: string }>('/api/mapkit/snapshot-url', { query });
    // Strip the base URL to return just the path+query (matching the old return format)
    return url.replace('https://snapshot.apple-mapkit.com', '');
}

export {
    getDirections,
    getMapSnapshot,
    getMapkitServerToken,
    generateMapkitAuthToken,
    generateMapSnapshotSignedURL
}
