import { Ownership, GeoJSON } from "./GenericModels";
import { Codable } from "./Models";

class Venue extends Codable<Venue> {
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

    bookingURL: string | undefined;
    requiresBooking: boolean = true;

    static override decode<Venue>(data: { [key: string]: any }): Venue {
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
            if (data['booking_url']) {
                object['bookingURL'] = data['booking_url'];
            }

            object['requiresBooking'] = data['requires_booking'] ?? false;
        }

        Object.setPrototypeOf(object, Venue.prototype);
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

        if (this.owner) {
            data['owner'] = this.owner.encode();
        }

        if (this.description) {
            data['description'] = this.description;
        }

        if (this.sports) {
            data['sports'] = this.sports;
        }

        if (this.images) {
            data['images'] = this.images;
        }

        if (this.location) {
            data['location'] = this.location.encode();
        }

        if (this.city) {
            data['city'] = this.city;
        }

        if (this.state) {
            data['state'] = this.state;
        }

        if (this.country) {
            data['country'] = this.country;
        }

        if (this.bookingURL) {
            data['booking_url'] = this.bookingURL;
        }

        data['requires_booking'] = this.requiresBooking;

        return data;
    }
}

class VenuesResponse extends Codable<VenuesResponse> {
    venues: Venue[] | undefined;
    totalVenues: number | undefined;

    static override decode<VenuesResponse>(data: { [key: string]: any }): VenuesResponse {
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
