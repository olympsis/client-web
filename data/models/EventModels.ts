import { Codable } from "./Models";
import { Venue } from "./VenueModels";
import { UserSnippet } from "./UserModels";
import { VenueDescriptor, Organizer, Participant, GroupSelection } from "./GenericModels";

import {
    EVENT_VISIBILITY,
    MEDIA_TYPE,
    COMPETITION_FORMAT,
    COMMENT_REACTION_TYPE,
    eventVisibilityToNumber,
    numberToEventVisibility,
    GROUP_TYPE,
    stringToMediaType,
    stringToCompetitionFormat,
    stringToCommentReactionType,
} from "../Enums";

/**
 * Core event model representing a sports event on the Olympsis platform.
 * Maps to the backend `Event` struct in the Go models package.
 *
 * Events are organized by clubs/organizations, held at venues, and support
 * individual participants, teams, competitions, and recurring schedules.
 */
class Event extends Codable<Event> {
    id: string;
    /** The user who originally created this event */
    poster?: UserSnippet;
    /** Clubs or organizations hosting this event (type 0 = Club, type 1 = Organization) */
    organizers: Organizer[];
    /** Venue references — resolved to full Venue objects separately via VenueService */
    venues: VenueDescriptor[];

    /** S3/storage key for the event's cover image or video */
    mediaURL: string;
    mediaType: MEDIA_TYPE;

    title: string;
    body: string;
    tags: string[];
    /** Sport types associated with this event (e.g. "soccer", "basketball") */
    sports: string[];

    startTime: Date;
    stopTime: Date;

    /** General event display settings (hide poster, hide location) */
    config?: EventConfig;
    /** Competition-specific configuration — formats, rounds, bracket data, registration windows */
    formatConfig?: EventFormatConfig;

    /** Users who have RSVP'd to this event (status: 0=Maybe, 1=Yes) */
    participants: Participant[];
    /** Overflow participants when the event reaches max capacity */
    participantsWaitlist: Participant[];
    /** Participant limits and waitlist/visibility settings */
    participantsConfig?: ParticipantsConfig;
    participantsCount?: number;

    /** Teams registered for team-based events */
    teams: Team[];
    /** Overflow teams when event reaches max team capacity */
    teamsWaitlist: Team[];
    /** Team limits and waitlist/visibility settings */
    teamsConfig?: TeamsConfig;
    teamsCount?: number;

    /** User comments on this event — embedded directly on the event document */
    comments: EventComment[];

    /** PUBLIC, PRIVATE, or GROUP — controls who can discover this event */
    visibility: EVENT_VISIBILITY;
    /** Optional link to an external registration page or event site */
    externalLink?: string;
    /** Whether this event contains sensitive/mature content */
    isSensitive: boolean;

    createdAt: Date;
    updatedAt?: Date;
    /** Set when the event is cancelled — presence indicates a cancelled event */
    cancelledAt?: Date;

    /** iCalendar-compatible recurrence rule for recurring events */
    recurrenceConfig?: EventRecurrenceConfig;

    constructor(
        id: string,
        poster: UserSnippet | undefined,
        organizers: Organizer[],
        venues: VenueDescriptor[],
        mediaURL: string,
        mediaType: MEDIA_TYPE,
        title: string,
        body: string,
        tags: string[],
        sports: string[],
        startTime: Date,
        stopTime: Date,
        visibility: EVENT_VISIBILITY,
        createdAt: Date,
        updatedAt: Date | undefined,
        isSensitive: boolean,
        participants: Participant[],
        participantsWaitlist: Participant[],
        participantsConfig: ParticipantsConfig | undefined,
        teams: Team[],
        teamsWaitlist: Team[],
        teamsConfig?: TeamsConfig,
        comments?: EventComment[],
        config?: EventConfig,
        formatConfig?: EventFormatConfig,
        externalLink?: string,
        cancelledAt?: Date,
        recurrenceConfig?: EventRecurrenceConfig
    ){
        super();
        this.id = id;
        this.poster = poster;
        this.organizers = organizers;
        this.venues = venues;
        this.mediaURL = mediaURL;
        this.mediaType = mediaType;
        
        this.title = title;
        this.body = body;
        this.sports = sports;
        this.tags = tags;
        
        this.config = config;
        this.formatConfig = formatConfig;
        
        this.startTime = startTime;
        this.stopTime = stopTime;
        
        this.participants = participants;
        this.participantsWaitlist = participantsWaitlist;
        this.participantsConfig = participantsConfig;

        this.teams = teams;
        this.teamsWaitlist = teamsWaitlist;
        this.teamsConfig = teamsConfig;

        this.comments = comments ?? [];

        this.visibility = visibility;
        this.externalLink = externalLink;
        this.isSensitive = isSensitive;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cancelledAt = cancelledAt;
        this.recurrenceConfig = recurrenceConfig;
    }
  
