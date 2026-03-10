import { Event } from "./EventModels";

declare global {
   interface Array<T> {
       mostRecentForClub(id: string): T | undefined;

       userNextEvents(userId: string): T[] | undefined;
       mostRecentForUser(userId: string): T | undefined;

       filterByGroupID(id: string): T[] | undefined;
       filterByVenueID(id: string): T[] | undefined;
   }
}