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

    /**
     * Retries an async operation up to maxRetries times with exponential backoff
     * when the operation returns a 500-level status code.
     * @param fn - function that returns [status, ...rest] tuple
     * @param maxRetries - number of retry attempts (default 3)
     * @returns the result of the operation
     */
    protected async withRetry<T extends [number, ...any[]]>(
        fn: () => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        let lastResult: T | undefined;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            lastResult = await fn();
            const status = lastResult[0];

            // Only retry on 500-level errors
            if (status < 500 || attempt === maxRetries) {
                return lastResult;
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt) * 1000;
            console.warn(`Request failed with status ${status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return lastResult!;
    }
}
