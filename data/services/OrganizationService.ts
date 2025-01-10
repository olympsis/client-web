import { getAuth } from "firebase/auth";
import { Courrier, Endpoint, Method, Scheme } from "malakbel";
import { Organization, OrganizationDao } from "../models/OrganizationModels";

export class OrganizationService {

    private http: Courrier;

    constructor() {
        const config = useRuntimeConfig();
        this.http = new Courrier(Scheme.HTTPS, config.public.API);
    }

    async getOrganization(id: string) : Promise<Organization | undefined> {
        let headers = new Map<string, string>();

        const endpoint = new Endpoint(`/v1/organizations/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, headers);

        if (status == 200) {
            if (body) {
                return Organization.decode(body);
            }
        }

        return undefined;
    }

    async getOrganizations(state: string, country: string) {
        throw('NOT IMPLEMENTED')
    }

    async createOrganization(dao: OrganizationDao) : Promise<string | null> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
        
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint("/v1/organizations");
        const data = JSON.stringify(dao);

        try {
            const [status, _headers, body] = await this.http.request(Method.POST, endpoint, data, headers); 
            if (status === 201) {
                if (body) {
                    const resp = body as { [key: string]: any }
                    return resp['id'];
                }
            } else {
                console.error(`Failed to create organization. Status Code (${status})`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to create organization: ${error}`);
            return null;
        }

        return null;
    }

    async modifyOrganization(dao: OrganizationDao): Promise<boolean> {
        return false;
    }

    async deleteOrganization(id: string) : Promise<boolean> {
        return false;
    }

    async leaveOrganization(id: string) : Promise<boolean> {
        let token = await getAuth().currentUser?.getIdToken() ?? ""
                
        let headers = new Map<string, string>();
        headers.set('Authorization', token);

        const endpoint = new Endpoint(`/v1/organizations/${id}/leave`);

        try {
            const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, undefined, headers); 
            if (status === 200) {
                return true;
            } else {
                console.error(`Failed to leave organization. Status Code (${status})`);
                return false;
            }
        } catch (error) {
            console.error(`Failed to organization club: ${error}`);
            return false;
        }
    }
}