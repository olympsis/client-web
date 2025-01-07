import { getAuth } from 'firebase/auth';
import { Venue, VenuesResponse } from '../models/VenueModels';
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';

export class VenueService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    async getVenues(lat: number, long: number, radius: number, sports: string): Promise<VenuesResponse | undefined> {
        let query = new Map<string, string>()
        query.set("latitude", String(lat));
        query.set("longitude", String(long));
        query.set("radius", String(radius));
        query.set("sports", sports)

        let headers = new Map<string, string>()
        headers.set("Authorization", "")

        const endpoint = new Endpoint("/v1/venues", query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (body) {
            return VenuesResponse.decode(body);
        } else {
            return undefined;
        }
    }

    async getVenue(id: string) : Promise<Venue | undefined> {

        let token = await getAuth().currentUser?.getIdToken() ?? ""
        let headers = new Map<string, string>()
        headers.set("Authorization", token)

        const endpoint = new Endpoint(`/v1/venues/${id}`);

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
        if (status === 200) {
            if (body) {
                return Venue.decode(body);
            }
        }

        return undefined;
    }
}