    static override decode<Event>(data: { [key: string]: any }): Event {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['poster'] = data['poster'] ? UserSnippet.decode(data['poster']) : undefined;
            object['organizers'] = data['organizers'] ? data['organizers'].map((org: any) => Organizer.decode(org)) : [];
            object['venues'] = data['venues'] ? data['venues'].map((v: any) => VenueDescriptor.decode(v)) : [];
            
            // Media
            object['mediaURL'] = data['media_url'];
            object['mediaType'] = stringToMediaType(data['media_type']);
            
            object['title'] = data['title'];
            object['body'] = data['body'];
            object['sports'] = data['sports'] || [];
            object['tags'] = data['tags'] || [];
            
            // Format config
            object['config'] = data['config'] ? EventConfig.decode(data['config']) : undefined;
            object['formatConfig'] = data['format_config'] ? EventFormatConfig.decode(data['format_config']) : undefined;
            
            // Dates
            object['startTime'] = new Date(data['start_time']);
            object['stopTime'] = new Date(data['stop_time']);
            
            // Participants data
            object['participants'] = data['participants'] ? data['participants'].map((p: any) => Participant.decode(p)) : [];
            object['participantsWaitlist'] = data['participants_waitlist'] ? data['participants_waitlist'].map((p: any) => Participant.decode(p)) : [];
            object['participantsConfig'] = data['participants_config'] ? ParticipantsConfig.decode(data['participants_config']) : new ParticipantsConfig();
            
            // Teams data
            object['teams'] = data['teams'] ? data['teams'].map((t: any) => Team.decode(t)) : [];
            object['teamsWaitlist'] = data['teams_waitlist'] ? data['teams_waitlist'].map((t: any) => Team.decode(t)) : [];
            object['teamsConfig'] = data['teams_config'] ? TeamsConfig.decode(data['teams_config']) : undefined;
            
            // Comments
            object['comments'] = data['comments'] ? data['comments'].map((c: any) => EventComment.decode(c)) : [];

            object['visibility'] = numberToEventVisibility(data['visibility']);
            object['externalLink'] = data['external_link'];
            object['isSensitive'] = data['is_sensitive'] || false;
            
            // Time variables
            object['createdAt'] = new Date(data['created_at']);
            if (data['updated_at']) {
                object['updatedAt'] = new Date(data['updated_at']);
            }
            
            if (data['canceled_at']) {
                object['cancelledAt'] = new Date(data['cancelled_at']);
            }
            
            // Recurrence configurations
            object['recurrenceConfig'] = data['recurrence_config'] ? EventRecurrenceConfig.decode(data['recurrence_config']) : undefined;
        }

