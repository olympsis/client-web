import { Event } from "~/data/models/EventModels";

Array.prototype.userNextEvents = function <T extends Event>(this: T[], uuid: string): T[] | undefined {
    if (this.length === 0) return undefined;
    return this
        .filter((e) => e.participants?.some((participant) => participant.user?.uuid === uuid))
        .sort((a, b) => a.startTime - b.startTime);
};

Array.prototype.mostRecentForUser = function <T extends Event>(this: T[], uuid: string): T | undefined {
    if (this.length === 0) return undefined;
    return this
        .filter((e) => e.participants?.some((participant) => participant.user?.uuid === uuid))
        .sort((a, b) => a.startTime - b.startTime)
        .at(0);
};

Array.prototype.mostRecentForClub = function<T extends Event>(this: T[], id: string): T | undefined {
    if (this.length == 0) return undefined;
    return this
        .filter((e) => e.organizers?.find((o) => o.id === id))
        .sort((a, b) => a.startTime - b.startTime)
        .at(0);
}
  
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