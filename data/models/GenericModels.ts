import { Club } from "./ClubModels";
import { v4 as uuidv4 } from 'uuid';
import { Event } from "./EventModels";
import { UserSnippet } from "./UserModels";
import { Organization } from "./OrganizationModels";
import { Codable } from "./Models";
import { eventRSVPToNumber, GROUP_ROLE, numberToEventRSVP, stringToGroupRole, type EVENT_RSVP_STATUS, type GROUP_TYPE } from "../Enums";

class Model {
    id: string | undefined
}

class GeoJSON extends Codable<GeoJSON> {
    type: string | undefined;
    coordinates: number[] | undefined;

    static override decode<GeoJSON>(data: { [key: string]: any }): GeoJSON {
        const object = Object();

        if (data) {
            if (data['type']) {
                object['type'] = data['type'];
            }
            if (data['coordinates']) {
                object['coordinates'] = data['coordinates'];
            }
        }

        Object.setPrototypeOf(object, GeoJSON.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.type) {
            data['type'] = this.type;
        }
        if (this.coordinates) {
            data['coordinates'] = this.coordinates;
        }
    
        return data;
    }
}

class Ownership extends Codable<Ownership> {
    name: string | undefined;
    type: string | undefined;

    static override decode<Ownership>(data: { [key: string]: any }): Ownership {
        const object = Object();

        if (data) {
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['type']) {
                object['type'] = data['type'];
            }
        }

        Object.setPrototypeOf(object, Ownership.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.name) {
            data['name'] = this.name;
        }

        if (this.type) {
            data['type'] = this.type;
        }

        return data;
    }
}

class Organizer extends Codable<Organizer> {
    type: number; // 0 - club | 1 - org
    id: string | undefined;

    constructor(
        type: number,
        id: string | undefined
    ) {
        super();
        this.type = type;
        this.id = id;
    }

    static override decode<Organizer>(data: { [key: string]: any }): Organizer {
        const object = Object();

        if (data) {
            object['type'] = data['type'] ?? 0;
            
            if (data['id']) {
                object['id'] = data['id'];
            }
        }

        Object.setPrototypeOf(object, Organizer.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.type) {
            data['type'] = this.type;
        }
        if (this.id) {
            data['id'] = this.id;
        }

        return data;
    }
}

class VenueDescriptor {
    type: string | undefined;
    id: string | undefined;
    name: string | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    location?: GeoJSON;

    constructor(
        type: string | undefined,
        id: string | undefined,
        name: string | undefined,
        city: string | undefined,
        state: string | undefined,
        country: string | undefined,
        latitude: number | undefined,
        longitude: number | undefined
    ){
        this.type = type;
        this.id = id;
        this.name = name;
        this.city = city;
        this.state = state;
        this.country = country;
        this.location = GeoJSON.decode({
            'type': 'Point',
            'coordinates': [longitude, latitude]
        })
    }

    static decode<VenueDescriptor>(data: { [key: string]: any }): VenueDescriptor {
        const object = Object();

        if (data) {
            if (data['type']) {
                object['type'] = data['type'];
            }
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
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
            if (data['location']) {
                object['location'] = GeoJSON.decode(data['location']);
            }
        }

        Object.setPrototypeOf(object, VenueDescriptor.prototype);
        return object;
    }

    public encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.type) {
            data['type'] = this.type;
        }
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.name) {
            data['name'] = this.name;
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
        if (this.location) {
            data['location'] = this.location.encode();
        }
    
        return data;
    }
}

class Participant extends Codable<Participant> {
    id: string;
    user: UserSnippet | undefined;
    status: EVENT_RSVP_STATUS;
    isAnonymous?: boolean;
    createdAt: Date;

    constructor(
        id: string = uuidv4(),
        user: UserSnippet | undefined,
        status: EVENT_RSVP_STATUS,
        createdAt: Date,
        isAnonymous?: boolean
    ) {
        super();
        this.id = id;
        this.user = user;
        this.status = status;
        this.createdAt = createdAt;
        this.isAnonymous = isAnonymous;
    }

    static override decode<Participant>(data: { [key: string]: any }): Participant {
        const object = Object();

        if (data) {
            object['id'] = data['id'];

            if (data['user']) {
                object['user'] = UserSnippet.decode(data['user']);
            }

            object['status'] = numberToEventRSVP(data['status']);
            object['createdAt'] = new Date(data['created_at']);

            if (data['is_anonymous']) {
                object['isAnonymous'] = data['is_anonymous'];
            }
        }

        Object.setPrototypeOf(object, Participant.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.user) {
            data['user'] = this.user.encode();
        }
        if (this.status) {
            data['status'] = eventRSVPToNumber(this.status);
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }
        if (this.isAnonymous != undefined) {
            data['is_anonymous'] = this.isAnonymous
        }
    
        return data;
    }
}