        Object.setPrototypeOf(object, Event.prototype);
        return object;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any } = {};

        if (this.id) {
            data['id'] = this.id;
        }
        if (this.poster) {
            data['poster'] = this.poster.encode();
        }
        if (this.organizers) {
            data['organizers'] = this.organizers.map((org: Organizer) => org.encode());
        }
        if (this.venues) {
            data['venues'] = this.venues.map((v) => v.encode());
        }
        
        if (this.mediaURL) {
            data['media_url'] = this.mediaURL;
        }
        if (this.mediaType) {
            data['media_type'] = this.mediaType.valueOf();
        }
        
        if (this.title) {
            data['title'] = this.title;
        }
        if (this.body) {
            data['body'] = this.body;
        }
        if (this.tags) {
            data['tags'] = this.tags.map((t) => t.valueOf());
        }
        if (this.sports) {
            data['sports'] = this.sports.map((s) => s.valueOf());
        }
        
        if (this.config) {
            data['config'] = this.config.encode();
        }

        if (this.formatConfig) {
            data['format_config'] = this.formatConfig.encode();
        }
        
        // Dates
        if (this.startTime) {
            data['start_time'] = this.startTime;
        }
        if (this.stopTime) {
            data['stop_time'] = this.stopTime;
        }
        
        // Participants data
        if (this.participants) {
            data['participants'] = this.participants.map((p) => p.encode());
        }
        if (this.participantsWaitlist) {
            data['participants_waitlist'] = this.participantsWaitlist.map((p) => p.encode());
        }
        if (this.participantsConfig) {
            data['participants_config'] = this.participantsConfig.encode();
        }
        
        // Teams data
        if (this.teams) {
            data['teams'] = this.teams.map((t) => t.encode());
        }
        if (this.teamsWaitlist) {
            data['teams_waitlist'] = this.teamsWaitlist.map((t) => t.encode());
        }
        if (this.teamsConfig) {
            data['teams_config'] = this.teamsConfig.encode();
        }
        
        // Comments
        if (this.comments) {
            data['comments'] = this.comments.map((c) => c.encode());
        }

        if (this.visibility) {
            data['visibility'] = eventVisibilityToNumber(this.visibility);
        }
        if (this.externalLink) {
            data['external_link'] = this.externalLink;
        }
        
        data['is_sensitive'] = this.isSensitive;
        
        if (this.createdAt) {
            data['created_at'] = this.createdAt;
        }
        if (this.updatedAt) {
            data['updated_at'] = this.updatedAt;
        }
        if (this.cancelledAt) {
            data['cancelled_at'] = this.cancelledAt;
        }
        
        if (this.recurrenceConfig) {
            data['recurrence_config'] = this.recurrenceConfig.encode();
        }

        return data;
    }

    /**
     * Checks whether this event is a structured competition (tournament, league, etc.)
     * by looking at the format configuration's isCompetition flag.
     */
    isCompetition(): boolean {
        return !!this.formatConfig?.isCompetition;
    }

    /**
     * Checks whether this event repeats on a schedule by looking
     * for an attached recurrence config (iCalendar RRULE-based).
     */
    isRecurringEvent(): boolean {
        return !!this.recurrenceConfig;
    }

    /**
     * Checks whether the event has reached its maximum participant capacity.
     * Returns false if no max is configured (unlimited participants).
     */
    isFull(): boolean {
        if (!this.participantsConfig?.maxParticipants) return false;
        return this.participantsConfig?.maxParticipants <= this.participants.length;
    }

    /** Returns the configured minimum participants, or 0 if not set. */
    getMinParticipants(): number {
        return this.participantsConfig?.minParticipants ?? 0;
    }

    /** Returns the configured maximum participants, or 0 (unlimited) if not set. */
    getMaxParticipants(): number {
        return this.participantsConfig?.maxParticipants ?? 0;
    }

    /** Returns the configured minimum teams, or 0 if not set. */
    getMinTeams(): number {
        return this.teamsConfig?.maxTeams ?? 0;
    }

    /** Returns the configured maximum teams, or 0 (unlimited) if not set. */
    getMaxTeams(): number {
        return this.teamsConfig?.minTeams  ?? 0;
    }
}

/**
 * Data Access Object for creating or updating an event.
 * All fields are optional — only populated fields are sent to the API.
 * The constructor accepts GroupSelection objects and converts them to
 * Organizer instances (mapping club/organization type to numeric type codes).
 */
class EventDao extends Codable<EventDao> {
    posterId?: string;
    organizers?: Organizer[];
    venues?: VenueDescriptor[];

    mediaURL?: string;
    mediaType?: MEDIA_TYPE;

    title?: string;
    body?: string;
    sports?: string[];
    tags?: string[];

    config?: EventConfig;
    formatConfig?: EventFormatConfig;

    startTime?: Date;
    stopTime?: Date;

    participantsConfig?: ParticipantsConfig;
    teamsConfig?: TeamsConfig;

    visibility?: EVENT_VISIBILITY;
    externalLink?: string;
    isSensitive?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
    cancelledAt?: Date;

    recurrenceConfig?: EventRecurrenceConfig;

    constructor(
        posterId?: string,
        organizers?: GroupSelection[],
        venues?: VenueDescriptor[],
        mediaURL?: string,
        mediaType?: MEDIA_TYPE,
        title?: string,
        body?: string,
        sports?: string[],
        tags?: string[],
        config?: EventConfig,
        formatConfig?: EventFormatConfig,
        startTime?: Date,
        stopTime?: Date,
        participantsConfig?: ParticipantsConfig,
        teamsConfig?: TeamsConfig,
        visibility?: EVENT_VISIBILITY,
        externalLink?: string,
        isSensitive?: boolean,
        cancelledAt?: Date,
        recurrenceConfig?: EventRecurrenceConfig
    ) {
        super();
        
        this.posterId = posterId;
        
        if (organizers) {
            this.organizers = organizers?.map((o) => {
                return new Organizer(
                    o.type === GROUP_TYPE.CLUB ? 'CLUB' : 'ORGANIZATION',
                    o.club?.id ?? o.organization?.id
                );
            });
        }
        
        this.venues = venues;
        this.mediaURL = mediaURL;
        this.mediaType = mediaType;
        this.title = title;
        this.body = body;
        this.sports = sports;
        this.tags = tags;
        this.config = config;
        this.formatConfig = formatConfig;
        
        if (startTime) {
            this.startTime = startTime
        }
        
        if (stopTime) {
            this.stopTime = stopTime
        }
        
        this.participantsConfig = participantsConfig;
        this.teamsConfig = teamsConfig;
        this.visibility = visibility;
        this.externalLink = externalLink;
        this.isSensitive = isSensitive;
        
        this.cancelledAt = cancelledAt;
        
        this.recurrenceConfig = recurrenceConfig;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.posterId) {
            data['poster_id'] = this.posterId;
        }
        if (this.organizers) {
            data['organizers'] = this.organizers.map((org: Organizer) => org.encode());
        }
        if (this.venues) {
            data['venues'] = this.venues.map((v) => v.encode());
        }
        
