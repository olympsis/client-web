import { getAuth } from 'firebase/auth'
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';
import { CheckIn, UserData, UserDTO } from "../models/UserModels";


export class UserService {
    private http: Courrier;

    constructor() {
        const url = process.env.API ?? '';
        this.http = new Courrier(Scheme.HTTPS, url)
    }

    public async checkIn() : Promise<CheckIn | undefined> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        let endpoint = new Endpoint('/v1/users/check-in')
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (body) {
            return CheckIn.decode(body);
        } else {
            return undefined
        }
    }

    async createUserData() {}

    async getUserData() {}

    async updateUserData(user: UserDTO): Promise<UserData | null> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>()
        headers.set('Authorization', token)

        let data = JSON.stringify(user.encode());
        let endpoint = new Endpoint('/v1/users/user')
        const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers);

        if (status === 200) {
            if (body) {
                return UserData.decode(body);
            }
        }

        return null
    }

    async usernameAvailability(username: string): Promise<Boolean> {

        let headers = new Map<string, string>()

        let query = new Map<string, string>();
        query.set("username", username);

        let endpoint = new Endpoint('/v1/users/username', query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (body) {
            const data = body as { [key: string]: any };
            return data['is_available'] as Boolean;
        } else {
            return false;
        }
    }
}
