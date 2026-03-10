import { stringToSport, type SPORTS } from '../Enums';
import { Club } from './ClubModels';
import { Invitation } from './GenericModels';
import { Codable } from './Models';
import { Organization } from './OrganizationModels';

class UserData extends Codable<UserData> {
    uuid: string | undefined;
    username: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    imageURL: string | undefined;
    visibility: string | undefined;
    bio: string | undefined;
    clubs: string[] | undefined;
    hometown: number[] | undefined;
    organizations: string[] | undefined;
    sports: string[] = [];
    deviceToken: string | undefined;
    
    static override decode<UserData>(data: { [key: string]: any }): UserData {
        const object = Object();

        if (data) {
            if (data['uuid']) {
                object['uuid'] = data['uuid'];
            }
            if (data['username']) {
                object['username'] = data['username'];
            }
            if (data['first_name']) {
                object['firstName'] = data['first_name'];
            }
            if (data['last_name']) {
                object['lastName'] = data['last_name'];
            }
            if (data['image_url']) {
                object['imageURL'] = data['image_url'];
            }
            if (data['visibility']) {
                object['visibility'] = data['visibility'];
            }
            if (data['bio']) {
                object['bio'] = data['bio'];
            }
            if (data['clubs']) {
                object['clubs'] = data['clubs'];
            }
            if (data['hometown']) {
                object['hometown'] = data['hometown'];
            }
            if (data['organizations']) {
                object['organizations'] = data['organizations'];
            }
            if (data['sports']) {
                object['sports'] = data['sports'];
            }
            if (data['device_token']) {
                object['deviceToken'] = data['device_token'];
            }
        }

        Object.setPrototypeOf(object, UserData.prototype);
        return object;
    }

    /** Converts this UserData into a lightweight UserSnippet. */
    toUserSnippet(): UserSnippet {
        return new UserSnippet(
            this.uuid,
            this.firstName,
            this.lastName,
            this.username,
            this.imageURL
        );
    }
}

class UserDTO {
    uuid: string | undefined;
    username: string | undefined;
    imageURL: string | undefined;
    visibility: string | undefined;
    bio: string | undefined;
    clubs: string[] | undefined;
    hometown: number[] | undefined;
    organizations: string[] | undefined;
    sports: string[] | undefined;
    deviceToken: string | undefined;

    static decode<UserDTO>(data: { [key: string]: any }): UserDTO {
        const object = Object();

        if (data) {
            if (data['uuid']) {
                object['uuid'] = data['uuid'];
            }
            if (data['username']) {
                object['username'] = data['username'];
            }
            if (data['image_url']) {
                object['imageURL'] = data['image_url'];
            }
            if (data['visibility']) {
                object['visibility'] = data['visibility'];
            }
            if (data['bio']) {
                object['bio'] = data['bio'];
            }
            if (data['clubs']) {
                object['clubs'] = data['clubs'];
            }
            if (data['hometown']) {
                object['hometown'] = data['hometown'];
            }
            if (data['organizations']) {
                object['organizations'] = data['organizations'];
            }
            if (data['sports']) {
                object['sports'] = data['sports'];
            }
            if (data['device_token']) {
                object['deviceToken'] = data['device_token'];
            }
        }

        Object.setPrototypeOf(object, UserData.prototype);
        return object;
    }

    encode(): { [key: string]: any } {
        let json: { [key: string]: any } = {}
        if (this.username != undefined) {
            json['username'] = this.username
        }
        if (this.imageURL != undefined) {
            json['image_url'] = this.imageURL
        }
        if (this.visibility != undefined) {
            json['visibility'] = this.visibility
        }
        if (this.bio != undefined) {
            json['bio'] = this.bio
        }
        if (this.clubs != undefined) {
            json['clubs'] = this.clubs
        }
        if (this.hometown != undefined) {
            json['hometown'] = this.hometown
        }
        if (this.organizations != undefined) {
            json['organizations'] = this.organizations
        }
        if (this.sports != undefined) {
            json['sports'] = this.sports
        }
        if (this.deviceToken != undefined) {
            json['device_token'] = this.deviceToken
        }
        
        return json
    }
}

class UserSnippet extends Codable<UserSnippet> {
    uuid: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    username: string | undefined;
    imageURL: string | undefined;

    constructor(
        uuid: string | undefined,
        firstName: string | undefined,
        lastName: string | undefined,
        username: string | undefined,
        imageURL: string | undefined
    ){
        super();
        this.uuid = uuid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.imageURL = imageURL;
    }

    static override decode<UserSnippet>(data: { [key: string]: any }): UserSnippet {
        const object = Object()
        
        if (data) {
            if (data['uuid']) {
                object['uuid'] = data['uuid']
            }
            if (data['first_name']) {
                object['firstName'] = data['first_name']
            }
            if (data['last_name']) {
                object['lastName'] = data['last_name']
            }
            if (data['username']) {
                object['username'] = data['username']
            }
            if (data['image_url']) {
                object['imageURL'] = data['image_url']
            }
        } else {
            object['username'] = "olympsis_user"
        }

        Object.setPrototypeOf(object, UserSnippet.prototype);
        return object
    }

    override encode(): { [key: string]: any; } {
        let data: { [key: string]: any } = {}

        data['uuid'] = this.uuid;
        
        if (this.firstName) {
            data['first_name'] = this.firstName
        }

        if (this.lastName) {
            data['last_name'] = this.lastName
        }
 
        if (this.username) {
            data['username'] = this.username;
        }
        
        if (this.imageURL) {
            data['image_url'] = this.imageURL;
        }

        return data;
    }
}

class CheckIn {
    user: UserData | undefined;
    clubs: Club[] | undefined;
    organizations: Organization[] | undefined;
    invitations: Invitation[] | undefined;
    token: string | undefined;

    static decode<CheckIn>(data: { [key: string]: any }): CheckIn {
        const object = Object();

        if (data) {
            if (data['user']) {
                object['user'] = UserData.decode(data['user']);
            }
            if (data['clubs']) {
                object['clubs'] = data['clubs'].map((clubData: any) => Club.decode(clubData));
            }
            if (data['organizations']) {
                object['organizations'] = data['organizations'].map((orgData: any) => Organization.decode(orgData));
            }
            if (data['invitations']) {
                object['invitations'] = data['invitations'].map((invitationData: any) => Invitation.decode(invitationData));
            }
            if (data['token']) {
                object['token'] = data['token'];
            }
        }
        
        Object.setPrototypeOf(object, CheckIn.prototype);
        return object;
    }
}

export {
    UserDTO,
    CheckIn,
    UserData,
    UserSnippet
}