        if (this.mediaURL) {
            data['media_url'] = this.mediaURL;
        }
        if (this.mediaType) {
            data['media_type'] = this.mediaType.valueOf();
        }
        
        if (this.title) {
            data['title'] = this.title;
        }
        if (this.body) {
            data['body'] = this.body;
        }
        if (this.sports) {
            data['sports'] = this.sports.map((s) => s.valueOf());
        }
        if (this.tags) {
            data['tags'] = this.tags.map((t) => t.valueOf());
        }
        
        if (this.config) {
            data['config'] = this.config.encode();
        }

        if (this.formatConfig) {
            data['format_config'] = this.formatConfig.encode();
        }
        
        if (this.startTime) {
            data['start_time'] = this.startTime.toISOString();
        }
        if (this.stopTime) {
            data['stop_time'] = this.stopTime.toISOString();
        }
        
        if (this.participantsConfig) {
            data['participants_config'] = this.participantsConfig.encode();
        }
        if (this.teamsConfig) {
            data['teams_config'] = this.teamsConfig.encode();
        }
        
        if (this.visibility !== undefined) {
            data['visibility'] = eventVisibilityToNumber(this.visibility);
        }
        if (this.externalLink) {
            data['external_link'] = this.externalLink;
        }
        if (this.isSensitive !== undefined) {
            data['is_sensitive'] = this.isSensitive;
        }
        
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }
        if (this.updatedAt) {
            data['updated_at'] = this.updatedAt.toISOString();
        }
        if (this.cancelledAt) {
            data['cancelled_at'] = this.cancelledAt.toISOString();
        }
        
        if (this.recurrenceConfig) {
            data['recurrence_config'] = this.recurrenceConfig.encode();
        }
    
        return data;
    }
}

/**
 * Paginated response wrapper returned by the events list API.
 * Contains the page of events plus the total count for pagination controls.
 */
class EventsResponse {
  events: Event[];
  /** Total number of events matching the query (not just this page) */
  totalEvents: number;

  constructor(
      events: Event[],
      totalEvents: number
  ){
      this.events = events
      this.totalEvents = totalEvents
  }

  static decode(data: { [key: string]: any }): EventsResponse {
      const object = Object()

      object['events'] = data.events.map((p: {[key: string]: any}) => {
          return Event.decode(p)
      });
      object['totalEvents'] = data['total_events'] ?? 0;

      Object.setPrototypeOf(object, EventsResponse.prototype)

      return object;
  }
}

/**
 * Response from location-based event queries.
 * Returns both the events found near a location and their associated venues.
 */
class LocationResponse {
  events: Event[];
  venues: Venue[];

  constructor(
      events: Event[],
      venues: Venue[]
  ){
      this.events = events
      this.venues = venues
  }

  static decode(data: { [key: string]: any }): LocationResponse {
      const object = Object()

      object['events'] = data.events?.map((p: {[key: string]: any}) => {
        return Event.decode(p)
      });
      object['venues'] = data.venues?.map((p: {[key: string]: any}) => {
        return Venue.decode(p)
      });

      Object.setPrototypeOf(object, LocationResponse.prototype)

      return object;
  }
}

/**
 * Client-side grouping of events by date for display in sectioned lists.
 * Used to render events under day headers (e.g. "Today", "Tomorrow", "Feb 15").
 */
class EventSection {
    date: Date;
    /** Formatted display string for the section header (e.g. "Today", "Monday") */
    dayString: string;
    events: Event[];

    constructor(
        date: Date,
        dayString: string,
        events: Event[]
    ) {
        this.date = date;
        this.dayString = dayString;
        this.events = events;
    }
}

/**
 * Top-level DAO for the event creation endpoint.
 * Wraps an EventDao with additional creation-time options like
 * whether to auto-add the creator as a participant and recurrence settings.
 */