class ParticipantDao extends Codable<ParticipantDao> {
    id: string | undefined
    userID: string | undefined
    status: number | undefined
    isAnonymous: boolean | undefined
    createdAt: Date | undefined

    constructor(
        id: string | undefined,
        userID: string | undefined,
        status: number | undefined,
        isAnonymous: boolean | undefined,
        createdAt: Date | undefined,
    ) {
        super();
        this.id = id
        this.userID = userID
        this.status = status
        this.isAnonymous = isAnonymous;
        this.createdAt = createdAt
    }

    static override decode<ParticipantDao>(data: { [key: string]: any }): ParticipantDao {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['user_id']) {
                object['userID'] = data['user_id'];
            }
            if (data['status']) {
                object['status'] = data['status'];
            }
            if (data['is_anonymous']) {
                object['isAnonymous'] = data['is_anonymous'];
            }
            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
        }

        Object.setPrototypeOf(object, ParticipantDao.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.userID) {
            data['user_id'] = this.userID;
        }
        if (this.status) {
            data['status'] = this.status;
        }
        if (this.isAnonymous != undefined) {
            data['is_anonymous'] = this.isAnonymous;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }
    
        return data;
    }
}

class Like extends Codable<Like> {
    id: string;
    uuid: string;
    createdAt: Date;

    constructor(
        id: string,
        uuid: string,
        createdAt: Date
    ) {
        super();
        this.id = id;
        this.uuid = uuid;
        this.createdAt = createdAt;
    }

    static override decode(data: { [key: string]: any; }) {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }

            if (data['uuid']) {
                object['uuid'] = data['uuid'];
            }

            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
        }

        Object.setPrototypeOf(object, Like.prototype);
        return object;
    }
}
  
class Comment extends Codable<Comment> {
    id: string;
    user: UserSnippet | undefined;
    text: string;
    createdAt: Date;

    constructor(
        id: string,
        user: UserSnippet | undefined,
        text: string,
        createdAt: Date
    ) {
        super();
        this.id = id;
        this.user = user;
        this.text = text;
        this.createdAt = createdAt;
    }

    static override decode(data: { [key: string]: any; }) {
        const object = Object();
        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['user']) {
                object['user'] = UserSnippet.decode(data['user']);
            }
            if (data['text']) {
                object['text'] = data['text'];
            }
            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
        }

        Object.setPrototypeOf(object, Comment.prototype);
        return object;
    }
}

class CommentDao extends Codable<CommentDao> {
    uuid?: string;
    text?: string;
    createdAt?: Date;

    constructor(
        uuid?: string,
        text?: string,
        createdAt?: Date
    ) {
        super();
        this.uuid = uuid;
        this.text = text;
        this.createdAt = createdAt;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        data['uuid'] = this.uuid;
        data['text'] = this.text;

        return data;
    }
}

class Member extends Codable<Member> {
    id: string;
    role: GROUP_ROLE;
    user: UserSnippet | undefined;
    joinedAt: Date;

    constructor(
        id: string,
        role: GROUP_ROLE,
        user: UserSnippet | undefined,
        joinedAt: Date
    ){
        super();
        this.id = id;
        this.role = role;
        this.user = user;
        this.joinedAt = joinedAt;
    }

    static override decode<Member>(data: { [key: string]: any }): Member {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['role']) {
                object['role'] = data['role'] ? stringToGroupRole(data['role']) : GROUP_ROLE.MEMBER;
            }
            if (data['user']) {
                object['user'] = UserSnippet.decode(data['user']);
            }
            if (data['joined_at']) {
                object['joinedAt'] = new Date(data['joined_at']);
            }
        }

        Object.setPrototypeOf(object, Member.prototype);
        return object;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.role) {
            data['role'] = this.role.valueOf();
        }
        if (this.user) {
            data['user'] = this.user.encode();
        }
        if (this.joinedAt) {
            data['joined_at'] = this.joinedAt.toISOString();
        }
    
        return data;
    }
}
class MemberDao extends Codable<MemberDao> {
    id: string | undefined;
    role: string | undefined;
    uuid: string | undefined;

