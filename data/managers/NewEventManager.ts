import { SPORTS } from '../Enums';
import { v4 as uuidv4 } from 'uuid';
import { UserSnippet } from "../models/UserModels";
import { useModelStore } from "@/stores/model-store";
import { Event, EventDao, NewEventDao, RecurrenceOptions } from "../models/EventModels";
import { EventService } from "../services/EventService";
import { useSessionStore } from "@/stores/session-store";
import { UploadService } from "../services/UploadService";
import { EVENT_RSVP_STATUS, EVENT_SKILL_LEVEL, EVENT_TYPE, EVENT_VISIBILITY } from '../Enums';
import { Participant, type GroupSelection, type VenueDescriptor } from "../models/GenericModels";

export class NewEventManager {

    private modelStore = useModelStore();
    private sessionStore = useSessionStore();
    private eventService = new EventService();
    private uploadService = new UploadService();

    /**
     * Validates the new event data and determines wether or not it is valid.
     * The parameters are the new event data that can be undefined or not set.
     * 
     * @returns a NewEventError or null if an error exists or not
     */
    public validateNewEventData(
        title: string,
        description: string,
        organizers: GroupSelection[],
        venues: VenueDescriptor[],
        eventImage: string,
        eventStartTime: Date,
        eventEndTime: Date
    ) : NEW_EVENT_ERROR | null {
        if (title === '') {
            return NEW_EVENT_ERROR.NO_TITLE;
        }
        if (organizers.length === 0) {
            return NEW_EVENT_ERROR.NO_ORGANIZERS;
        }
        if (description === '') {
            return NEW_EVENT_ERROR.NO_DESCRIPTION;
        }
        if (venues.length === 0) {
            return NEW_EVENT_ERROR.NO_VENUES;
        }
        if (eventStartTime.getTime() > eventEndTime.getTime()) {
            return NEW_EVENT_ERROR.INVALID_END_DATE;
        }
        if (eventImage === '') {
            return NEW_EVENT_ERROR.NO_IMAGE;
        }
        return null;
    }

    /**
     * Creates a new Event Data Object to transmit to server to create new Event.
     * The parameters are all of the data that we need to convert to the network data object.
     * 
     * @returns an EventDao object if successful or null if an error occurred
     */
    public generateNewEventData(
        type: EVENT_TYPE,
        visibility: EVENT_VISIBILITY,
        skillLevel: EVENT_SKILL_LEVEL,
        organizers: GroupSelection[],
        sports: SPORTS[],
        title: string,
        description: string,
        venues: VenueDescriptor[],
        startDate: Date,
        endDate: Date | undefined,
        imageURL: string,
        minParticipants: number | undefined,
        maxParticipants: number | undefined
    ) : EventDao | null {
        const user = this.sessionStore.user;
        const uuid = user?.uuid;

        if (uuid) {
            return new EventDao(
                type,
                visibility,
                uuid,
                organizers,
                venues,
                imageURL,
                title,
                description,
                sports,
                skillLevel,
                startDate,
                endDate,
                minParticipants,
                maxParticipants,
                undefined   
            );
        }

        return null;
    }

    /**
     * Creates a new event using the object given to it.
     * 
     * @param dao - event object
     * @returns a string of the ID of the event or Null if an error occurred
     */
    public async createNewEvent(dao: EventDao, opts?: RecurrenceOptions) : Promise <string | null> {
        let isCustomImage = false;
        try {
            if (!dao.imageURL) throw('Event Image Required!');

            // Upload event image if it's needed
            const img = await this.uploadEventImage(dao.imageURL);
            if (img) {
                dao.imageURL = img;
                isCustomImage = true;
            }

            // Create event server-side
            const newEventDao = new NewEventDao(
                dao,
                true,
                opts
            );

            const id = await this.eventService.createEvent(newEventDao);
            if (id) {
                return id
            } else {
                throw('Failed to create event no ID returned.')
            }
        } catch(error) {
            // Only delete the uploaded image on error if it's a custom uploaded one
            if (dao.imageURL && isCustomImage) await this.uploadService.deleteImage(dao.imageURL, 'olympsis-event-images');
            console.error(`Failed to create new event. Error: ${error}`)
            return null;
        }
    }

    /**
     * Creates the carbon copy of the new event model pushed to the server client side.
     * 
     * @param id - the new model's id
     * @param dao - the object used to create the new model server-side
     */
    public generateNewEventModel(id: string, dao: EventDao) : Event {
        const user = this.sessionStore.user;
        
        const timestamp = Math.floor(new Date().getTime() / 1000);

        const snippet = new UserSnippet(
            user?.uuid,
            user?.username ?? 'olympsis-user',
            user?.imageURL
        );

        const participant = new Participant(
            snippet,
            EVENT_RSVP_STATUS.YES,
            timestamp
        );
        
        const event =  new Event(
            id,
            dao.type ?? EVENT_TYPE.REGULAR,
            snippet,
            dao.organizers ?? [],
            dao.venues ?? [],
            dao.imageURL ?? '',
            dao.title ?? 'Olympsis Event',
            dao.body ?? 'Olympsis Event Body',
            dao.sports ?? [],
            dao.level ?? EVENT_SKILL_LEVEL.ANY_LEVEL,
            dao.startTime ?? 0,
            dao.stopTime ?? 0,
            dao.minParticipants,
            dao.maxParticipants,
            [participant],
            [],
            dao.visibility ?? EVENT_VISIBILITY.PUBLIC,
            dao.externalLink,
            timestamp ?? 0,
        );

        this.modelStore.setEvent(event);

        return event;
    }

    /**
     * Handles upload of event image
     * 
     * @param url - the name of the image data on the client
     * @returns either a url of the uploaded image or undefined on failure
     */
    private async uploadEventImage(url: string): Promise<string | undefined> {
        // Make sure that this isn't an internal image
        if (!url.includes('event-images/')) {
            const data = await fetch(url);
            const buffer = await data.arrayBuffer();
            const name = `${uuidv4()}.jpeg`;
            const response = await this.uploadService.uploadImage(buffer, name, 'olympsis-event-images');
            if (response?.url) {
                return response.url.replace(/^olympsis-/, '');
            } else {
                throw('Failed to upload event image')
            }
        }
    }
}

export enum NEW_EVENT_ERROR {
    NO_TITLE=0,
    NO_DESCRIPTION=1,
    NO_ORGANIZERS=2,
    NO_VENUES=3,
    NO_IMAGE=4,
    INVALID_START_DATE=5,
    INVALID_END_DATE=6
}