class NewEventDao extends Codable<NewEventDao> {
    event: EventDao
    /** If true, the event creator is automatically added as a participant */
    includeHost?: boolean
    /** Optional recurrence schedule — omit for one-time events */
    recurrence?: RecurrenceOptions

    constructor(
        event: EventDao,
        includeHost?: boolean,
        recurrence?: RecurrenceOptions
    ) {
        super();
        this.event = event;
        this.includeHost = includeHost;
        this.recurrence = recurrence;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        data['event'] = this.event.encode();
        
        if (this.includeHost !== undefined) {
            data['include_host'] = this.includeHost;
        }
        
        if (this.recurrence) {
            data['recurrence'] = this.recurrence.encode();
        }

        return data
    }
}

/**
 * Recurrence settings sent when creating a new recurring event.
 * The backend uses these to generate individual event instances
 * according to the pattern and interval until the end time.
 */
class RecurrenceOptions extends Codable<RecurrenceOptions> {
    /** Recurrence frequency: "DAILY", "WEEKLY", or "MONTHLY" */
    pattern: string
    /** Date after which no more recurring instances are created */
    endTime: Date
    /** How many pattern units between occurrences (e.g. interval=2 with WEEKLY = every 2 weeks) */
    interval: number

    constructor(
        pattern: string,
        endTime: Date,
        interval: number
    ) {
        super();
        this.pattern = pattern;
        this.endTime = endTime;
        this.interval = interval;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any } = {};

        data['pattern'] = this.pattern;
        data['end_time'] = this.endTime.toISOString();
        data['interval'] = this.interval;

        return data;
    }
}

/**
 * Stored recurrence metadata on an event that was created as part of a recurring series.
 * The backend attaches this after generating instances from RecurrenceOptions.
 */
class EventRecurrenceConfig extends Codable<EventRecurrenceConfig> {
    /** iCalendar RRULE string (e.g. "FREQ=WEEKLY;INTERVAL=1") */
    recurrenceRule?: string;
    /** When the recurrence series stops generating new instances */
    recurrenceEnd?: Date;
    /** ID of the original event that spawned this recurring series */
    parentEventId?: string;
    /** IDs of individual instances that were deleted from the series */
    deletedInstances?: string[];

    constructor(
        recurrenceRule?: string,
        recurrenceEnd?: Date,
        parentEventId?: string,
        deletedInstances?: string[]
    ) {
        super();
        this.recurrenceRule = recurrenceRule;
        this.recurrenceEnd = recurrenceEnd;
        this.parentEventId = parentEventId;
        this.deletedInstances = deletedInstances;
    }

    static override decode<EventRecurrenceConfig>(data: { [key: string]: any }): EventRecurrenceConfig {
        const object = Object();

        if (data) {
            object['recurrenceRule'] = data['recurrence_rule'];
            if (data['recurrence_end']) {
                object['recurrenceEnd'] = new Date(data['recurrence_end']);
            }
            object['parentEventId'] = data['parent_event_id'];
            object['deletedInstances'] = data['deleted_instances'];
        }

        Object.setPrototypeOf(object, EventRecurrenceConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.recurrenceRule) {
            data['recurrence_rule'] = this.recurrenceRule;
        }
        if (this.recurrenceEnd !== undefined) {
            data['recurrence_end'] = this.recurrenceEnd.toISOString();
        }
        if (this.parentEventId) {
            data['parent_event_id'] = this.parentEventId;
        }
        if (this.deletedInstances) {
            data['deleted_instances'] = this.deletedInstances;
        }

        return data;
    }
}

/**
 * Configuration for individual participant registration on an event.
 * Controls capacity limits, waitlist behavior, and participant visibility.
 */
class ParticipantsConfig extends Codable<ParticipantsConfig> {
    /** Whether overflow participants are placed on a waitlist instead of being rejected */
    hasWaitlist?: boolean;
    /** Whether the participant list is hidden from non-admin viewers */
    hideParticipants?: boolean;

    /** Minimum participants needed for the event to proceed */
    minParticipants?: number;
    /** Maximum participants allowed — additional RSVPs go to the waitlist (if enabled) */
    maxParticipants?: number;

    constructor(
        hasWaitlist?: boolean,
        hideParticipants?: boolean,
        minParticipants?: number,
        maxParticipants?: number
    ) {
        super();
        this.hasWaitlist = hasWaitlist;
        this.hideParticipants = hideParticipants;

        this.minParticipants = minParticipants;
        this.maxParticipants = maxParticipants;
    }

