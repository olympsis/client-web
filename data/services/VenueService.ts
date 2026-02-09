import { getAuth } from 'firebase/auth';
import { Venue, VenuesResponse } from '../models/VenueModels';
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';

export class VenueService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        switch (config.public.MODE) {
            case 'dev':
                this.http = new Courrier(Scheme.HTTP, config.public.API);
                break;
            default:
                this.http = new Courrier(Scheme.HTTPS, config.public.API);
                break;
        }
    }

    /**
     * Builds auth headers based on the current environment.
     * Dev mode uses a static userID header; prod uses Firebase auth token.
     */
    private async getAuthHeaders(): Promise<Map<string, string>> {
        const config = useRuntimeConfig();
        let headers = new Map<string, string>();
        switch (config.public.MODE) {
            case 'dev':
                headers.set('userID', config.public.USER_ID);
                break;
            default:
                const token = await getAuth().currentUser?.getIdToken() ?? ""
                headers.set('Authorization', token);
                break;
        }
        return headers;
    }

    async getVenues(lat: number, long: number, radius: number, sports: string): Promise<VenuesResponse | undefined> {
        let query = new Map<string, string>()
        query.set("latitude", String(lat));
        query.set("longitude", String(long));
        query.set("radius", String(radius));
        query.set("sports", sports)

        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint("/v1/venues", query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (body) {
            return VenuesResponse.decode(body);
        } else {
            return undefined;
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

