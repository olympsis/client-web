/**
 * Distance helpers + the user's persisted search radius.
 *
 * The whole app talks to the API in METERS, but humans think in miles, so the
 * UI converts. This module is the single source of truth for:
 *   - the miles ⇄ meters conversion
 *   - the default search radius (50 mi)
 *   - reading / writing the user's chosen radius from localStorage
 *
 * Both the "nearby data" fetches (on app open) and the events/venues filter
 * read `getStoredSearchRadiusMeters()`, so once the user picks a distance it
 * sticks across sessions and is reused everywhere.
 */

/** One statute mile in meters. */
export const METERS_PER_MILE = 1609.34;

/** Convert miles → meters (rounded — the API only cares about whole meters). */
export function milesToMeters(miles: number): number {
    return Math.round(miles * METERS_PER_MILE);
}

/** Convert meters → miles (unrounded; round at the call site if needed). */
export function metersToMiles(meters: number): number {
    return meters / METERS_PER_MILE;
}

/** Default search radius before the user picks one: 50 miles, in meters. */
export const DEFAULT_SEARCH_RADIUS_METERS = milesToMeters(50);

/** localStorage key holding the user's chosen search radius, in meters. */
const RADIUS_STORAGE_KEY = 'olympsis-search-radius-meters';

/**
 * The user's persisted search radius in meters, or the 50-mile default if they
 * haven't set one yet (also the fallback when localStorage is unavailable, e.g.
 * during SSR).
 */
export function getStoredSearchRadiusMeters(): number {
    if (typeof localStorage === 'undefined') return DEFAULT_SEARCH_RADIUS_METERS;

    const raw = localStorage.getItem(RADIUS_STORAGE_KEY);
    if (!raw) return DEFAULT_SEARCH_RADIUS_METERS;

    const value = Number(raw);
    // Guard against a corrupt / non-positive cached value.
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_SEARCH_RADIUS_METERS;
}

/** Persist the user's chosen search radius (meters) for future fetches. */
export function setStoredSearchRadiusMeters(meters: number): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(RADIUS_STORAGE_KEY, String(meters));
}