    static override decode<ParticipantsConfig>(data: { [key: string]: any }): ParticipantsConfig {
        const object = Object();

        if (data) {
            object['hasWaitlist'] = data['has_waitlist'];
            object['hideParticipants'] = data['hide_participants'];
            object['minParticipants'] = data['min_participants'];
            object['maxParticipants'] = data['max_participants'];
        }

        Object.setPrototypeOf(object, ParticipantsConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.hasWaitlist !== undefined) {
            data['has_waitlist'] = this.hasWaitlist;
        }
        if (this.hideParticipants !== undefined) {
            data['hide_participants'] = this.hideParticipants;
        }
        if (this.minParticipants !== undefined) {
            data['min_participants'] = this.minParticipants;
        }
        if (this.maxParticipants !== undefined) {
            data['max_participants'] = this.maxParticipants;
        }

        return data;
    }
}

/**
 * Configuration for team-based events.
 * Controls team capacity, waitlist behavior, and team visibility.
 */
class TeamsConfig extends Codable<TeamsConfig> {
    /** Whether overflow teams are placed on a waitlist instead of being rejected */
    hasWaitlist?: boolean;
    /** Whether the team list is hidden from non-admin viewers */
    hideTeams?: boolean;

    /** Minimum number of teams needed for the event to proceed */
    minTeams?: number;
    /** Maximum number of teams allowed */
    maxTeams?: number;
    /** Maximum number of members allowed per team */
    maxTeamSize?: number;

    constructor(
        hasWaitlist?: boolean,
        hideTeams?: boolean,
        minTeams?: number,
        maxTeams?: number,
        maxTeamSize?: number
    ) {
        super();
        this.hasWaitlist = hasWaitlist;
        this.hideTeams = hideTeams;

        this.minTeams = minTeams;
        this.maxTeams = maxTeams;
        this.maxTeamSize = maxTeamSize;
    }

    static override decode<TeamsConfig>(data: { [key: string]: any }): TeamsConfig {
        const object = Object();

        if (data) {
            object['hasWaitlist'] = data['has_waitlist'];
            object['hideTeams'] = data['hide_teams'];

            object['minTeams'] = data['min_teams'];
            object['maxTeams'] = data['max_teams'];
            object['maxTeamSize'] = data['max_team_size'];
        }

        Object.setPrototypeOf(object, TeamsConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.hasWaitlist !== undefined) {
            data['has_waitlist'] = this.hasWaitlist;
        }
        if (this.hideTeams !== undefined) {
            data['hide_teams'] = this.hideTeams;
        }
        if (this.minTeams !== undefined) {
            data['min_teams'] = this.minTeams;
        }
        if (this.maxTeams !== undefined) {
            data['max_teams'] = this.maxTeams;
        }
        if (this.maxTeamSize !== undefined) {
            data['max_team_size'] = this.maxTeamSize;
        }

        return data;
    }
}

/**
 * General display/privacy settings for an event.
 * These flags control what information is visible to non-admin users.
 */
class EventConfig extends Codable<EventConfig> {
    /** Hide the identity of who created the event */
    hidePoster?: boolean;
    /** Hide the event's location from non-participants and non-admins */
    hideLocation?: boolean;

    constructor(
        hidePoster?: boolean,
        hideLocation?: boolean
    ) {
        super();
        this.hidePoster = hidePoster;
        this.hideLocation = hideLocation;
    }

    static override decode<EventConfig>(data: { [key: string]: any; }): EventConfig {
        const object = Object();

        if (data) {
            object['hidePoster'] = data['hide_poster'];
            object['hideLocation'] = data['hide_location'];
        }

        Object.setPrototypeOf(object, EventConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.hidePoster) {
            data['hide_poster'] = this.hidePoster;
        }

        if (this.hideLocation) {
            data['hide_location'] = this.hideLocation;
        }

        return data;
    }
}

/**
 * Configuration for competition/tournament events.
 * Supports multiple format types (bracket, league, round robin, etc.),
 * round tracking, bracket data, and registration windows.
 *
 * Competition events can spawn child "game" events — linked via parentCompetitionId.
 */
class EventFormatConfig extends Codable<EventFormatConfig> {
    /** Whether this event is a structured competition (tournament, league, etc.) */
    isCompetition?: boolean;
    /** Whether this event is a single game/match within a larger competition */
    isCompetitionGame?: boolean;
    /** Links a game event back to its parent competition event */
    parentCompetitionId?: string;
    /** Current state of the competition: "PENDING", "LIVE", or "COMPLETED" */
    competitionState?: string;

    /** Competition format types (e.g. bracket, round_robin, single_elimination, best_of_3) */
    formats?: COMPETITION_FORMAT[];
    /** Total number of rounds in the competition */
    rounds?: number;
    /** Which round is currently active */
    currentRound?: number;
    /** Opaque bracket/tournament structure data — format depends on the competition type */
    bracketData?: any;

