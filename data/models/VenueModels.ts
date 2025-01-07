import { Ownership, GeoJSON } from "./GenericModels";

class Venue {
    id: string | undefined;
    name: string | undefined;
    owner: Ownership | undefined;
    description: string | undefined;
    sports: string[] | undefined;
    images: string[] | undefined;

    location: GeoJSON | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;

    static decode<Venue>(data: { [key: string]: any }): Venue {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['owner']) {
                object['owner'] = Ownership.decode(data['owner']);
            }
            if (data['description']) {
                object['description'] = data['description'];
            }
            if (data['sports']) {
                object['sports'] = data['sports'];
            }
            if (data['images']) {
                object['images'] = data['images'];
            }
            if (data['location']) {
                object['location'] = GeoJSON.decode(data['location']);
            }
            if (data['city']) {
                object['city'] = data['city'];
            }
            if (data['state']) {
                object['state'] = data['state'];
            }
            if (data['country']) {
                object['country'] = data['country'];
            }
        }

        Object.setPrototypeOf(object, Venue.prototype);
        return object;
    }
}

class VenuesResponse {
    venues: Venue[] | undefined;
    totalVenues: number | undefined;

    static decode<VenuesResponse>(data: { [key: string]: any }): VenuesResponse {
        const object = Object();

        if (data) {
            if (data['venues']) {
                object['venues'] = data['venues'].map((fieldData: any) => Venue.decode(fieldData));
            }
            if (data['total_venues']) {
                object['totalVenues'] = data['total_venues'];
            }
        }
        
        Object.setPrototypeOf(object, VenuesResponse.prototype);
        return object;
    }
}

export { Venue, VenuesResponse };
