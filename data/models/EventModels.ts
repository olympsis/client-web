import { Club } from "./ClubModels";
import { Codable } from "./Models";
import { Venue } from "./VenueModels";
import { UserSnippet } from "./UserModels";  
import { Organization } from "./OrganizationModels";
import { VenueDescriptor, Organizer, Participant, GroupSelection } from "./GenericModels";
import { 
    type EVENT_TYPE,
    EVENT_VISIBILITY, 
    EVENT_SKILL_LEVEL, 
    eventTypeToNumber, 
    numberToEventType, 
    eventSkillLevelToNumber, 
    eventVisibilityToNumber, 
    numberToEventSkillLevel, 
    numberToEventVisibility,
    GROUP_TYPE, 
} from "../Enums";
  
class Event extends Codable<Event> {
    id: string;
    type: EVENT_TYPE;
    poster: UserSnippet | undefined;
    organizers: Organizer[];
    venues: VenueDescriptor[];
    imageURL: string;
    title: string;
    body: string;
    sports: string[];
    level: EVENT_SKILL_LEVEL;
    startTime: number;
    stopTime: number;
    minParticipants: number | undefined;
    maxParticipants: number | undefined;
    participants: Participant[] | undefined;
    visibility: EVENT_VISIBILITY;
    externalLink: string | undefined;
    createdAt: number;

    constructor(
        id: string,
        type: EVENT_TYPE,
        poster: UserSnippet | undefined,
        organizers: Organizer[],
        venues: VenueDescriptor[],
        imageURL: string,
        title: string,
        body: string,
        sports: string[],
        level: EVENT_SKILL_LEVEL,
        startTime: number,
        stopTime: number,
        minParticipants: number | undefined,
        maxParticipants: number | undefined,
        participants: Participant[],
        visibility: EVENT_VISIBILITY,
        externalLink: string | undefined,
        createdAt: number,
    ){
        super();
        this.id = id;
        this.type = type;
        this.poster = poster;
        this.organizers = organizers;
        this.venues = venues;
        this.imageURL = imageURL;
        this.title = title;
        this.body = body;
        this.sports = sports;
        this.level = level;
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.minParticipants = minParticipants;
        this.maxParticipants = maxParticipants;
        this.participants = participants;
        this.visibility = visibility;
        this.externalLink = externalLink;
        this.createdAt = createdAt;
    }
  
    static override decode<Event>(data: { [key: string]: any }): Event {
        const object = Object();

        if (data) {
            object['id'] = data['id'];
            object['type'] = numberToEventType(data['type']);
            object['poster'] = data['poster'] ? UserSnippet.decode(data['poster']) : undefined;
            object['organizers'] = data['organizers'] ? data['organizers'].map((org: any) => Organizer.decode(org)) : undefined;
            object['venues'] = data['venues'] ? data['venues'].map((v: any) => VenueDescriptor.decode(v)) : undefined;
            object['imageURL'] = data['image_url'];
            object['title'] = data['title'];
            object['body'] = data['body'];
            object['sports'] = data['sports'];
            object['level'] = numberToEventSkillLevel(data['level']);
            object['startTime'] = data['start_time'];
            object['stopTime'] = data['stop_time'];
            object['minParticipants'] = data['min_participants'];
            object['maxParticipants'] = data['max_participants'];
            object['participants'] = data['participants'] ? data['participants'].map((participant: any) => Participant.decode(participant)) : undefined;
            object['visibility'] = numberToEventVisibility(data['visibility']);
            object['clubs'] = data['clubs'] ? data['clubs'].map((club: any) => Club.decode(club)) : undefined;
            object['organizations'] = data['organizations'] ? data['organizations'].map((org: any) => Organization.decode(org)) : undefined;
            object['externalLink'] = data['external_link'];
            object['createdAt'] = data['created_at'];
        }

        Object.setPrototypeOf(object, Event.prototype);
        return object;
    }

    override encode(): { [key: string]: any; } {
        const data: { [key: string]: any } = {};

        if (this.type) {
            data['type'] = eventTypeToNumber(this.type);
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
        if (this.imageURL) {
            data['image_url'] = this.imageURL;
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
        if (this.level !== undefined) {
            data['level'] = eventSkillLevelToNumber(this.level);
        }
        if (this.startTime) {
            data['start_time'] = this.startTime;
        }
        if (this.stopTime) {
            data['stop_time'] = this.stopTime;
        }
        if (this.minParticipants) {
            data['min_participants'] = this.minParticipants;
        }
        if (this.maxParticipants) {
            data['max_participants'] = this.maxParticipants;
        }
        if (this.participants) {
            data['participants'] = this.participants.map((p) => p.encode());
        }
        if (this.visibility) {
            data['visibility'] = eventVisibilityToNumber(this.visibility);
        }
        if (this.externalLink) {
            data['external_link'] = this.externalLink;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt;
        }

        return data;
    }

    public timeToString(): string {
        if (!this.startTime) {
            return 'Unknown';
        }

        const currentDate = new Date();
        const timestamp = this.startTime * 1000;
        const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

        const eventStartDate = new Date(timestamp);
        if (this.isToday(eventStartDate)) {
            return 'Today';
        } else if (this.isTomorrow(eventStartDate)) {
            return 'Tomorrow';
        } else if (this.isThisWeek(eventStartDate, currentDate)) {
            return eventStartDate.toLocaleDateString('en-US', { weekday: 'long' });
        } else if (this.isThisYear(eventStartDate, currentDate)) {
            return formatter.format(eventStartDate);
        } else {
            return formatter.format(eventStartDate);
        }
    }
  
    public timeToHourAndMinute() : string {
        const date = new Date(this.startTime ?? 0);
        date.setUTCHours(0, 0, 0, 0);

        const hours = 12;
        const minutes = '00';
        const med = 'AM';

        return `${hours}:${minutes} ${med}`;
    }

    public startTimeToString(): string {
        const date = new Date(this.startTime);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const m = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 24h to 12h format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0) as 12
    
        return `${hours}:${minutes} ${m}`;
    }
    
    public stopTimeToString(stopTime: number | undefined = undefined): string {
        const date = new Date(this.stopTime);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const m = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 24h to 12h format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0) as 12
    
        return `${hours}:${minutes} ${m}`;
    }

