import { v4 as uuidv4 } from 'uuid';
import { defineStore } from "pinia";
import * as Sentry from '@sentry/nuxt';
import { EVENT_TYPE, EVENT_VISIBILITY, MEDIA_TYPE, NEW_EVENT_ERROR } from "~/data/Enums";
import { EventDao, EventLink, NewEventDao, TeamsConfig, type EventConfig, type EventFormatConfig, type ParticipantsConfig, type RecurrenceOptions } from "~/data/models/EventModels";
import { GroupSelection, Sport, Tag, VenueDescriptor } from "~/data/models/GenericModels";
import { UploadService } from '~/data/services/UploadService';
import { EventService } from '~/data/services/EventService';

export const useNewEventManager = defineStore('new-event-manager', () => {
    
    const session = useSessionStore();

    const selectedSport = ref<Sport | undefined>(undefined);

    const title = ref<string>('');
    const image = ref<string>('');
    const description = ref<string>('');

    const tags = ref<Tag[]>([]);
    const externalLinks = ref<EventLink[]>([]);

    const groups = ref<GroupSelection[]>([]);
    const venues = ref<VenueDescriptor[]>([]);
    const eventType = ref<EVENT_TYPE>(EVENT_TYPE.REGULAR);
    const visibility = ref<EVENT_VISIBILITY>(EVENT_VISIBILITY.PUBLIC);

    const startDate = ref<Date>(new Date());
    const endDate = ref<Date>(new Date(startDate.value.getTime() + (60 * 60 * 1000)));

    const config = ref<EventConfig | undefined>(undefined);
    const teamsConfig = ref<TeamsConfig | undefined> (undefined);
    const formatConfig = ref<EventFormatConfig | undefined>(undefined);
    const participantsConfig = ref<ParticipantsConfig | undefined>(undefined);
    const recurrenceOptions = ref<RecurrenceOptions | undefined>(undefined);

    /**
     * Validates the new event data and determines wether or not it is valid.
     * The parameters are the new event data that can be undefined or not set.
     * 
     * @returns a NewEventError or null if an error exists or not
     */
    function validateNewEventData() : NEW_EVENT_ERROR | null {
        if (title.value.trim() === '') {
            return NEW_EVENT_ERROR.NO_TITLE;
        }
        if (groups.value.length === 0) {
            return NEW_EVENT_ERROR.NO_ORGANIZERS;
        }
        if (description.value === '') {
            return NEW_EVENT_ERROR.NO_DESCRIPTION;
        }
        if (venues.value.length === 0) {
            return NEW_EVENT_ERROR.NO_VENUES;
        }
        if (startDate.value.getTime() <= Date.now()) {
            return NEW_EVENT_ERROR.INVALID_START_DATE;
        }
        if (startDate.value.getTime() > endDate.value.getTime()) {
            return NEW_EVENT_ERROR.INVALID_END_DATE;
        }
        if (image.value === '') {
            return NEW_EVENT_ERROR.NO_IMAGE;
        }
        // Validate min participants doesn't exceed max when both are set
        if (participantsConfig.value) {
            const min = participantsConfig.value.minParticipants ?? 0;
            const max = participantsConfig.value.maxParticipants ?? 0;
            if (max > 0 && min > max) {
                return NEW_EVENT_ERROR.INVALID_PARTICIPANTS;
            }
        }
        return null;
    }

    /**
     * Creates a new Event Data Object to transmit to server to create new Event.
     * The parameters are all of the data that we need to convert to the network data object.
     * 
     * @returns an EventDao object if successful or null if an error occurred
     */
    function generateNewEventData() : EventDao {
        const user = session.user;
        const uuid = user?.uuid;

        if (uuid) {
            return new EventDao(
                undefined,
                groups.value,
                venues.value,
                image.value,
                MEDIA_TYPE.IMAGE,
                title.value,
                description.value,
                [selectedSport.value?.name.split(' ').slice(1).join(' ')!],
                tags.value.map((t: Tag) => t.name),
                config.value,
                formatConfig.value,
                startDate.value,
                endDate.value,
                participantsConfig.value,
                teamsConfig.value,
                visibility.value,
                externalLinks.value
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
    async function createNewEvent() : Promise <string | null> {
        const service = new EventService();
        const uploadService = new UploadService();

        let isCustomImage = false;

        const dao = generateNewEventData();

        try {
            if (!dao.mediaURL) throw('Event Image Required!');

            // Upload event image if it's needed
            const img = await uploadEventImage(dao.mediaURL);
            if (img) {
                dao.mediaURL = img;
                isCustomImage = true;
            }

            // Create event server-side
            const newEventDao = new NewEventDao(
                dao,
                true,
                recurrenceOptions.value
            );

            const id = await service.createEvent(newEventDao);
            if (id) {
                return id
            } else {
                throw('Failed to create event no ID returned.')
            }
        } catch(error) {
            // Only delete the uploaded image on error if it's a custom uploaded one
            if (dao.mediaURL && isCustomImage) await uploadService.deleteImage(dao.mediaURL, 'olympsis-event-images');
            Sentry.withScope((scope) => {
                scope.setExtra('action', 'create_event');
                Sentry.captureException(error);
            });
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
    async function uploadEventImage(url: string): Promise<string | undefined> {
        const service = new UploadService();

        // Make sure that this isn't an internal image
        if (!url.includes('event-images/')) {
            const data = await fetch(url);
            const buffer = await data.arrayBuffer();
            const name = `${uuidv4()}.jpeg`;
            const response = await service.uploadImage(buffer, name, 'olympsis-event-images');
            if (response?.url) {
                return response.url.replace(/^olympsis-/, '');
            } else {
                throw('Failed to upload event image')
            }
        }
    }

    /** Resets all form state back to defaults */
    function $reset() {
        selectedSport.value = undefined;
        title.value = '';
        image.value = '';
        description.value = '';
        tags.value = [];
        externalLinks.value = [];
        groups.value = [];
        venues.value = [];
        eventType.value = EVENT_TYPE.REGULAR;
        visibility.value = EVENT_VISIBILITY.PUBLIC;
        startDate.value = new Date();
        endDate.value = new Date(startDate.value.getTime() + (60 * 60 * 1000));
        config.value = undefined;
        teamsConfig.value = undefined;
        formatConfig.value = undefined;
        participantsConfig.value = undefined;
        recurrenceOptions.value = undefined;
    }

    return {
        selectedSport,

        title,
        image,
        description,

        tags,
        externalLinks,

        groups,
        venues,
        eventType,
        visibility,

        startDate,
        endDate,

        config,
        teamsConfig,
        formatConfig,
        participantsConfig,
        recurrenceOptions,

        $reset,
        validateNewEventData,
        generateNewEventData,
        createNewEvent,
        uploadEventImage
    };
});