import { Event } from "~/data/models/EventModels";

Array.prototype.userNextEvents = function <T extends Event>(this: T[], userId: string): T[] | undefined {
    if (this.length === 0) return undefined;
    return this
        .filter((e) => e.participants?.some((participant) => participant.user?.userId === userId))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

Array.prototype.mostRecentForUser = function <T extends Event>(this: T[], userId: string): T | undefined {
    if (this.length === 0) return undefined;
    return this
        .filter((e) => e.participants?.some((participant) => participant.user?.userId === userId))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .at(0);
};

Array.prototype.mostRecentForClub = function<T extends Event>(this: T[], id: string): T | undefined {
    if (this.length == 0) return undefined;
    return this
        .filter((e) => e.organizers?.find((o) => o.id === id))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .at(0);
}
  
Array.prototype.filterByGroupID = function <T extends Event>(this: T[], id: string): T[] | undefined {
    if (this.length === 0) return undefined;
  
    const filtered = this.filter(
        (event) => { 
            return event.organizers?.some((organizer) => organizer.id === id)
        }
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  
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