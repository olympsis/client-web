import { Venue, VenuesResponse } from '../models/VenueModels';
import { Method, Endpoint } from 'malakbel';
import { BaseService } from './BaseService';

export class VenueService extends BaseService {

    async getVenues(lat: number, long: number, radius: number, sports: string): Promise<VenuesResponse | undefined> {
        let query = new Map<string, string>()
        query.set("latitude", String(lat));
        query.set("longitude", String(long));
        query.set("radius", String(radius));
        query.set("sports", sports)

        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint("/v1/venues", query)

        /*
           Malakbel JSON-decodes the response body inside `request()`, so a
           204 No Content (empty body) raises a `SyntaxError: The string did
           not match the expected pattern` *before* we get a chance to
           inspect the status. Wrap the call so 204 / empty-body responses
           resolve to an empty venues list instead of bubbling up as a
           decode failure that nukes the explorer.
        */
        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

            if (status === 204 || !body) {
                return VenuesResponse.decode({ venues: [], total_venues: 0 });
            }
            return VenuesResponse.decode(body);
        } catch (err) {
            if (err instanceof SyntaxError) {
                return VenuesResponse.decode({ venues: [], total_venues: 0 });
            }
            throw err;
        }
    }

    async getVenue(id: string) : Promise<Venue | undefined> {

        let headers = new Map<string, string>()
        const endpoint = new Endpoint(`/v1/venues/${id}`);

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
        if (status === 200) {
            if (body) {
                return Venue.decode(body);
            }
        }

        return undefined;
    }

    async getVenueAsJSON(id: string) : Promise<string> {
        const endpoint = new Endpoint(`/v1/venues/${id}`);

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);
        if (status === 200) {
            if (body) {
                return JSON.stringify(body);
            }
        }

        throw (`ERROR NOT IMPLEMENTED YET - STATUS(${status})`);
    }
}
