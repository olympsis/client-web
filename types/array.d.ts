import { Event } from "./EventModels";

declare global {
   interface Array<T> {
       mostRecentForClub(id: string): T | undefined;
       mostRecentForUser(uuid: string): T | undefined;
       filterByGroupID(id: string): T[] | undefined;
       filterByVenueID(id: string): T[] | undefined;
   }
}