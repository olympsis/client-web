import { getAuth } from 'firebase/auth';
import { Courrier, Scheme } from 'malakbel';

/**
 * Base class for all authenticated API services.
 * Centralizes HTTP client setup (HTTP in dev, HTTPS in prod) and auth header generation
 * so individual services don't duplicate this logic.
 */
export class BaseService {
    /** HTTP client — uses HTTP in dev mode, HTTPS otherwise */
    protected http: Courrier;

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
     * Dev mode uses a static userID header; prod uses a Firebase ID token.
     */
    protected async getAuthHeaders(): Promise<Map<string, string>> {
        const config = useRuntimeConfig();
        let headers = new Map<string, string>();
        switch (config.public.MODE) {
            case 'dev':
                headers.set('userID', config.public.USER_ID);
                break;
            default:
                const token = await getAuth().currentUser?.getIdToken() ?? "";
                headers.set('Authorization', token);
                break;
        }
        return headers;
    }
}
