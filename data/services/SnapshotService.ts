import { getAuth } from "firebase/auth";
import { ImageUploadResponse } from "../models/GenericModels";
import { Courrier, Endpoint, FileType, Method, Scheme } from "malakbel";

export class SnapshotService {
    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }
    
    public async getMapSnapshot(name: string): Promise<Blob> {
        // Add retry mechanism for token retrieval
        const getToken = async (maxRetries: number = 5, delayMs: number = 500): Promise<string> => {
            let retries = 0;
            
            while (retries < maxRetries) {
                const token = await getAuth().currentUser?.getIdToken();
                
                if (token) {
                    return token;
                }
                
                console.log(`Token is undefined, retrying (${retries + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, retries))); // Exponential backoff
                retries++;
            }
            
            throw new Error('Failed to retrieve token after multiple attempts');
        };
        
        // Get token with retry mechanism
        const token = await getToken();
        
        const headers = new Map<string, string>();
        headers.set('Authorization', token);
    
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
    
        const url = `https://${this.http.host}${endpoint.path}${endpoint.mapToQueryString()}`
    
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