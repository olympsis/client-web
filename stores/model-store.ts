import type { Model } from "@/data/models/GenericModels";

import { defineStore } from "pinia";
import { Club } from "@/data/models/ClubModels";
import { Post } from "@/data/models/PostModels";
import { Event } from "@/data/models/EventModels";
import { Venue } from "@/data/models/VenueModels";
import { UserData } from "@/data/models/UserModels";
import { UserService } from "@/data/services/UserService";
import { PostService } from "@/data/services/PostService";
import { ClubService } from "@/data/services/ClubService";
import { VenueService } from "@/data/services/VenueService";
import { EventService } from "@/data/services/EventService";
import { Organization } from "@/data/models/OrganizationModels";
import { OrganizationService } from "../services/OrganizationService";

export enum MODEL_STORE_ERROR {
    FAILED_TO_FIND_MODEL=0,
    FAILED_TO_SET_MODEL=1
}

export const useModelStore = defineStore('model-store', () => {

    const venueService = new VenueService();
    const eventService = new EventService();
    const postService = new PostService();
    const clubService = new ClubService();
    const orgService = new OrganizationService();
    
    const venueModels: Map<string, Venue> = new Map();
    const eventModels: Map<string, Event> = new Map();

    const postModels: Map<string, Post> = new Map();
    const clubModels: Map<string, Club> = new Map();
    const orgModels: Map<string, Organization> = new Map();

    // Solve storing and retrieval of posts and linking them to their respective group
    // Maybe a post group relation map

    // Solve generics issues - maybe i need to educate more about TS generics
    // async function getModel<T>(id: string) : Promise<T> {
    //     switch (Object.getPrototypeOf(T)) {

    //     }
    // }

    function setModel<T = any>(model: T) : boolean {
        return false;
    }

    // REFACTOR - For now i will have explicit getters and setters for each model until i solve the generics issue
    

    async function getVenueByID(id: string) : Promise<Venue> {
        const memory = venueModels.get(id);
        if (memory) {
            return memory;
        } else {
            const remote = await venueService.getVenue(id);
            if (remote) {
                setVenue(remote);
                return remote;
            } else {
                throw('NOT IMPLEMENTED - Failed to fetch venue remotely.');
            }
        }
    }

    function getAllVenues() : Venue[] {
        const arr: Venue[] = [];
        venueModels.forEach((value: Venue, key: string) => {
            arr.push(value);
        });

        return arr;
    }

    function setVenue(venue: Venue) : boolean {
        if (venue.id) {
            venueModels.set(venue.id, venue);
            return true;
        }

        return false;
    }

    function setVenues(venues: Venue[]) {
        venues.forEach(v => {
            setVenue(v);
        });
    }


    async function getEventByID(id: string) : Promise<Event> {
        const memory = eventModels.get(id);
        if (memory) {
            return memory;
        } else {
            const remote = await eventService.getEvent(id);
            if (remote) {
                setEvent(remote);
                return remote;
            } else {
                throw('NOT IMPLEMENTED - Failed to fetch venue remotely.');
            }
        }
    }

    function getAllEvents() : Event[] {
        const arr: Event[] = [];
        eventModels.forEach((value: Event, key: string) => {
            arr.push(value);
        });

        return arr;
    }

    function setEvent(event: Event) : boolean {
        if (event.id) {
            eventModels.set(event.id, event);
            return true;
        }

        return false;
    }

    function setEvents(events: Event[]) {
        events.forEach((e) => {
            setEvent(e);
        });
    }


    async function getClubByID(id: string) : Promise<Club> {
        const memory = clubModels.get(id);
        if (memory) {
            return memory;
        } else {
            const remote = await clubService.getClub(id);
            if (remote) {
                setClub(remote);
                return remote;
            } else {
                throw('NOT IMPLEMENTED - Failed to club venue remotely.');
            }
        }
    }

    function getAllClubs() : Club[] {
        const arr: Club[] = [];

        clubModels.forEach((value: Club, key: string) => {
            arr.push(value);
        });

        return arr;
    }
 
    function setClub(club: Club) : boolean {
        if (club.id) {
            clubModels.set(club.id, club);
            return true;
        }

        return false;
    }

    function setClubs(clubs: Club[]) {
        clubs.forEach((c) => {
            setClub(c);
        });
    }


    async function getOrganizationByID(id: string) : Promise<Organization> {
        const memory = orgModels.get(id);
        if (memory) {
            return memory;
        } else {
            const remote = await orgService.getOrganization(id);
            if (remote) {
                setOrganization(remote);
                return remote;
            } else {
                throw('NOT IMPLEMENTED - Failed to organization venue remotely.');
            }
        }
    }

    function getAllOrganizations() : Organization[] {
        const arr: Organization[] = [];

        orgModels.forEach((value: Organization, key: string) => {
            arr.push(value);
        });

        return arr;
    }

    function setOrganization(org: Organization) : boolean {
        if (org.id) {
            orgModels.set(org.id, org);
            return true;
        }

        return false;
    }

    function setOrganizations(orgs: Organization[]) {
        orgs.forEach((o) => {
            setOrganization(o);
        });
    }

    return {

        venueModels,
        eventModels,

        postModels,
        clubModels,
        orgModels,

        getVenueByID,
        getAllVenues,
        setVenue,
        setVenues,

        getEventByID,
        getAllEvents,
        setEvent,
        setEvents,

        getClubByID,
        getAllClubs,
        setClub,
        setClubs,

        getOrganizationByID,
        getAllOrganizations,
        setOrganization,
        setOrganizations
    };
});