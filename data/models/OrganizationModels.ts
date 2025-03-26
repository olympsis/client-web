import { ClubDao } from './ClubModels';
import { Member, MemberDao } from './GenericModels';
import { Codable } from './Models';

class Organization extends Codable<Organization> {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    sports: Array<string> | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    logo: string | undefined;
    banner: string | undefined;
    members: Member[] | undefined;
    pinnedPostId: string | undefined;
    children: ClubDao[] | undefined;
    createdAt: Date | undefined;

    constructor(
        id?: string,
        name?: string,
        description?: string,
        sports?: Array<string>,
        city?: string,
        state?: string,
        country?: string,
        logo?: string,
        banner?: string,
        members?: Member[],
        pinnedPostId?: string,
        children?: ClubDao[],
        createdAt?: Date
    ) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.sports = sports;
        this.city = city;
        this.state = state;
        this.country = country;
        this.logo = logo;
        this.banner = banner;
        this.members = members;
        this.pinnedPostId = pinnedPostId;
        this.children = children;
        this.createdAt = createdAt;
    }

    static override decode<Organization>(data: { [key: string]: any }): Organization {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['description']) {
                object['description'] = data['description'];
            }
            if (data['sports']) {
                object['sports'] = data['sports'];
            }
            if (data['city']) {
                object['city'] = data['city'];
            }
            if (data['state']) {
                object['state'] = data['state'];
            }
            if (data['country']) {
                object['country'] = data['country'];
            }
            if (data['logo']) {
                object['logo'] = data['logo'];
            }
            if (data['banner']) {
                object['banner'] = data['banner'];
            }
            if (data['members']) {
                object['members'] = data['members'].map((member: any) => Member.decode(member));
            }
            if (data['pinned_post_id']) {
                object['pinnedPostId'] = data['pinned_post_id'];
            }
            if (data['children']) {
                object['children'] = data['children'].map((child: any) => ClubDao.decode(child));
            }
            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
        }

        Object.setPrototypeOf(object, Organization.prototype);
        return object;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.description) {
            data['description'] = this.description;
        }
        if (this.sports) {
            data['sports'] = this.sports;
        }
        if (this.city) {
            data['city'] = this.city;
        }
        if (this.state) {
            data['state'] = this.state;
        }
        if (this.country) {
            data['country'] = this.country;
        }
        if (this.logo) {
            data['logo'] = this.logo;
        }
        if (this.banner) {
            data['banner'] = this.banner;
        }
        if (this.members) {
            data['members'] = this.members.map(member => member.encode());
        }
        if (this.pinnedPostId) {
            data['pinned_post_id'] = this.pinnedPostId;
        }
        if (this.children) {
            data['children'] = this.children.map(child => child.encode());
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }
    
        return data;
    }
}

class OrganizationDao extends Codable<OrganizationDao> {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    sports: Array<string> | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    logo: string | undefined;
    banner: string | undefined;
    members: MemberDao[] | undefined;
    pinnedPostId: string | undefined;

    constructor(
        id: string | undefined,
        name: string | undefined,
        description: string | undefined,
        sports: Array<string> | undefined,
        city: string | undefined,
        state: string | undefined,
        country: string | undefined,
        logo: string | undefined,
        banner: string | undefined,
        members: MemberDao[] | undefined,
        pinnedPostId: string | undefined
    ) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.sports = sports;
        this.city = city;
        this.state = state;
        this.country = country;
        this.logo = logo;
        this.banner = banner;
        this.members = members;
        this.pinnedPostId = pinnedPostId;
    }

    static override decode<OrganizationDao>(data: { [key: string]: any }): OrganizationDao {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['description']) {
                object['description'] = data['description'];
            }
            if (data['sport']) {
                object['sport'] = data['sport'];
            }
            if (data['city']) {
                object['city'] = data['city'];
            }
            if (data['state']) {
                object['state'] = data['state'];
            }
            if (data['country']) {
                object['country'] = data['country'];
            }
            if (data['logo']) {
                object['logo'] = data['logo'];
            }
            if (data['banner']) {
                object['banner'] = data['banner'];
            }
            if (data['members']) {
                object['members'] = data['members'].map((memberData: any) => MemberDao.decode(memberData));
            }
            if (data['pinned_post_id']) {
                object['pinnedPostId'] = data['pinned_post_id'];
            }
        }

        return object as OrganizationDao;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.description) {
            data['description'] = this.description;
        }
        if (this.sports) {
            data['sports'] = this.sports;
        }
        if (this.city) {
            data['city'] = this.city;
        }
        if (this.state) {
            data['state'] = this.state;
        }
        if (this.country) {
            data['country'] = this.country;
        }
        if (this.logo) {
            data['logo'] = this.logo;
        }
        if (this.banner) {
            data['banner'] = this.banner;
        }
        if (this.members) {
            data['members'] = this.members.map(member => member.encode());
        }
        if (this.pinnedPostId) {
            data['pinned_post_id'] = this.pinnedPostId;
        }
    
        return data;
    }
}

export {
    Organization,
    OrganizationDao
}