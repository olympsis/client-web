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
}
