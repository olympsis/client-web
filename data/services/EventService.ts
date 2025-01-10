import { getAuth } from 'firebase/auth'
import type { Venue } from '../models/VenueModels';
import { Courrier, Endpoint, Method, Scheme } from "malakbel";
import type { ParticipantDao } from '../models/GenericModels';
import { Event, EventDao, EventsResponse, LocationResponse } from "../models/EventModels";

export class EventService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    async createEvent(dao: EventDao) : Promise<string | null> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint("/v1/events");
        const data = JSON.stringify(dao.encode());

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers); 
            if (status === 201) {
                if (body) {
                    const resp = body as { [key: string]: any }
                    return resp['id'];
                }
            } else {
                console.error(`Failed to create event. Status Code (${status})`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to create event: ${error}`);
            return null;
        }

        return null;
    }

    async getEvents(latitude: number, longitude: number, radius: number, sports: string, status: string, skip: number, limit: number): Promise<Event[]> {
        let token = await getAuth().currentUser?.getIdToken() ?? "";

        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        let query = new Map<string, string>();
        query.set("latitude", String(latitude));
        query.set("longitude", String(longitude));
        query.set("radius", String(radius));
        query.set("sports", sports);
        query.set("status", status);
        query.set("skip", `${skip}`);
        query.set("limit", `${limit}`);

        const endpoint = new Endpoint('/v1/events', query);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 204) {
                return [];
            } else {
                if (body) {
                    const response = EventsResponse.decode(body);
                    return response.events;
                } else {
                    return [];
                }
            }
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    async getEvent(id: string) : Promise<Event> {
        let headers = new Map<string, string>()
        const endpoint = new Endpoint(`/v1/events/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
        if (status == 200) {
            if (body) {
                return Event.decode(body);
            }
        }
        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }

    async getNearbyData(latitude: number, longitude: number, radius: number, sports: string): Promise<({ venues: Venue[], events: Event[] })> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        let query = new Map<string, string>();
        query.set("latitude", String(latitude));
        query.set("longitude", String(longitude));
        query.set("radius", String(radius));
        query.set("sports", sports);
        query.set("status", "pending,live");
        query.set("limit", "100");

        const endpoint = new Endpoint("/v1/events/location", query);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 204) {
                return { venues: [], events: [] };
            } else {
                if (body) {
                    const response = LocationResponse.decode(body);
                    return { venues: response.venues, events: response.events };
                } else {
                    return { venues: [], events: [] };
                }
            }
        } catch (error) {
            console.error(error)
            return { venues: [], events: [] };
        }
    }

    async addParticipant(id: string, dao: ParticipantDao) : Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        const data = JSON.stringify(dao);

        const endpoint = new Endpoint(`/v1/events/${id}/participants`);
        const [status, _headers, _] = await this.http.request(Method.POST, endpoint, data, headers);
        if (status == 200) {
            return true;
        }
        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }

    async removeParticipant(id: string) : Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        // FIXME: added 000 behind just to spoof server update this on the server so we no longer need participant ID
        const endpoint = new Endpoint(`/v1/events/${id}/participants/000`);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        }
        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }
}