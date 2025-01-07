import { Event } from "./EventModels";

declare global {
    interface Array<T> {
        mostRecentForUser(uuid: string): T | undefined;
        filterByGroupID(id: string): T[] | undefined;
        filterByVenueID(id: string): T[] | undefined;
    }
}
  
Array.prototype.mostRecentForUser = function <T extends Event>(this: T[], uuid: string): T | undefined {
    if (this.length === 0) return undefined;

    const filtered = this.filter(
        (event) => { 
            return event.participants
                ?.some((participant) => participant.user?.uuid === uuid)
        }
    ).sort((a, b) => b.startTime - a.startTime);
    if (filtered.length === 0) return undefined;

    return filtered[0];
};
  
Array.prototype.filterByGroupID = function <T extends Event>(this: T[], id: string): T[] | undefined {
    if (this.length === 0) return undefined;
  
    const filtered = this.filter(
        (event) => { 
            return event.organizers?.some((organizer) => organizer.id === id)
        }
    ).sort((a, b) => a.startTime - b.startTime)
  
    return filtered;
};

Array.prototype.filterByVenueID = function <T extends Event>(this: T[], id: string): T[] | undefined {
    if (this.length == 0) return undefined;

    const filtered = this.filter(
        (event) => {
            return event.venues?.some((venue) => venue.id === id)
        }
    )

    return filtered;
}