/**
 * Server-side endpoint that:
 * 1. Generates a MapKit JWT (by calling the token endpoint internally)
 * 2. Exchanges it with Apple for an access token
 *
 * Returns: { accessToken: string }
 */
export default defineEventHandler(async (event) => {
    // Re-use the token endpoint to get a signed JWT
    const { token } = await $fetch('/api/mapkit/token', { method: 'GET' });

    // Exchange the JWT for an Apple Maps access token
    const response = await $fetch<{ accessToken: string }>(
        'https://maps-api.apple.com/v1/token',
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    return { accessToken: response.accessToken };
});
