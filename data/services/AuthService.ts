import { getAuth } from 'firebase/auth';
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';
import { AuthRequest, AuthResponse } from '../models/AuthModels';

/**
 * Contains the all of the network calls needed to handle authentication with the server.
 */
export class AuthService {
    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    /**
     * Registers a new user with the server
     * 
     * @param request - object containing user info
     * @returns a promise containing an AuthResponse Object or null if failed
     */
    async register(request: AuthRequest): Promise<AuthResponse | null> {
        let headers = new Map<string, string>();

        const data = JSON.stringify(request.encode());
        const endpoint = new Endpoint("/v1/auth/register");
        
        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
            if (status === 200) {
                if (body) {
                    return AuthResponse.decode(body);
                } else {
                    console.error('Failed to decode AuthResponse response body.');
                }
            }
        } catch (error) {
            console.error(`Failed to register user. Error: ${error}`)
        }

        return null;
    }

    /**
     * Logs in an existing user with the server
     * 
     * @param request - object containing user info
     * @returns a promise containing an AuthResponse Object or null if failed
     */
    async login(request: AuthRequest): Promise<AuthResponse | null>  {
        const auth = getAuth();
        let headers = new Map<string, string>();

        const data = JSON.stringify(request.encode());
        const endpoint = new Endpoint("/v1/auth/login");

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers);
            if (status === 200) {
                if (body) {
                    return AuthResponse.decode(body);
                } else {
                    console.error('Failed to decode AuthResponse response body.');
                }
            }
        } catch(error) {
            console.error(`Failed to log in user. Error: ${error}`)
        }

        return null;
    }

    /**
     * Logs out the user from the server
     * 
     * @returns a promise boolean wether or not the action was successful
     */
    async logout(): Promise<Boolean>  {
        const auth = getAuth();
        let token = await auth.currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint("/v1/auth/logout");

        try {
            const [status, _headers, _] = await this.http.request(Method.POST, endpoint, undefined, headers);
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to log out user. Status Code: ${status}`);
            }
        } catch(error) {
            console.error(`Failed to log out user. Error: ${error}`);
        }

        return false;
    }

    /**
     * Deletes the user's account from the server
     * 
     * @returns a promise boolean wether or not the action was successful
     */
    async deleteAccount(): Promise<Boolean>  {
        const auth = getAuth();
        let token = await auth.currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint("/v1/auth/delete");

        try {
            const [status, _headers, _] = await this.http.request(Method.DELETE, endpoint, undefined, headers);
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to delete account. Status Code: ${status}`);
            }
        } catch (error) {
            console.error(`Failed to delete account. Error: ${error}`)
        }

        return false;
    }
}