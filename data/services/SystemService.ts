import { Method, Endpoint } from 'malakbel';
import { ApplicationConfig } from '../models/GenericModels';
import { BaseService } from './BaseService';

export class SystemService extends BaseService {

    async getConfig(): Promise<ApplicationConfig> {
        let query = new Map<string, string>()

        const endpoint = new Endpoint("/v1/system/config", query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (status == 200 && body) {
            return ApplicationConfig.decode(body);
        } else {
            throw('Unexpected error.');
        }
    }

    /**
     * Fetches an Apple Maps access token from the backend.
     * The server handles JWT signing, Apple token exchange, and Redis caching.
     *
     * @returns the access token string
     */
    async getMapkitServerToken(): Promise<string> {
        const headers = await this.getAuthHeaders();
        const endpoint = new Endpoint("/v1/system/mapkit-server-token");

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (status == 200 && body) {
            const resp = body as { [key: string]: any };
            return resp['token'];
        } else {
            throw('Failed to get MapKit server token.');
        }
    }
}