    public timeDifferenceToString(): string {
      if (!this.startTime) {
        return '00:00 am';
      }
  
      const currentDate = new Date();
      const dateFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hourCycle: 'h12' });
      const date = new Date(this.startTime * 1000);
  
      const timeDifference = Math.floor((currentDate.getTime() - this.startTime * 1000) / 1000);
  
      if (timeDifference < 60) {
        return `${timeDifference} secs`;
      } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        return `${minutes} mins`;
      } else if (timeDifference < 86400 * 12) {
        return `${dateFormatter.format(date)} mins`;
      } else {
        const days = Math.floor(timeDifference / 86400);
        return `${days} days`;
      }
    }
  
    public isToday(date: Date): boolean {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
  
    public isTomorrow(date: Date): boolean {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear()
      );
    }
  
    public isThisWeek(date: Date, currentDate: Date): boolean {
      const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      const currentWeekEnd = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 6);
      return date >= currentWeekStart && date <= currentWeekEnd;
    }
  
    public isThisYear(date: Date, currentDate: Date): boolean {
      return date.getFullYear() === currentDate.getFullYear();
    }
}

class EventDao {
    type: EVENT_TYPE | undefined;
    poster: string | undefined;
    organizers: Organizer[] | undefined;
    venues: VenueDescriptor[] | undefined;
    imageURL: string | undefined;
    title: string | undefined;
    body: string | undefined;
    sports: string[] | undefined;
    level: EVENT_SKILL_LEVEL | undefined;
    startTime: number | undefined;
    stopTime: number | undefined;
    minParticipants: number | undefined;
    maxParticipants: number | undefined;
    participants: Participant[] | undefined;
    visibility: EVENT_VISIBILITY | undefined;
    createdAt: number | undefined;
    externalLink: string | undefined;

    constructor(
      type: EVENT_TYPE | undefined,
      visibility: EVENT_VISIBILITY | undefined,
      poster: string | undefined,
      organizers: GroupSelection[] | undefined,
      venues: VenueDescriptor[] | undefined,
      imageURL: string | undefined,
      title: string | undefined,
      body: string | undefined,
      sports: string[] | undefined,
      level: EVENT_SKILL_LEVEL | undefined,
      startTime: Date | undefined,
      stopTime: Date | undefined,
      minParticipants: number | undefined,
      maxParticipants: number | undefined,
      participants: Participant[] | undefined
    ) {
        if (type) {
            this.type = type;
        }
        
        if (poster) {
            this.poster = poster;
        }
        
        if (organizers) {
            this.organizers = organizers?.map((o) => {
                
                return new Organizer(
                    o.type === GROUP_TYPE.CLUB ? 0 : 1,
                    o.club?.id ?? o.organization?.id
                );
            });
        }
        
        if (venues) {
            this.venues = venues;
        }

        if (imageURL) {
            this.imageURL = imageURL;
        }
        
        if (title) {
            this.title = title;
        }
        
        if (body) {
            this.body = body;
        }

        if (sports) {
            this.sports = sports
        }
        
        if (level != undefined) {
            this.level = level;
        }

        if (startTime) {
            this.startTime = Math.floor(startTime.getTime() / 1000);
        }

        if (stopTime) {
            this.stopTime = Math.floor(stopTime.getTime() / 1000);
        }

        if (minParticipants) {
            this.minParticipants = minParticipants
        }

        if (maxParticipants) {
            this.maxParticipants = maxParticipants;
        }

        if (participants) {
            this.participants = participants;
        }

        if (visibility) {
            this.visibility = visibility
        }
    }
}

interface EventDao {
    encode(): { [key: string]: any }
}

EventDao.prototype.encode = function(): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    if (this.type) {
        data['type'] = eventTypeToNumber(this.type);
    }
    if (this.poster) {
        data['poster'] = this.poster;
    }
    if (this.organizers) {
        data['organizers'] = this.organizers.map((org: Organizer) => org.encode());
    }
    if (this.venues) {
        data['venues'] = this.venues.map((v) => v.encode());
    }
    if (this.imageURL) {
        data['image_url'] = this.imageURL;
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
    if (this.level !== undefined) {
        data['level'] = eventSkillLevelToNumber(this.level);
    }
    if (this.startTime) {
        data['start_time'] = this.startTime;
    }
    if (this.stopTime) {
        data['stop_time'] = this.stopTime;
    }
    if (this.minParticipants) {
        data['min_participants'] = this.minParticipants;
    }
    if (this.maxParticipants) {
        data['max_participants'] = this.maxParticipants;
    }
    if (this.visibility) {
        data['visibility'] = eventVisibilityToNumber(this.visibility);
    }
    if (this.externalLink) {
        data['external_link'] = this.externalLink;
    }
    if (this.createdAt) {
        data['created_at'] = this.createdAt;
    }

    return data;
}

class EventsResponse {
  events: Event[];
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
      object['totalEvents'] = data['total_events'].length ?? 0;

      Object.setPrototypeOf(object, EventsResponse.prototype)

      return object;
  }
}

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

class EventSection {
    date: Date;
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

export {
    Event,
    EventDao,
    EventsResponse,
    EventSection,
    LocationResponse
}