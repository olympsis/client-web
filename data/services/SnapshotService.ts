import { Endpoint, Method } from "malakbel";
import { BaseService } from './BaseService';

export class SnapshotService extends BaseService {

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
