import { getAuth } from "firebase/auth";
import { ImageUploadResponse } from "../models/GenericModels";
import { Courrier, Endpoint, FileType, Method, Scheme } from "malakbel";

export class SnapshotService {
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

    public async getMapSnapshot(name: string): Promise<Blob> {
        const headers = await this.getAuthHeaders();

        let query = new Map<string, string>();
        query.set("center", name);
    
        const endpoint = new Endpoint('/v1/map-snapshot', query);
    
        // TODO: This code belongs in the Malakbel package. For some reason the function is ignoring the headers.
        // I am probably overlooking something simple. I do not have the time to deal with this at the moment.
        var options: { 
            method: string,
            body: any | undefined,
            headers: any | undefined
        } = {
            method: "GET",
            body: undefined,
            headers: undefined
        };
    
        const config = useRuntimeConfig();
        const scheme = config.public.MODE === 'dev' ? 'http' : 'https';
        const url = `${scheme}://${this.http.host}${endpoint.path}${endpoint.mapToQueryString()}`
    
        headers.set('Content-Type', 'image/png');
    
        options.headers = Object.fromEntries(headers);
        options.method = Method.GET
    
        const response = await fetch(url, options)
        const [status, _headers, body] = [response.status, response.headers, await response.blob()];
    
        if (status === 200) {
            if (body) {
                return body
            }
        }
    
        throw(`Status not ok. Status: ${status}`)
    }
}