    static override decode<Member>(data: { [key: string]: any }): Member {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['role']) {
                object['role'] = data['role'];
            }
            if (data['uuid']) {
                object['uuid'] = data['uuid'];
            }
        }

        Object.setPrototypeOf(object, MemberDao.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.role) {
            data['role'] = this.role;
        }
        if (this.uuid) {
            data['uuid'] = this.uuid;
        }
    
        return data;
    }
}

class Invitation {
    id: string | undefined;
    type: string | undefined;
    sender: UserSnippet | undefined;
    status: string | undefined;
    club: Club | undefined;
    event: Event | undefined;
    organization: Organization | undefined;
    createdAt: Date | undefined;

    static decode<Invitation>(data: { [key: string]: any }): Invitation {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['type']) {
                object['type'] = data['type'];
            }
            if (data['sender']) {
                object['sender'] = UserSnippet.decode(data['sender']);
            }
            if (data['status']) {
                object['status'] = data['status'];
            }
            if (data['club']) {
                object['club'] = Club.decode(data['club']);
            }
            if (data['event']) {
                object['event'] = Event.decode(data['event']);
            }
            if (data['organization']) {
                object['organization'] = Organization.decode(data['organization']);
            }
            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
        }

        Object.setPrototypeOf(object, Invitation.prototype);
        return object;
    }
}

class InvitationDao {
    id: string | undefined;
    type: string | undefined;
    sender: string | undefined;
    status: string | undefined;
    recipient: string | undefined;
    subjectId: string | undefined;
}

interface InvitationDao {
    encode(): { [key: string]: string }
}

InvitationDao.prototype.encode = function(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    if (this.id) {
        data['id'] = this.id;
    }
    if (this.type) {
        data['type'] = this.type;
    }
    if (this.sender) {
        data['sender'] = this.sender;
    }
    if (this.status) {
        data['status'] = this.status;
    }
    if (this.recipient) {
        data['recipient'] = this.recipient;
    }
    if (this.subjectId) {
        data['subject_id'] = this.subjectId;
    }

    return data;
}

class GroupSelection {
    id: string
    type: GROUP_TYPE
    club: Club | undefined
    organization: Organization | undefined
  
    constructor(type: GROUP_TYPE, club: Club | undefined, organization: Organization | undefined) {
      this.id = uuidv4()
      this.type = type
      this.club = club
      this.organization = organization
    }
  }
  
enum PermissionState {
    Authorized = "granted",
    UnAuthorized = "denied",
    Request = "prompt",
    NotSupported = "not_supported"
}

class Location extends Codable<Location> {
    latitude: number;
    longitude: number;
    locality: string | undefined;
    administrativeArea: string | undefined;
    administrativeAreaCode: string | undefined;
    postCode: string | undefined;
    country: string | undefined;
    countryCode: string | undefined;

    constructor(
        lat: number,
        long: number,
        locale?: string,
        adminArea?: string,
        adminAreaCode?: string,
        postCode?: string,
        country?: string,
        countryCode?: string
    ) {
        super();
        this.latitude = lat;
        this.longitude = long;
        this.locality = locale;
        this.administrativeArea = adminArea;
        this.administrativeAreaCode = adminAreaCode;
        this.postCode = postCode;
        this.country = country;
        this.countryCode = countryCode;
    }

    static override decode<Location>(data: { [key: string]: any }): Location {
        const object = Object();

        if (data) {
            if (data['latitude'] !== undefined) {
                object['latitude'] = data['latitude'];
            }
            if (data['longitude'] !== undefined) {
                object['longitude'] = data['longitude'];
            }
            if (data['locality'] !== undefined) {
                object['locality'] = data['locality'];
            }
            if (data['administrative_area'] !== undefined) {
                object['administrativeArea'] = data['administrative_area'];
            }
            if (data['administrative_area_code'] !== undefined) {
                object['administrativeAreaCode'] = data['administrative_area_code'];
            }
            if (data['post_code'] !== undefined) {
                object['postCode'] = data['post_code'];
            }
            if (data['country'] !== undefined) {
                object['country'] = data['country'];
            }
            if (data['country_code'] !== undefined) {
                object['countryCode'] = data['country_code'];
            }
        }

        Object.setPrototypeOf(object, Location.prototype);
        return object;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        
        if (this.latitude !== undefined) {
            data['latitude'] = this.latitude;
        }
        if (this.longitude !== undefined) {
            data['longitude'] = this.longitude;
        }
        if (this.locality !== undefined) {
            data['locality'] = this.locality;
        }
        if (this.administrativeArea !== undefined) {
            data['administrative_area'] = this.administrativeArea;
        }
        if (this.administrativeAreaCode !== undefined) {
            data['administrative_area_code'] = this.administrativeAreaCode;
        }
        if (this.postCode !== undefined) {
            data['post_code'] = this.postCode;
        }
        if (this.country !== undefined) {
            data['country'] = this.country;
        }
        if (this.countryCode !== undefined) {
            data['country_code'] = this.countryCode;
        }
    
        return data;
    }
}