    /** When registration opens for this competition */
    registrationStart?: Date;
    /** Registration deadline — after this, only allowed if allowLateRegistration is true */
    registrationEnd?: Date;
    /** Whether participants can register after the registration deadline */
    allowLateRegistration?: boolean;

    constructor(
        isCompetition?: boolean,
        isCompetitionGame?: boolean,
        parentCompetitionId?: string,
        competitionState?: string,
        formats?: COMPETITION_FORMAT[],
        rounds?: number,
        currentRound?: number,
        bracketData?: any,
        registrationStart?: Date,
        registrationEnd?: Date,
        allowLateRegistration?: boolean
    ) {
        super();
        this.isCompetition = isCompetition;
        this.isCompetitionGame = isCompetitionGame;
        this.parentCompetitionId = parentCompetitionId;
        this.competitionState = competitionState;
        this.formats = formats;
        this.rounds = rounds;
        this.currentRound = currentRound;
        this.bracketData = bracketData;
        this.registrationStart = registrationStart;
        this.registrationEnd = registrationEnd;
        this.allowLateRegistration = allowLateRegistration;
    }

    static override decode<EventFormatConfig>(data: { [key: string]: any }): EventFormatConfig {
        const object = Object();

        if (data) {
            object['isCompetition'] = data['is_competition'];
            object['isCompetitionGame'] = data['is_competition_game'];
            object['parentCompetitionId'] = data['parent_competition_id'];
            object['competitionState'] = data['competition_state'];
            object['formats'] = data['formats'] !== undefined ? data['formats'].map((f: COMPETITION_FORMAT) => stringToCompetitionFormat(f)) : undefined;
            object['rounds'] = data['rounds'];
            object['currentRound'] = data['current_round'];
            object['bracketData'] = data['bracket_data'];
            object['registrationStart'] = data['registration_start'];
            object['registrationEnd'] = data['registration_end'];
            object['allowLateRegistration'] = data['allow_late_registration'];
        }

        Object.setPrototypeOf(object, EventFormatConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.isCompetition !== undefined) {
            data['is_competition'] = this.isCompetition;
        }
        if (this.isCompetitionGame !== undefined) {
            data['is_competition_game'] = this.isCompetitionGame;
        }
        if (this.parentCompetitionId) {
            data['parent_competition_id'] = this.parentCompetitionId;
        }
        if (this.competitionState) {
            data['competition_state'] = this.competitionState;
        }
        if (this.formats !== undefined) {
            data['formats'] = this.formats.map((f) => f.valueOf());
        }
        if (this.rounds !== undefined) {
            data['rounds'] = this.rounds;
        }
        if (this.currentRound !== undefined) {
            data['current_round'] = this.currentRound;
        }
        if (this.bracketData !== undefined) {
            data['bracket_data'] = this.bracketData;
        }
        if (this.registrationStart !== undefined) {
            data['registration_start'] = this.registrationStart.toISOString();
        }
        if (this.registrationEnd !== undefined) {
            data['registration_end'] = this.registrationEnd.toISOString();
        }
        if (this.allowLateRegistration !== undefined) {
            data['allow_late_registration'] = this.allowLateRegistration;
        }

        return data;
    }
}

/**
 * A team registered for a team-based event.
 * Members are stored as Participant objects (same model as individual participants).
 */
class Team extends Codable<Team> {
    id: string;
    name: string;
    /** Team members — each represented as a Participant with their own RSVP status */
    members: Participant[];
    /** The event this team is registered for */
    eventId: string;
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        members: Participant[],
        eventId: string,
        createdAt: Date
    ) {
        super();
        this.id = id;
        this.name = name;
        this.members = members;
        this.eventId = eventId;
        this.createdAt = createdAt;
    }

    static override decode<Team>(data: { [key: string]: any }): Team {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['name'] = data['name'];
            object['members'] = data['members'] ? data['members'].map((m: any) => Participant.decode(m)) : [];
            object['eventId'] = data['event_id'];
            object['createdAt'] = new Date(data['created_at']);
        }

        Object.setPrototypeOf(object, Team.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id) {
            data['id'] = this.id;
        }
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.members) {
            data['members'] = this.members.map((m) => m.encode());
        }
        if (this.eventId) {
            data['event_id'] = this.eventId;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }

        return data;
    }
}

/** Data Access Object for creating or updating a team within an event. */
class TeamDao extends Codable<TeamDao> {
    id?: string;
    name?: string;
    members?: Participant[];
    eventId?: string;
    createdAt?: Date;

