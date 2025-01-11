import { Location } from "../models/GenericModels";
import { useModelStore } from "@/stores/model-store";
import { useSessionStore } from "~/stores/session-store";
import { getMapkitServerToken } from "@/utils/MapHelpers";

/**
 * Location Manager handles all location events and features.
 * Talks with browser api and reacts to location updates and fetches necessary data.
 */
export class LocationManager {
    public lastKnownLocation: Location | undefined;
    public authorizationStatus: PermissionState = "prompt"

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
     * Checks for geo location authorization on browser.
     * If we are authorized, we await a location update.
     * When location is updated we:
     * - do a reverse geocode lookup to get info about location.
     * - fetch event/venue data around the area
     * 
     * Then we log success or failure
     */
    public async listenToLocationUpdates() {
        const store = useModelStore();
        const session = useSessionStore();

        if (navigator.geolocation) {
            const hasPermissions = await this.hasLocationAccess()
            if (hasPermissions === 'granted' || hasPermissions === 'prompt') {
                try {
                    const position = await this.getCurrentPosition({
						enableHighAccuracy: true,
						maximumAge: 0,
						timeout: 250,
                    });
                    
                    const { latitude, longitude, accuracy } = position.coords;
                    const sports = session.user?.sports?.join(',') ?? '';
					this.lastKnownLocation = new Location(latitude, longitude);

                    // Two promises we want to wait for
                    const localeInfoPromise = this.reverseGeocode({ lat: latitude, long: longitude });
                    const localeDataPromise = session.eventService.getNearbyData(latitude, longitude, 1000000, sports);

                    const responses = await Promise.allSettled([
                        localeInfoPromise,
                        localeDataPromise,
                    ]);

                    if (responses[1].status === "fulfilled") {
                        const venues = responses[1].value?.venues ?? [];
                        const events = responses[1].value?.events ?? [];
                        store.setVenues(venues);
                        store.setEvents(events);
						
                        session.$patch({
                            venues: venues,
                            events: events,
                            lastKnownLocation: this.lastKnownLocation,
                            hasLocation: hasPermissions === 'granted' || hasPermissions === 'prompt'
                        });
                    } else {
						session.$patch({
							lastKnownLocation: this.lastKnownLocation,
							hasLocation: hasPermissions === 'granted' || hasPermissions === 'prompt'
						});
					}

                    console.log(
                      `LOCATION SERVICES: (UPDATE) \n long: ${latitude} \n lat: ${longitude} \n acc: ${accuracy} meters`
                    );
                  } catch (error: any) {
                        switch (error.code) {
                            case 1:
                                console.log('LOCATION SERVICES: Unable to get location. Permission denied.');
                                break;
                            case 2:
                                console.log('LOCATION SERVICES: Unable to get location. Position unavailable.');
                                break;
                            case 3:
                                console.log('LOCATION SERVICES: Unable to get location. Position timed out.');
                                break;
                            default:
                                console.error(`LOCATION SERVICES: Error Code: ${error.code}, Message: ${error.message}`);
                                break;
                        }

                        session.$patch({
                            hasLocation: hasPermissions === 'granted' || hasPermissions === 'prompt'
                        });
                }
            } else {
                console.log('LOCATION SERVICES: Unable to get location. Permission denied.');
            }
        } else {
          console.error("LOCATION SERVICES: Geolocation is not supported by this browser.");
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
			)

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
		} catch (error) {
			console.error(`Failed to reverse geocode location: ${error}`);
		}
    }
}