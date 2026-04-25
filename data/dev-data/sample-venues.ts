import { Venue } from "../models/VenueModels";
import { GeoJSON } from "../models/GenericModels";

/**
 * Build a sample Venue with the new server-aligned shape.
 * `ownerId` is a fake organization id — UI components resolve it to the
 * Organization on render via the model store.
 */
function buildVenue(data: {
    id: string;
    ownerId?: string;
    name: string;
    description: string;
    sports: string[];
    media: string[];
    coordinates: [number, number];
    address?: string;
    locality: string;
    administrativeArea: string;
    countryCode: string;
}): Venue {
    return Venue.decode({
        id: data.id,
        owner_id: data.ownerId,
        name: data.name,
        description: data.description,
        sports: data.sports,
        media: data.media,
        location: { type: 'Point', coordinates: data.coordinates },
        address: data.address ?? '',
        locality: data.locality,
        administrative_area: data.administrativeArea,
        country_code: data.countryCode,
    });
}

const sampleVenues: Venue[] = [
    buildVenue({
        id: "ven_1001",
        ownerId: "org_municipal_1",
        name: "Meadowlands Stadium",
        description: "Professional soccer stadium with state-of-the-art facilities, seating for 45,000 spectators, and a world-class playing surface.",
        sports: ["soccer", "football"],
        media: [
            "https://example.com/venues/meadowlands1.jpg",
            "https://example.com/venues/meadowlands2.jpg",
        ],
        coordinates: [-74.074, 40.813],
        locality: "East Rutherford",
        administrativeArea: "NJ",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1002",
        ownerId: "org_metro_sports",
        name: "Downtown Arena",
        description: "Multi-purpose indoor arena hosting basketball games, concerts, and other events with a capacity of 20,000.",
        sports: ["basketball", "volleyball"],
        media: [
            "https://example.com/venues/downtown1.jpg",
            "https://example.com/venues/downtown2.jpg",
        ],
        coordinates: [-118.267, 34.043],
        locality: "Los Angeles",
        administrativeArea: "CA",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1003",
        ownerId: "org_baseline_sports",
        name: "Baseline Tennis Club",
        description: "Premium tennis facility featuring 12 clay courts, 8 hard courts, and a clubhouse with fitness center.",
        sports: ["tennis"],
        media: [
            "https://example.com/venues/baseline1.jpg",
            "https://example.com/venues/baseline2.jpg",
        ],
        coordinates: [-80.191, 25.761],
        locality: "Miami",
        administrativeArea: "FL",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1004",
        ownerId: "org_city_parks",
        name: "Green Valley Park",
        description: "Community park with walking trails, basketball courts, baseball diamonds, and open spaces for various recreational activities.",
        sports: ["basketball", "baseball", "running", "hiking"],
        media: [
            "https://example.com/venues/greenvalley1.jpg",
            "https://example.com/venues/greenvalley2.jpg",
        ],
        coordinates: [-122.332, 47.606],
        locality: "Seattle",
        administrativeArea: "WA",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1005",
        ownerId: "org_pinehurst_resort",
        name: "Pinehurst Golf Club",
        description: "Historic 18-hole championship golf course with rolling fairways, challenging greens, and beautiful landscaping.",
        sports: ["golf"],
        media: [
            "https://example.com/venues/pinehurst1.jpg",
            "https://example.com/venues/pinehurst2.jpg",
        ],
        coordinates: [-79.482, 35.189],
        locality: "Pinehurst",
        administrativeArea: "NC",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1006",
        ownerId: "org_mountain_adventures",
        name: "Alpine Peaks Resort",
        description: "Mountain resort offering 40+ ski trails for all skill levels, snow parks, and equipment rentals.",
        sports: ["skiing", "snowboarding"],
        media: [
            "https://example.com/venues/alpine1.jpg",
            "https://example.com/venues/alpine2.jpg",
        ],
        coordinates: [-106.822, 39.482],
        locality: "Aspen",
        administrativeArea: "CO",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1007",
        ownerId: "org_powerfit",
        name: "PowerFit Gym",
        description: "Modern fitness facility with cardio equipment, free weights, group exercise studios, and personal training.",
        sports: ["exercise"],
        media: [
            "https://example.com/venues/powerfit1.jpg",
            "https://example.com/venues/powerfit2.jpg",
        ],
        coordinates: [-87.624, 41.881],
        locality: "Chicago",
        administrativeArea: "IL",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1008",
        ownerId: "org_city_recreation",
        name: "Urban Grind Skate Park",
        description: "Outdoor skate park featuring rails, ramps, half-pipes, and other obstacles for skaters of all skill levels.",
        sports: ["skateboarding"],
        media: [
            "https://example.com/venues/urbangrind1.jpg",
            "https://example.com/venues/urbangrind2.jpg",
        ],
        coordinates: [-122.419, 37.775],
        locality: "San Francisco",
        administrativeArea: "CA",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1009",
        ownerId: "org_coastal_recreation",
        name: "Sunset Beach Volleyball Center",
        description: "Beachfront volleyball complex with 10 professional-grade sand courts and spectator areas.",
        sports: ["volleyball"],
        media: [
            "https://example.com/venues/sunset1.jpg",
            "https://example.com/venues/sunset2.jpg",
        ],
        coordinates: [-117.904, 33.742],
        locality: "Huntington Beach",
        administrativeArea: "CA",
        countryCode: "US",
    }),
    buildVenue({
        id: "ven_1010",
        ownerId: "org_county_sports",
        name: "Riverside Sports Complex",
        description: "Large multi-sport facility with fields and courts for soccer, basketball, baseball, tennis, and more. Includes concessions and parking.",
        sports: ["soccer", "basketball", "baseball", "tennis", "volleyball"],
        media: [
            "https://example.com/venues/riverside1.jpg",
            "https://example.com/venues/riverside2.jpg",
        ],
        coordinates: [-97.743, 30.267],
        locality: "Austin",
        administrativeArea: "TX",
        countryCode: "US",
    }),
];

export { sampleVenues };
