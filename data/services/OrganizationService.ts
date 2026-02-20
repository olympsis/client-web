import { Endpoint, Method } from "malakbel";
import { Organization, OrganizationDao } from "../models/OrganizationModels";
import type { ChangeRoleRequest } from "../models/GenericModels";
import { BaseService } from './BaseService';

export class OrganizationService extends BaseService {

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

    async getOrganizationAsJSON(id: string): Promise<string> {
        const endpoint = new Endpoint(`/v1/organizations/${id}`);
        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (status == 200) {
            if (body) {
                return JSON.stringify(body);
            }
        }

        throw (`ERROR NOT IMPLEMENTED YET - STATUS(${status})`);
    }

    async getOrganizations(state: string, country: string) {
        throw('NOT IMPLEMENTED')
    }

    async createOrganization(dao: OrganizationDao) : Promise<string | null> {
        const headers = await this.getAuthHeaders();

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
        const headers = await this.getAuthHeaders();

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

    /**
     * MODERATION
     */

    async changeMemberRank(clubID: string, memberID: string, request: ChangeRoleRequest): Promise<boolean> {
        const headers = await this.getAuthHeaders();
        const data = JSON.stringify(request.encode());

        const endpoint = new Endpoint(`/v1/organizations/${clubID}/members/${memberID}/rank`);
        const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, data, headers);

        if (status === 200) {
            return true;
        } else {
            return false;
        }
    }

    async kickMember(clubID: string, memberID: string): Promise<boolean> {
        const headers = await this.getAuthHeaders();

        const endpoint = new Endpoint(`/v1/organizations/${clubID}/members/${memberID}/kick`);
        const [status, _headers, body] = await this.http.request(Method.PUT, endpoint, undefined, headers);

        if (status === 200) {
            return true;
        } else {
            return false;
        }
    }
}
