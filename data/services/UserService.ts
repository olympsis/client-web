import * as Sentry from '@sentry/nuxt';
import { getAuth } from 'firebase/auth';
import { getAuthToken } from '~/utils/generic-helpers';
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';
import { CheckIn, UserData, UserDTO } from "../models/UserModels";


export class UserService {
    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API)
    }

    async checkIn() : Promise<CheckIn | undefined> {
        try {
            const token = await getAuthToken();
            let headers = new Map<string, string>()
            headers.set('Authorization', token)

            let endpoint = new Endpoint('/v1/users/check-in')
            const [_, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (!body) return undefined;
            return CheckIn.decode(body);
        } catch(error) {
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'check-in request');
                Sentry.captureException(error);
            });
            return undefined;
        }
    }

    async updateUserData(user: UserDTO): Promise<UserData | null> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        let data = JSON.stringify(user.encode());
        let endpoint = new Endpoint('/v1/users/user')
        const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers);

        if (status !== 200) return null;
        if (!body) return null;
        return UserData.decode(body);
    }

    async usernameAvailability(username: string): Promise<Boolean> {

        let headers = new Map<string, string>()

        let query = new Map<string, string>();
        query.set("username", username);

        let endpoint = new Endpoint('/v1/users/username', query)

        const [_, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
        if (!body) return false;
        const data = body as { [key: string]: any };
        return data['is_available'] as Boolean;
    }
}
