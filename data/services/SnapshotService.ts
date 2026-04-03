import { Endpoint, Method } from "malakbel";
import { BaseService } from './BaseService';

export class SnapshotService extends BaseService {

    public async getMapSnapshot(name: string): Promise<{ url: string }> {
        const headers = await this.getAuthHeaders();

        let query = new Map<string, string>();
        query.set("center", name);

        const endpoint = new Endpoint('/v1/map-snapshot', query);

        const config = useRuntimeConfig();
        const scheme = config.public.MODE === 'dev' ? 'http' : 'https';
        const url = `${scheme}://${this.http.host}${endpoint.path}${endpoint.mapToQueryString()}`

        const options = {
            method: Method.GET,
            headers: Object.fromEntries(headers),
        };

        const response = await fetch(url, options);

        if (response.status === 200) {
            const data = await response.json();
            return data as { url: string };
        }

        throw(`Status not ok. Status: ${response.status}`);
    }
}
