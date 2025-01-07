import { UserData } from './UserModels';
import { Member, MemberDao } from './GenericModels';
import { OrganizationDao } from './OrganizationModels';

class Club {
    id: string | undefined;
    parent: OrganizationDao | undefined;
    name: string | undefined;
    description: string | undefined;
    sports: Array<string> | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    logo: string | undefined;
    banner: string | undefined;
    visibility: string | undefined;
    members: Member[] | undefined;
    tags: string[] | undefined;
    rules: string[] | undefined;
    pinnedPostId: string | undefined;
    createdAt: number | undefined;

    constructor(
        id?: string,
        parent?: OrganizationDao,
        name?: string,
        description?: string,
        sports?: Array<string>,
        city?: string,
        state?: string,
        country?: string,
        logo?: string,
        banner?: string,
        visibility?: string,
        members?: Member[],
        tags?: string[],
        rules?: string[],
        pinnedPostId?: string,
        createdAt?: number
    ) {
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.description = description;
        this.sports = sports;
        this.city = city;
        this.state = state;
        this.country = country;
        this.logo = logo;
        this.banner = banner;
        this.visibility = visibility;
        this.members = members;
        this.tags = tags;
        this.rules = rules;
        this.pinnedPostId = pinnedPostId;
        this.createdAt = createdAt;
    }

    static decode<Club>(data: { [key: string]: any }): Club {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['parent']) {
                object['parent'] = OrganizationDao.decode(data['parent']);
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
            if (data['visibility']) {
                object['visibility'] = data['visibility'];
            }
            if (data['members']) {
                object['members'] = data['members'].map((memberData: any) => Member.decode(memberData));
            }
            if (data['tags']) {
                object['tags'] = data['tags'];
            }
            if (data['rules']) {
                object['rules'] = data['rules'];
            }
            if (data['pinned_post_id']) {
                object['pinnedPostId'] = data['pinned_post_id'];
            }
            if (data['created_at']) {
                object['createdAt'] = data['created_at'];
            }
        }

        Object.setPrototypeOf(object, Club.prototype);

        return object;
    }
}

class ClubDao {
    id: string | undefined;
    parentId: string | undefined;
    name: string | undefined;
    description: string | undefined;
    sports: Array<string> | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    logo: string | undefined;
    banner: string | undefined;
    visibility: string | undefined;
    members: MemberDao[] | undefined;
    tags: string[] | undefined;
    rules: string[] | undefined;
    pinnedPostId: string | undefined;

    constructor(
        id: string | undefined,
        parentId: string | undefined,
        name: string | undefined,
        description: string | undefined,
        sports: Array<string> | undefined,
        city: string | undefined,
        state: string | undefined,
        country: string | undefined,
        logo: string | undefined,
        banner: string | undefined,
        visibility: string | undefined,
        members: MemberDao[] | undefined,
        tags: string[] | undefined,
        rules: string[] | undefined,
        pinnedPostId: string | undefined
    ) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.description = description;
        this.sports = sports;
        this.city = city;
        this.state = state;
        this.country = country;
        this.logo = logo;
        this.banner = banner;
        this.visibility = visibility;
        this.members = members;
        this.tags = tags;
        this.rules = rules;
        this.pinnedPostId = pinnedPostId;
    }

    static decode<ClubDao>(data: { [key: string]: any }): ClubDao {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['parent_id']) {
                object['parentId'] = data['parent_id'];
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
            if (data['visibility']) {
                object['visibility'] = data['visibility'];
            }
            if (data['members']) {
                object['members'] = data['members'].map((memberData: any) => MemberDao.decode(memberData));
            }
            if (data['tags']) {
                object['tags'] = data['tags'];
            }
            if (data['rules']) {
                object['rules'] = data['rules'];
            }
            if (data['pinned_post_id']) {
                object['pinnedPostId'] = data['pinned_post_id'];
            }
        }

        Object.setPrototypeOf(object, ClubDao.prototype);

        return object;
    }
}

interface ClubDao {
    encode(): { [key: string]: string }
}

ClubDao.prototype.encode = function(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    if (this.id) {
        data['id'] = this.id;
    }
    if (this.parentId) {
        data['parent_id'] = this.parentId;
    }
    if (this.name) {
        data['name'] = this.name;
    }
    if (this.description) {
        data['description'] = this.description;
    }
    if (this.sports) {
        data['sport'] = this.sports;
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
    if (this.visibility) {
        data['visibility'] = this.visibility;
    }
    if (this.members) {
        data['members'] = this.members.map((member: MemberDao) => member.encode());
    }
    if (this.tags) {
        data['tags'] = this.tags;
    }
    if (this.rules) {
        data['rules'] = this.rules;
    }
    if (this.pinnedPostId) {
        data['pinned_post_id'] = this.pinnedPostId;
    }

    return data;
}

class ClubsResponse {
    clubs: Club[]
    totalClubs: number

    constructor(
        clubs: Club[],
        totalClubs: number
    ) {
        this.clubs = clubs;
        this.totalClubs = totalClubs;
    }

    static decode(data: { [key: string]: any }): ClubsResponse {
        const object = Object();

        if (data) {
            object['totalClubs'] = data['total_clubs'] ?? 0
            object['clubs'] = data.clubs.map((c: { [key: string]: string }) => {
                return Club.decode(c);
            }) ?? [];
        }

        Object.setPrototypeOf(object, ClubsResponse.prototype);
        return object;
    }
}

class ClubApplication {
    id: string
    applicant: UserData | undefined
    status: string
    createdAt: number

    constructor(
        id: string,
        applicant: UserData | undefined,
        status: string,
        createdAt: number
    ){
        this.id = id;
        this.applicant = applicant;
        this.status = status;
        this.createdAt = createdAt;
    }

    static decode(data: { [key: string]: any }): ClubApplication {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            if (data['applicant']) {
                object['applicant'] = UserData.decode(data['applicant']);
            }
            object['status'] = data['status'];
            object['createdAt'] = data['created_at'];
        }

        Object.setPrototypeOf(object, ClubApplication.prototype);
        return object;
    }
}



class ClubApplicationDao {
    applicant: string | undefined
    clubID: string | undefined
    status: string | undefined

    constructor(
        applicant: string | undefined,
        clubID: string | undefined,
        status: string | undefined,
    ){
        this.applicant = applicant;
        this.clubID = clubID;
        this.status = status;
    }
}

interface ClubApplicationDao {
    encode(): { [key: string]: string }
}

ClubApplicationDao.prototype.encode = function(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    if (this.status) {
        data['status'] = this.status;
    }
    if (this.clubID) {
        data['club_id'] = this.clubID;
    }
    if (this.applicant) {
        data['applicant'] = this.applicant;
    }

    return data;
}

class ClubApplicationsResponse {
    applications: ClubApplication[]
    totalApplications: number

    constructor(
        applications: ClubApplication[],
        totalApplications: number
    ) {
        this.applications = applications;
        this.totalApplications = totalApplications;
    }

    static decode(data: { [key: string]: any }): ClubApplicationsResponse {
        const object = Object();

        if (data) {
            object['totalApplications'] = data['total_applications'] ?? 0
            if (data['club_applications']) {
                object['applications'] = data['club_applications'].map((a: { [key: string]: string }) => {
                    return ClubApplication.decode(a);
                }) ?? [];
            } else {
                object['applications'] = [];
            }
        }

        Object.setPrototypeOf(object, ClubApplicationsResponse.prototype);
        return object;
    }
}

export {
    Club,
    ClubDao,
    ClubsResponse,

    ClubApplication,
    ClubApplicationDao,
    ClubApplicationsResponse
}