import { getAuth } from "firebase/auth";
import { Courrier, Endpoint, Method, Scheme } from "malakbel";
import { Club, ClubApplicationDao, ClubApplicationsResponse, ClubDao, ClubsResponse } from "../models/ClubModels";

export class ClubService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    async getClub(id: string) : Promise<Club | undefined> {
        const endpoint = new Endpoint(`/v1/clubs/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (status == 200) {
            if (body) {
                return Club.decode(body);
            }
        }

        return undefined;
    }

    async getClubAsJSON(id: string): Promise<string> {
        const endpoint = new Endpoint(`/v1/clubs/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (status == 200) {
            if (body) {
                JSON.stringify(body);
            }
        }

        throw (`ERROR NOT IMPLEMENTED YET - STATUS(${status})`);
    }

    async getClubs(state: string, country: string) : Promise<ClubsResponse | undefined> {
        
        const auth = getAuth();
        let token = await auth.currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs?country=${country}`);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                if (body) {
                    return ClubsResponse.decode(body);
                } else {
                    return undefined;
                }
            } else if (status === 204) {
                const data = {
                    'total_clubs': 0,
                    'clubs': []
                }
                return ClubsResponse.decode(data);
            } else {
                console.error(`Failed request status code: ${status}`);
                return undefined;
            }
        } catch(error) {
            console.error(`Failed request. ${error}`)
            return undefined;
        }
    }

    async createClub(dao: ClubDao) : Promise<string | null> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint("/v1/clubs");
        const data = JSON.stringify(dao.encode());

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers); 
            if (status === 201) {
                if (body) {
                    const resp = body as { [key: string]: any }
                    return resp['id'];
                }
            } else {
                console.error(`Failed to create club. Status Code (${status})`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to create club: ${error}`);
            return null;
        }

        return null;
    }

    async modifyClub(dao: ClubDao) : Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs/${dao.id}`);
        const data = JSON.stringify(dao);

        try {
            const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers); 
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to update club. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to update club: ${error}`);
            return false;
        }
    }

    async deleteClub(id: string): Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs/${id}`);

        try {
            const [status, _headers, body] = await this.http.request(Method.DELETE, endpoint, undefined, headers); 
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to delete club. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to delete club: ${error}`);
            return false;
        }
    }

    async leaveClub(id: String) : Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs/${id}/leave`);

        try {
            const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, undefined, headers); 
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to leave club. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to leave club: ${error}`);
            return false;
        }
    }

    async applyToClub(id: string): Promise<boolean> {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken() ?? '';

        const headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs/${id}/applications`);
        const [status, _headers, body] = await this.http.request(Method.POST, endpoint, undefined, headers);

        if (status === 201) {
            return true;
        } 

        return false;
    }

    async getApplicationRequests(id: string): Promise<ClubApplicationsResponse | null> {
        const auth = getAuth();
        let token = await auth.currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/clubs/${id}/applications`);

        try {
            const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);
            if (status === 200) {
                if (body) {
                    return ClubApplicationsResponse.decode(body);
                } else {
                    return null;
                }
            } else if (status === 204) {
                const data = {
                    'total_applications': 0,
                    'applications': []
                }
                return ClubApplicationsResponse.decode(data);
            } else {
                console.error(`Failed request status code: ${status}`);
                return null;
            }
        } catch(error) {
            console.error(`Failed request. ${error}`)
            return null;
        }
    }

    async modifyApplication(id: string, clubID: string, dao: ClubApplicationDao): Promise<boolean> {
        const auth = getAuth();
        let token = await auth.currentUser?.getIdToken() ?? ""

        let headers = new Map<string, string>();
        headers.set('Authorization', token);
        const data = JSON.stringify(dao.encode());

        const endpoint = new Endpoint(`/v1/clubs/${clubID}/applications/${id}`);
        const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers);

        if (status === 200) {
            return true;
        } else {
            return false;
        }
    }
}