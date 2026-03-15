import * as Sentry from '@sentry/nuxt';
import { Method, Endpoint } from 'malakbel';
import { CheckIn, UserData, UserDTO } from "../models/UserModels";
import { BaseService } from './BaseService';


export class UserService extends BaseService {

    async checkIn() : Promise<CheckIn | undefined> {
        try {
            const headers = await this.getAuthHeaders();

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
        const headers = await this.getAuthHeaders();

        let data = JSON.stringify(user.encode());
        let endpoint = new Endpoint('/v1/users/user')
        const [status, _headers, body] = await this.withRetry(
            () => this.http.request(Method.PUT, endpoint, data, headers)
        );

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
