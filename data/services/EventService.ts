import { getAuth } from 'firebase/auth'
import type { Venue } from '../models/VenueModels';
import { Courrier, Endpoint, Method, Scheme } from "malakbel";
import type { ParticipantDao } from '../models/GenericModels';
import { Event, EventDao, EventsResponse, LocationResponse, NewEventDao, CommentReactionDao } from "../models/EventModels";
import { COMMENT_REACTION_TYPE } from "../Enums";

export class EventService {

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

    async createEvent(dao: NewEventDao) : Promise<string | null> {
        const headers = await this.getAuthHeaders();

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
        const headers = await this.getAuthHeaders();

        let query = new Map<string, string>();
        query.set("location", `${String(longitude)},${String(latitude)}`);
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

    async getUserPastEvents(uuid: string): Promise<Event[]> {
        try {
            const headers = await this.getAuthHeaders();

            const endpoint = new Endpoint(`/v1/events/past/user/${uuid}`);
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

            if (status !== 200) return [];
            if (!body) return [];

            const data = body as { [key: string]: any };
            return data.map((e: { [key: string]: any }) => Event.decode(e));
        } catch(error) {
            throw Error('Failed to get past events. Error: ' + error)
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

    async getEventAsJSON(id: string): Promise<string> {
        let headers = new Map<string, string>()
        const endpoint = new Endpoint(`/v1/events/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
        if (status == 200) {
            if (body) {
                return JSON.stringify(body);
            }
        }

        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }

    async getNearbyData(latitude: number, longitude: number, radius: number, sports: string): Promise<({ venues: Venue[], events: Event[] })> {
        const headers = await this.getAuthHeaders();

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
        const headers = await this.getAuthHeaders();

        const data = JSON.stringify(dao.encode());

        const endpoint = new Endpoint(`/v1/events/${id}/participants`);
        const [status, _headers, _] = await this.http.request(Method.POST, endpoint, data, headers);
        if (status == 200) {
            return true;
        }
        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }

    async removeParticipant(id: string, participantID?:string) : Promise<boolean> {
        const headers = await this.getAuthHeaders();

        var url = `/v1/events/${id}/participants`;
        let query = new Map<string, string>();
        if (participantID != undefined) {
            query.set("participantID", participantID);
            url += `/${participantID}`
        }

        const endpoint = new Endpoint(url);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        }
        throw ('NOT IMPLEMENTED - Failed to get event from server.');
    }

    async deleteEvent(id: string, deleteAll?: boolean): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        let query = new Map<string, string>();
        if (deleteAll) {
            query.set("deleteAll", deleteAll === true ? "true" : "false");
        }

        const endpoint = new Endpoint(`/v1/events/${id}`, query);
        const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
        if (status == 200) {
            return true;
        }
        return false;
    }

    /**
     * Adds an emoji reaction to a comment on an event.
     * Returns the new reaction's ID on success, or null on failure.
     */
    async addCommentReaction(eventId: string, commentId: string, type: COMMENT_REACTION_TYPE): Promise<string | null> {
        const headers = await this.getAuthHeaders();

        const dao = new CommentReactionDao(type);
        const data = JSON.stringify(dao.encode());

        const endpoint = new Endpoint(`/v1/events/${eventId}/comments/${commentId}/reactions`);
        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
            if (status === 201) {
                if (body) {
                    const resp = body as { [key: string]: any };
                    return resp['id'] ?? null;
                }
            } else {
                console.error(`Failed to add comment reaction. Status Code (${status})`);
            }
        } catch (error) {
            console.error(`Failed to add comment reaction: ${error}`);
        }
        return null;
    }

    /**
     * Removes an emoji reaction from a comment on an event.
     * Returns true on success, false on failure.
     */
    async removeCommentReaction(eventId: string, commentId: string, reactionId: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/events/${eventId}/comments/${commentId}/reactions/${reactionId}`);
        try {
            const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to remove comment reaction. Status Code (${status})`);
            }
        } catch (error) {
            console.error(`Failed to remove comment reaction: ${error}`);
        }
        return false;
    }
}