    constructor(
        id?: string,
        name?: string,
        members?: Participant[],
        eventId?: string,
        createdAt?: Date
    ) {
        super();
        this.id = id;
        this.name = name;
        this.members = members;
        this.eventId = eventId;
        this.createdAt = createdAt;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id) {
            data['id'] = this.id;
        }
        if (this.name) {
            data['name'] = this.name;
        }
        if (this.members) {
            data['members'] = this.members.map((m) => m.encode());
        }
        if (this.eventId) {
            data['event_id'] = this.eventId;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }

        return data;
    }
}

/** A single emoji reaction on an event comment. */
class CommentReaction extends Codable<CommentReaction> {
    id: string;
    /** The user who reacted — may be undefined if the user account was deleted */
    user?: UserSnippet;
    type: COMMENT_REACTION_TYPE;
    createdAt: Date;

    constructor(
        id: string,
        type: COMMENT_REACTION_TYPE,
        createdAt: Date,
        user?: UserSnippet
    ) {
        super();
        this.id = id;
        this.user = user;
        this.type = type;
        this.createdAt = createdAt;
    }

    static override decode<CommentReaction>(data: { [key: string]: any }): CommentReaction {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['user'] = data['user'] ? UserSnippet.decode(data['user']) : undefined;
            object['type'] = stringToCommentReactionType(data['type']);
            object['createdAt'] = new Date(data['created_at']);
        }

        Object.setPrototypeOf(object, CommentReaction.prototype);
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
        if (this.type) {
            data['type'] = this.type.valueOf();
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }

        return data;
    }
}

/** Data Access Object for creating a reaction on a comment. */
class CommentReactionDao extends Codable<CommentReactionDao> {
    type: COMMENT_REACTION_TYPE;

    constructor(type: COMMENT_REACTION_TYPE) {
        super();
        this.type = type;
    }

    override encode(): { [key: string]: any } {
        return {
            'type': this.type.valueOf()
        };
    }
}

/** A user comment on an event. */
class EventComment extends Codable<EventComment> {
    id: string;
    /** The comment author — may be undefined if the user account was deleted */
    user?: UserSnippet;
    text: string;
    eventId: string;
    /** Emoji reactions on this comment */
    reactions: CommentReaction[];
    createdAt: Date;

    constructor(
        id: string,
        text: string,
        eventId: string,
        createdAt: Date,
        user?: UserSnippet,
        reactions?: CommentReaction[]
    ) {
        super();
        this.id = id;
        this.user = user;
        this.text = text;
        this.eventId = eventId;
        this.reactions = reactions ?? [];
        this.createdAt = createdAt;
    }

    static override decode<EventComment>(data: { [key: string]: any }): EventComment {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['user'] = data['user'] ? UserSnippet.decode(data['user']) : undefined;
            object['text'] = data['text'];
            object['eventId'] = data['event_id'];
            object['reactions'] = data['reactions'] ? data['reactions'].map((r: any) => CommentReaction.decode(r)) : [];
            object['createdAt'] = new Date(data['created_at']);
        }

        Object.setPrototypeOf(object, EventComment.prototype);
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
        if (this.text) {
            data['text'] = this.text;
        }
        if (this.eventId) {
            data['event_id'] = this.eventId;
        }
        if (this.reactions && this.reactions.length > 0) {
            data['reactions'] = this.reactions.map((r) => r.encode());
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }

        return data;
    }
}

/** Data Access Object for creating or updating a comment on an event. */
class EventCommentDao extends Codable<EventCommentDao> {
    id?: string;
    userId?: string;
    text?: string;
    /** Required — the event this comment belongs to */
    eventId: string;
    createdAt?: Date;

    constructor(
        eventId: string,
        id?: string,
        userId?: string,
        text?: string,
        createdAt?: Date
    ) {
        super();
        this.id = id;
        this.userId = userId;
        this.text = text;
        this.eventId = eventId;
        this.createdAt = createdAt;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id) {
            data['id'] = this.id;
        }
        if (this.userId) {
            data['user_id'] = this.userId;
        }
        if (this.text) {
            data['text'] = this.text;
        }
        if (this.eventId) {
            data['event_id'] = this.eventId;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt.toISOString();
        }

        return data;
    }
}

export {
    Event,
    EventDao,
    EventConfig,
    EventsResponse,
    EventSection,
    LocationResponse,
    
    NewEventDao,
    RecurrenceOptions,

    ParticipantsConfig,
    TeamsConfig,
    
    EventFormatConfig,
    EventRecurrenceConfig,
    
    Team,
    TeamDao,

    CommentReaction,
    CommentReactionDao,

    EventComment,
    EventCommentDao
}