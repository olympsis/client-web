import { Club } from "./ClubModels";
import { v4 as uuidv4 } from 'uuid';
import { Event } from "./EventModels";
import { UserSnippet } from "./UserModels";
import { Organization } from "./OrganizationModels";
import { Codable } from "./Models";
import { COMPETITION_FORMAT, eventRSVPToNumber, GROUP_ROLE, numberToEventRSVP, stringToGroupRole, type EVENT_RSVP_STATUS, type GROUP_TYPE } from "../Enums";

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
    type: string; // 0 - club | 1 - org
    id: string | undefined;

    constructor(
        type: string,
        id: string | undefined
    ) {
        super();
        this.type = type;
        this.id = id;
    }

    static override decode<Organizer>(data: { [key: string]: any }): Organizer {
        const object = Object();

        if (data) {
            object['type'] = data['type'] ?? "GROUP";
            
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

/**
 * VenueDescriptor — lightweight snapshot of a venue's identity + location.
 *
 * Embedded on other documents (e.g. `Event.venues`) so a card can be
 * rendered without re-fetching the full Venue. Mirrors the server's
 * `VenueDescriptor` struct (models/venue.go).
 *
 * `venueId` is empty for ad-hoc / external locations the user picks from
 * Apple Maps or types in by hand — the rest of the fields still describe
 * the place, just without a backing Venue document.
 */
class VenueDescriptor {
    venueId: string | undefined;
    name: string | undefined;
    location?: GeoJSON;
    address: string | undefined;
    locality: string | undefined;
    subLocality: string | undefined;
    administrativeArea: string | undefined;
    countryCode: string | undefined;

    constructor(
        venueId: string | undefined,
        name: string | undefined,
        latitude: number | undefined,
        longitude: number | undefined,
        address?: string,
        locality?: string,
        subLocality?: string,
        administrativeArea?: string,
        countryCode?: string
    ){
        this.venueId = venueId;
        this.name = name;
        this.address = address;
        this.locality = locality;
        this.subLocality = subLocality;
        this.administrativeArea = administrativeArea;
        this.countryCode = countryCode;
        this.location = GeoJSON.decode({
            'type': 'Point',
            'coordinates': [longitude, latitude]
        });
    }

    static decode<VenueDescriptor>(data: { [key: string]: any }): VenueDescriptor {
        const object = Object();

        if (data) {
            // TODO: remove this zero-ObjectID guard once the server stops emitting
            // "000000000000000000000000" for descriptors that have no backing Venue
            // (custom / ad-hoc locations). The fix will land server-side — at that
            // point `data['venue_id']` will be omitted/null and the plain falsy
            // check below is sufficient. Keeping the workaround until then so
            // EventListItem/EventHeader/array-extensions/etc. don't fire 404s
            // against /v1/venues/000000000000000000000000.
            const ZERO_OBJECT_ID = '000000000000000000000000';
            if (data['venue_id'] && data['venue_id'] !== ZERO_OBJECT_ID) {
                object['venueId'] = data['venue_id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['address']) {
                object['address'] = data['address'];
            }
            if (data['locality']) {
                object['locality'] = data['locality'];
            }
            if (data['sub_locality']) {
                object['subLocality'] = data['sub_locality'];
            }
            if (data['administrative_area']) {
                object['administrativeArea'] = data['administrative_area'];
            }
            if (data['country_code']) {
                object['countryCode'] = data['country_code'];
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

        if (this.venueId) {
            data['venue_id'] = this.venueId;
        }
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.address) {
            data['address'] = this.address;
        }
        if (this.locality) {
            data['locality'] = this.locality;
        }
        if (this.subLocality) {
            data['sub_locality'] = this.subLocality;
        }
        if (this.administrativeArea) {
            data['administrative_area'] = this.administrativeArea;
        }
        if (this.countryCode) {
            data['country_code'] = this.countryCode;
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
            if (data['status'] != undefined) {
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
        if (this.status != undefined) {
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
    userId: string;
    createdAt: Date;

    constructor(
        id: string,
        userId: string,
        createdAt: Date
    ) {
        super();
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    static override decode(data: { [key: string]: any; }) {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }

            if (data['user_id']) {
                object['userId'] = data['user_id'];
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
    userId?: string;
    text?: string;
    createdAt?: Date;

    constructor(
        userId?: string,
        text?: string,
        createdAt?: Date
    ) {
        super();
        this.userId = userId;
        this.text = text;
        this.createdAt = createdAt;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any; } = {};
        data['user_id'] = this.userId;
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
    userId: string | undefined;

    static override decode<Member>(data: { [key: string]: any }): Member {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['role']) {
                object['role'] = data['role'];
            }
            if (data['user_id']) {
                object['userId'] = data['user_id'];
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
        if (this.userId) {
            data['user_id'] = this.userId;
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

    // Computed property that returns applicable competition formats
    get applicableFormats(): COMPETITION_FORMAT[] {
        const sportName = this.name
            .toLowerCase()
            .replace(/️/g, '')
            .replace(/‍/g, '')
            .replace(/♀/g, '')
            .replace(/♂/g, '');

        // Team Ball Sports
        if (sportName.includes('soccer')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_1,
                COMPETITION_FORMAT.VERSUS_2,
                COMPETITION_FORMAT.VERSUS_3,
                COMPETITION_FORMAT.VERSUS_4,
                COMPETITION_FORMAT.VERSUS_5,
                COMPETITION_FORMAT.VERSUS_7,
                COMPETITION_FORMAT.VERSUS_8,
                COMPETITION_FORMAT.VERSUS_9,
                COMPETITION_FORMAT.VERSUS_10,
                COMPETITION_FORMAT.VERSUS_11
            ];
        }

        if (sportName.includes('basketball')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.VERSUS_3,
                COMPETITION_FORMAT.VERSUS_4,
                COMPETITION_FORMAT.VERSUS_5
            ];
        }

        if (sportName.includes('volleyball')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_3,
                COMPETITION_FORMAT.VERSUS_4,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.VERSUS_5,
                COMPETITION_FORMAT.VERSUS_6
            ];
        }

        if (sportName.includes('football') && !sportName.includes('flag')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.VERSUS_11
            ];
        }

        if (sportName.includes('flag-football')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.VERSUS_5,
                COMPETITION_FORMAT.VERSUS_7,
                COMPETITION_FORMAT.VERSUS_8
            ];
        }

        if (sportName.includes('handball')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.LEAGUE,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_7
            ];
        }

        // Racket/Paddle Sports
        if (sportName.includes('tennis')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('badminton')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('ping-pong')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('racquetball')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.WINNER_STAYS_ON,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('padel')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('pickleball')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.BEST_OF_5,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        // Golf
        if (sportName.includes('golf')) {
            return [
                COMPETITION_FORMAT.STROKE_PLAY,
                COMPETITION_FORMAT.MATCH_PLAY,
                COMPETITION_FORMAT.SCRAMBLE,
                COMPETITION_FORMAT.BEST_BALL,
                COMPETITION_FORMAT.STABLEFORD,
                COMPETITION_FORMAT.SKINS_GAME,
                COMPETITION_FORMAT.ALTERNATE_SHOT,
                COMPETITION_FORMAT.SHAMBLE,
                COMPETITION_FORMAT.MODIFIED_STABLEFORD,
                COMPETITION_FORMAT.SCRATCH
            ];
        }

        // Individual Cardio Sports
        if (sportName.includes('running')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.SPRINT,
                COMPETITION_FORMAT.LONG_DISTANCE,
                COMPETITION_FORMAT.RELAY
            ];
        }

        if (sportName.includes('biking')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.ROAD_RACE,
                COMPETITION_FORMAT.CRITERIUM,
                COMPETITION_FORMAT.STAGE_RACE
            ];
        }

        if (sportName.includes('swimming')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.SPRINT,
                COMPETITION_FORMAT.LONG_DISTANCE,
                COMPETITION_FORMAT.RELAY
            ];
        }

        if (sportName.includes('walking')) {
            return [];
        }

        // Climbing
        if (sportName.includes('climbing')) {
            return [
                COMPETITION_FORMAT.BOULDERING,
                COMPETITION_FORMAT.LEAD_CLIMBING,
                COMPETITION_FORMAT.SPEED_CLIMBING,
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN
            ];
        }

        // Fitness/Wellness (limited competitive formats)
        if (sportName.includes('yoga')) {
            return []; // For yoga challenges/competitions
        }

        if (sportName.includes('pilates')) {
            return []; // For pilates challenges
        }

        if (sportName.includes('weights')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.TIME_TRIAL
            ]; // For weightlifting competitions
        }

        // Other/Specialty Sports
        if (sportName.includes('spike')) {
            return [
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN,
                COMPETITION_FORMAT.SINGLE_ELIMINATION,
                COMPETITION_FORMAT.DOUBLE_ELIMINATION,
                COMPETITION_FORMAT.BEST_OF_3,
                COMPETITION_FORMAT.VERSUS_2
            ];
        }

        if (sportName.includes('hiking')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.LONG_DISTANCE
            ];
        }

        if (sportName.includes('skiing')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN
            ]; // For ski races
        }

        if (sportName.includes('snowboarding')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.BRACKET,
                COMPETITION_FORMAT.ROUND_ROBIN
            ]; // For snowboard races
        }

        if (sportName.includes('kayaking')) {
            return [
                COMPETITION_FORMAT.TIME_TRIAL,
                COMPETITION_FORMAT.ROAD_RACE,
                COMPETITION_FORMAT.LONG_DISTANCE
            ]; // Water racing formats
        }

        // Default
        return []; // No applicable formats
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