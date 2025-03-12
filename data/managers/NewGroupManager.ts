import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/nuxt';
import { UserSnippet } from "../models/UserModels";
import { Club, ClubDao } from "../models/ClubModels";
import { useModelStore } from "@/stores/model-store";
import { ClubService } from "../services/ClubService";
import { useSessionStore } from "@/stores/session-store";
import { UploadService } from "../services/UploadService";
import { GROUP_ROLE, GROUP_TYPE, GROUP_VISIBILITY, SPORTS } from '../Enums';
import { OrganizationService } from "../services/OrganizationService";
import { Organization, OrganizationDao } from "../models/OrganizationModels";
import { ImageUploadResponse, Member, Sport, Tag, type Location } from "../models/GenericModels";

export class NewGroupManager {

    private modelStore = useModelStore();
    private sessionStore = useSessionStore();
    private clubService = new ClubService();
    private uploadService = new UploadService();
    private organizationService = new OrganizationService();

    /**
     * Validates the new group data and determines wether or not it is valid.
     * The parameters are the new group data that can be undefined or not set.
     * 
     * @returns a NewGroupError or null if an error exists or not
     */
    public validateNewGroupData(
        title: string,
        description: string,
        sports: Array<Sport>,
        homeTown: {
            subAdministrativeArea: string,
            administrativeArea: string,
            country: string
        } | undefined,
    ) : NEW_GROUP_ERROR | null {
        if (title === '') {
            return NEW_GROUP_ERROR.NO_TITLE;
        }
        if (description === '') {
            return NEW_GROUP_ERROR.NO_DESCRIPTION;
        }
        if (sports.length === 0) {
            return NEW_GROUP_ERROR.NO_SPORTS;
        }
        if (
            homeTown === undefined || 
            homeTown.administrativeArea === undefined || 
            homeTown.subAdministrativeArea === undefined ||
            homeTown.country === undefined
        ) {
            return NEW_GROUP_ERROR.NO_HOMETOWN;
        }
        return null;
    }

    /**
     * Creates a new Group Data Object to transmit to server to create new Group.
     * The parameters are all of the data that we need to convert to the network data object.
     * 
     * @returns an ClubDao or OrganizationDao object if successful or null if an error occurred
     */
    public generateNewGroupData(
        type: GROUP_TYPE,
        visibility: GROUP_VISIBILITY | undefined,
        logo: string | undefined,
        banner: string | undefined,
        title: string,
        tags: Array<Tag>,
        sports: Array<Sport>,
        description: string,
        hometown: {
            subAdministrativeArea: string,
            administrativeArea: string,
            country: string
        },
    ) : ClubDao | OrganizationDao | null {

        switch (type) {
            case GROUP_TYPE.CLUB:
                return new ClubDao(
                    undefined,
                    undefined,
                    title,
                    description,
                    sports.map((s) => s.name.split(' ')[1]),
                    hometown.subAdministrativeArea,
                    hometown.administrativeArea,
                    hometown.country,
                    logo,
                    banner,
                    visibility?.valueOf() ?? GROUP_VISIBILITY.PUBLIC,
                    undefined,
                    tags.map((t) => t.name),
                    undefined,
                    undefined
                );
            case GROUP_TYPE.ORGANIZATION:
                return new OrganizationDao(
                    undefined,
                    title,
                    description,
                    sports.map((s) => s.name.split(' ')[1]),
                    hometown.subAdministrativeArea,
                    hometown.administrativeArea,
                    hometown.country,
                    logo,
                    banner,
                    undefined,
                    undefined
                );
            default:
                return null;
        }
    }

    /**
     * Handles uploading image data to our blob storage and returning the url
     * @param url path of the image data we are uploading
     */
    public async handleImageUpload(url: string, bucket: 'olympsis-club-images' | 'olympsis-org-images'): Promise<ImageUploadResponse> {
        try {
            const response = await fetch(url);
            const blob = await response.arrayBuffer();
            
            const name = `${uuidv4()}.jpeg`;
            return await this.uploadService.uploadImage(blob, name, bucket);
        } catch (error) {
            console.error('Failed to upload image. Error: ', error);
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'upload_group_image');
                Sentry.captureException(error);
            });
            throw('Failed to upload image');
        }
    }

    /**
     * Creates a new group using the object given to it.
     * 
     * @param dao - group object
     * @returns 
     */
    public async createNewGroup(dao: ClubDao | OrganizationDao) : Promise <string | null> {
        try {
            if (dao instanceof ClubDao) {
                if (dao.logo) {
                    const resp = await this.handleImageUpload(dao.logo, 'olympsis-club-images');
                    dao.logo = resp.url?.replace(/^olympsis-/, '');
                }
                if (dao.banner) {
                    const resp = await this.handleImageUpload(dao.banner, 'olympsis-club-images');
                    dao.banner = resp.url?.replace(/^olympsis-/, '');
                }
                const id = await this.clubService.createClub(dao);
                if (id) {
                    return id;
                }
    
                Sentry.withScope((scope) => {
                    scope.setExtra('action', 'create_group');
                    Sentry.captureMessage('Failed to create new group.')
                });
                return null;
            } else if (dao instanceof OrganizationDao) {
                if (dao.logo) {
                    const resp = await this.handleImageUpload(dao.logo, 'olympsis-org-images');
                    dao.logo = resp.url?.replace(/^olympsis-/, '');
                }
                if (dao.banner) {
                    const resp = await this.handleImageUpload(dao.banner, 'olympsis-org-images');
                    dao.banner = resp.url?.replace(/^olympsis-/, '');
                }
                const id = await this.organizationService.createOrganization(dao);
                if (id) {
                    return id;
                }
    
                Sentry.withScope((scope) => {
                    scope.setExtra('action', 'create_group');
                    Sentry.captureMessage('Failed to create new group.')
                });
                return null;
            }
        } catch (error) {
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'create_group');
                Sentry.captureException(error);
            });
        }
        return null;
    }

    /**
     * Creates the carbon copy of the new group model pushed to the server client side.
     * 
     * @param id - the new model's id
     * @param dao - the object used to create the new model server-side
     */
    public generateNewEventModel(id: string, dao: ClubDao | OrganizationDao) : Club | Organization {
        const user = this.sessionStore.user;
        const timestamp = new Date();

        const snippet = new UserSnippet(
            user?.uuid,
            user?.username ?? 'olympsis-user',
            user?.imageURL
        );

        const member = new Member(
            '000',
            GROUP_ROLE.OWNER,
            snippet,
            timestamp
        );
        
        
        if (dao instanceof ClubDao) {
            const club = new Club(
                id,
                undefined,
                dao.name,
                dao.description,
                dao.sports,
                dao.city,
                dao.state,
                dao.country,
                dao.logo,
                dao.banner,
                dao.visibility,
                [member],
                dao.tags,
                dao.rules,
                undefined,
                timestamp
            );

            this.modelStore.setClub(club);
            return club;
        } else {
            const org = new Organization(
                id,
                dao.name,
                dao.description,
                dao.sports,
                dao.city,
                dao.state,
                dao.country,
                dao.logo,
                dao.banner,
                [member],
                undefined,
                undefined,
                timestamp
            );

            this.modelStore.setOrganization(org);
            return org;
        }
    }
}

export enum NEW_GROUP_ERROR {
    NO_TITLE=0,
    NO_DESCRIPTION=1,
    NO_SPORTS=2,
    NO_HOMETOWN=3
}