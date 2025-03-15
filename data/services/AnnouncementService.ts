import type { getAuth } from "firebase/auth";
import { Courrier, Endpoint, Method, Scheme } from "malakbel";
import type { AuthRequest, AuthResponse } from "../models/AuthModels";
import { AnnouncementsResponse } from "../models/AnnouncementModels";

/**
 * Contains the all of the network calls needed to handle announcements with the server.
 */
export class AnnouncementService {
    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    /**
     * Gets announcements from the server
     * 
     * @returns a promise containing an array of announcements
     */
    async getAnnouncements(): Promise<AuthResponse | null> {
        let headers = new Map<string, string>();

        const endpoint = new Endpoint("/v1/announcements");
        
        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                if (body) {
                    return AnnouncementsResponse.decode(body);
                } else {
                    console.error('Failed to decode Announcements response body.');
                }
            }
        } catch (error) {
            console.error(`Failed to get announcements. Error: ${error}`)
        }

        return null;
    }
}