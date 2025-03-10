import { Location } from "../models/GenericModels";
import { useModelStore } from "@/stores/model-store";
import { useSessionStore } from "~/stores/session-store";
import { useAuthStore } from "~/stores/auth-store";
import { getMapkitServerToken } from "~/utils/map-helpers";
import type { Venue } from "~/data/models/VenueModels";
import type { Event } from "~/data/models/EventModels";

/**
 * Location Manager handles all location events and features.
 * Talks with browser api and reacts to location updates and fetches necessary data.
 */
export class LocationManager {
    public lastKnownLocation: Location | undefined;
    public authorizationStatus: PermissionState = "prompt";
    private locationTimeoutMs: number = 3000; // 3 seconds timeout for location
    
    private genericFallBackLocation = new Location(
        40.76553,
        -73.97770,
        'Manhattan',
        'New York',
        'NY',
        '',
        'United States',
        'US'
    );

    /**
     * Requests location access from the user
     * 
     * @returns a promise containing the permission state
     */
    public async requestLocationPermission(): Promise<PermissionState> {
        return new Promise((resolve, reject) => {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((permissionStatus) => {
                    if (permissionStatus.state === 'granted') {
                        resolve('granted');
                    } else if (permissionStatus.state === 'prompt') {
                        navigator.geolocation.getCurrentPosition(
                            () => {
                                resolve('granted');
                            },
                            () => {
                                resolve('denied');
                            },
                            { enableHighAccuracy: true }
                        );
                    } else {
                        resolve('denied');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
  
    /**
     * Checks the browser to see if we have location access
     * 
     * @returns a promise containing the permission state
     */
    public hasLocationAccess(): Promise<PermissionState> {
        return new Promise((resolve, reject) => {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((permissionStatus) => {
                    if (permissionStatus.state === 'granted') {
                        resolve('granted');
                    } else if (permissionStatus.state === 'prompt') {
                        resolve('prompt');
                    } else {
                        resolve('denied');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * A promise wrapper to await location update from the browser
     * 
     * @param options object for position options
     * @returns a promise that gets the location from the browser
     */
    public getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    /**
     * Gets the user's current position with a timeout
     * If the position isn't determined within the timeout, falls back to default location
     * 
     * @returns A promise that resolves to a Location object
     */
    private async getPositionWithTimeout(): Promise<{ location: Location, permissionState: PermissionState }> {
        const permissionState = await this.hasLocationAccess();
        
        // If permissions denied, return fallback immediately
        if (permissionState === 'denied') {
            return { 
                location: this.genericFallBackLocation, 
                permissionState 
            };
        }
        
        // Create a promise that rejects after timeout
        const timeoutPromise = new Promise<GeolocationPosition>((_, reject) => {
            setTimeout(() => reject(new Error('Location request timed out')), this.locationTimeoutMs);
        });
        
        try {
            // Race between getting position and timeout
            const position = await Promise.race([
                this.getCurrentPosition({ maximumAge: 300000 }),
                timeoutPromise
            ]);
            
            const { latitude, longitude } = position.coords;
            return { 
                location: new Location(latitude, longitude), 
                permissionState 
            };
        } catch (error) {
            // Fixed type error by casting error to a standard Error object
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log('Using fallback location due to:', errorMessage);
            
            return { 
                location: this.genericFallBackLocation, 
                permissionState: permissionState === 'granted' ? 'granted' : 'denied' 
            };
        }
    }

    /**
     * Checks for geo location authorization on browser and fetches location data.
     * Returns a promise that resolves when location processing is complete.
     * 
     * @returns A promise that resolves when location processing is complete
     */
    public async listenToLocationUpdates(): Promise<void> {
        const config = useRuntimeConfig();
        
        if (!navigator.geolocation) {
            await this.fetchLocationData('not-supported', this.genericFallBackLocation);
            if (config.public.MODE === 'dev') {
                console.error("LOCATION SERVICES: Geolocation is not supported by this browser.");
            }
            return;
        }
        
        try {
            // Get position with timeout handling
            const { location, permissionState } = await this.getPositionWithTimeout();
            
            // Now fetch location data with position
            await this.fetchLocationData(permissionState, location);
            
            if (config.public.MODE === 'dev') {
                console.log(`LOCATION SERVICES: (UPDATE) \n lat: ${location.latitude} \n long: ${location.longitude}`);
            }
        } catch (error) {
            // Final fallback if something goes wrong
            await this.fetchLocationData('denied', this.genericFallBackLocation);
            if (config.public.MODE === 'dev') {
                console.error('LOCATION SERVICES: Unexpected error:', error);
            }
        }
    }

    /**
     * Creates a request to apple APIs to get a mapkit token.
     * Then we make a reverse geocode lookup to apple mapkit API to find more information about the coordinates.
     * We store that into our last known location for later use.
     * 
     * @param location an object containing latitude and longitude to look up
     */
    public async reverseGeocode(location: { lat: number, long: number })  {
        try {
            const token = await getMapkitServerToken();
            const response = await fetch(
                `https://maps-api.apple.com/v1/reverseGeocode?loc=${location.lat}, ${location.long}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            // Decode response
            const json = await response.json();
            const results = json['results'];
            const result = results[0];

            // Create last known location data
            const data = new Location(
                location.lat,
                location.long,
                result.structuredAddress.locality,
                result.structuredAddress.administrativeArea,
                result.structuredAddress.administrativeAreaCode,
                result.structuredAddress.postCode,
                result.country,
                result.countryCode
            );
            this.lastKnownLocation = data;
            return data;
        } catch (error) {
            const config = useRuntimeConfig();
            // If we fail to get location then we fall back on generic location
            this.lastKnownLocation = this.genericFallBackLocation;
            if (config.public.MODE === 'dev') {
                console.debug('Failed to reverse geocode location. Error:', error);
            }
            return this.genericFallBackLocation;
        }
    }

    /**
     * Calls backend to get events and venues in the area and then store the last known location
     * 
     * @param permission - permission state value
     * @param location - object that contains long/lat
     */
    public async fetchLocationData(permission: string, location: Location) {
		const store = useModelStore();
		const authStore = useAuthStore();
		const session = useSessionStore();
	
		// Start reverse geocoding right away
		const localeInfoPromise = this.reverseGeocode({ lat: location.latitude, long: location.longitude });
		
		// Always update location in session state
		session.$patch({
			lastKnownLocation: location,
			hasLocation: permission === 'granted' || permission === 'prompt'
		});
		
		// Define proper type for the event data response
		type EventDataResponse = { venues: Venue[], events: Event[] } | null;
		
		// Check if we can fetch venue/event data
		if (!authStore.isAuthenticated || !session.user?.sports || session.user.sports.length === 0) {
			console.log('Skipping venue data fetch: User not authenticated or sports preferences not available');
			return;
		}
		
		try {
			// Get sports from user data - ensure it exists
			const sports = session.user.sports.map((s) => s.valueOf()).join(',');
			
			// Fetch nearby data with user sports preferences
			const eventDataResponse = await session.eventService.getNearbyData(
				location.latitude, 
				location.longitude, 
				1000000, 
				sports
			) as EventDataResponse;
			
			// Process venue and event data
			if (eventDataResponse) {
				const venues = eventDataResponse.venues ?? [];
				const events = eventDataResponse.events ?? [];
				
				store.setVenues(venues);
				store.setEvents(events);
				
				session.$patch({
					venues: venues,
					events: events
				});
			}
		} catch (error) {
			console.error('Failed to fetch nearby data:', error);
		}
	}
}