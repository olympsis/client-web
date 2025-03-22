import { v4 as uuidv4 } from 'uuid';
import { EventService } from "../services/EventService";
import { MEDIA_TYPE, EVENT_VISIBILITY } from '../Enums';
import { useSessionStore } from "@/stores/session-store";
import { UploadService } from "../services/UploadService";
import { Sport, Tag, type GroupSelection, type VenueDescriptor } from "../models/GenericModels";
import { EventDao, EventFormatConfig, NewEventDao, ParticipantsConfig, RecurrenceOptions, TeamsConfig } from "../models/EventModels";

export class NewEventManager {

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
        visibility: EVENT_VISIBILITY,
        organizers: GroupSelection[],
        tags: Tag[],
        sports: Sport[],
        title: string,
        description: string,
        venues: VenueDescriptor[],
        startDate: Date,
        endDate: Date,
        mediaType: MEDIA_TYPE,
        mediaURL: string,
        formatConfig?: EventFormatConfig,
        participantsConfig?: ParticipantsConfig,
        teamsConfig?: TeamsConfig,
        externalLink?: string
    ) : EventDao {
        const user = this.sessionStore.user;
        const uuid = user?.uuid;

        if (uuid) {
            return new EventDao(
                undefined,
                organizers,
                venues,
                mediaURL,
                mediaType,
                title,
                description,
                sports.map((s: Sport) => s.name.split(' ')[1]),
                tags.map((t: Tag) => t.name.split(' ')[1]),
                formatConfig,
                startDate,
                endDate,
                participantsConfig,
                teamsConfig,
                visibility,
                externalLink
            );
        }

        throw('Failed to find user data. Cannot create event object.');
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
            if (!dao.mediaURL) throw('Event Image Required!');

            // Upload event image if it's needed
            const img = await this.uploadEventImage(dao.mediaURL);
            if (img) {
                dao.mediaURL = img;
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
            if (dao.mediaURL && isCustomImage) await this.uploadService.deleteImage(dao.mediaURL, 'olympsis-event-images');
            console.error(`Failed to create new event. Error: ${error}`)
            return null;
        }
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