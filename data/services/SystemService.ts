import { Courrier, Method, Endpoint, Scheme } from 'malakbel';
import { ApplicationConfig } from '../models/GenericModels';

export class SystemService {

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