class ImageUploadResponse {
    url: string | undefined;
    score: number | undefined;
    reason: string | undefined;

    constructor(
        url: string | undefined,
        score: number | undefined,
        reason: string | undefined
    ){
       this.url = url;
       this.score = score;
       this.reason = reason;
    }

    static decode<ImageUploadResponse>(data: { [key: string]: any }): ImageUploadResponse {
        const object = Object();

        if (data) {
            if (data['url']) {
                object['url'] = data['url'];
            }

            object['number'] = data['number'] ?? 0;

            if (data['reason']) {
                object['reason'] = data['reason'];
            }
        }

        Object.setPrototypeOf(object, ImageUploadResponse.prototype);
        return object;
    }
}

class Country {
    id: string
    name: string

    constructor(
        id: string,
        name: string
    ) {
        this.id = id;
        this.name = name;
    }
}

class AdministrativeArea {
    id: string
    name: string
    code: string
    countryID: string

    constructor(
        id: string,
        name: string,
        code: string,
        countryID: string
    ) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.countryID = countryID;
    }
}

class SubAdministrativeArea extends Codable<SubAdministrativeArea>{
    id: string
    name: string
    adminAreaID: string
    location: GeoJSON

    constructor(
        id: string,
        name: string,
        adminAreaID: string,
        location: GeoJSON
    ) {
        super();
        this.id = id;
        this.name = name;
        this.adminAreaID = adminAreaID;
        this.location = location;
    }

    static override decode<SubAdministrativeArea>(data: { [key: string]: any }): SubAdministrativeArea {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['name'] = data['name'];
            object['admin_area_id'] = data['admin_area_id'];
            object['location'] = GeoJSON.decode(data['location'])
        }

        Object.setPrototypeOf(object, SubAdministrativeArea.prototype);
        return object;
    }
}

class ChangeRoleRequest extends Codable<ChangeRoleRequest> {
    role: string;

    constructor(
        role: string
    ) {
        super();
        this.role = role;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
    
        if (this.role) {
            data['role'] = this.role;
        }
    
        return data;
    }
}

class Tag extends Codable<Tag> {
    name: string

    constructor(
        name: string
    ) {
        super();
        this.name = name;
    }

    static override decode<Tag>(data: { [key: string]: any }): Tag {
        const object = Object();

        if(data) {
            object['name'] = data['name'];
        }

        Object.setPrototypeOf(object, Tag.prototype);
        return object;
    }
}

class Sport extends Codable<Sport> {
    name: string;
    images: string[];

    constructor(
        name: string,
        images: string[]
    ) {
        super();
        this.name = name;
        this.images = images;
    }

    static override decode<Sport>(data: { [key: string]: any }): Sport {
        const object = Object();

        if(data) {
            object['name'] = data['name'];
            object['images'] = data['images'];
        }

        Object.setPrototypeOf(object, Sport.prototype);
        return object;
    }
}

class ApplicationConfig extends Codable<ApplicationConfig> {
    tags: Tag[];
    sports: any[];

    constructor(
        tags: Tag[],
        sports: Sport[]
    ) {
        super();
        this.tags = tags;
        this.sports = sports;
    }

    static override decode<ApplicationConfig>(data: { [key: string]: any }): ApplicationConfig {
        const object = Object();

        if (data) {
            object['tags'] = data['tags'].map((t: {[key: string]: any}) => {
                return Tag.decode(t);
            });
            object['sports'] = data['sports'].map((s: {[key: string]: any}) => {
                return Sport.decode(s);
            });
        }

        Object.setPrototypeOf(object, ApplicationConfig.prototype);
        return object;
    }
}

export {
    Comment,
    CommentDao,

    Like,

    Model,
    Member,
    MemberDao,

    Invitation,
    InvitationDao,

    Participant,
    ParticipantDao,

    GeoJSON,
    Ownership,
    Organizer,
    VenueDescriptor,

    Location,
    PermissionState,
    GroupSelection,
    ImageUploadResponse,

    Country,
    ChangeRoleRequest,
    AdministrativeArea,
    SubAdministrativeArea,

    Tag,
    Sport,
    ApplicationConfig,
}