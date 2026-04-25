import { GeoJSON } from "./GenericModels";
import { Codable } from "./Models";
import { RESERVATION_STATUS, SURFACE } from "../Enums";

/**
 * Physical attributes of the venue itself.
 * Mirrors server `VenueFeatures` (models/venue.go).
 */
class VenueFeatures extends Codable<VenueFeatures> {
    indoor: boolean = false;
    accessible: boolean = false;
    illuminated: boolean = false;

    static override decode<VenueFeatures>(data: { [key: string]: any }): VenueFeatures {
        const object = Object();

        if (data) {
            object['indoor'] = data['indoor'] ?? false;
            object['accessible'] = data['accessible'] ?? false;
            object['illuminated'] = data['illuminated'] ?? false;
        }

        Object.setPrototypeOf(object, VenueFeatures.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'indoor': this.indoor,
            'accessible': this.accessible,
            'illuminated': this.illuminated,
        };
    }
}

/**
 * Rules about who can use the venue / how.
 * Mirrors server `VenueAccess`.
 */
class VenueAccess extends Codable<VenueAccess> {
    requiresPermit: boolean = false;
    requiresBooking: boolean = false;
    requiresMembership: boolean = false;

    static override decode<VenueAccess>(data: { [key: string]: any }): VenueAccess {
        const object = Object();

        if (data) {
            object['requiresPermit'] = data['requires_permit'] ?? false;
            object['requiresBooking'] = data['requires_booking'] ?? false;
            object['requiresMembership'] = data['requires_membership'] ?? false;
        }

        Object.setPrototypeOf(object, VenueAccess.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'requires_permit': this.requiresPermit,
            'requires_booking': this.requiresBooking,
            'requires_membership': this.requiresMembership,
        };
    }
}

/**
 * App-side behavior the venue supports (e.g. queueing at public courts).
 * Mirrors server `VenueCapabilities`.
 */
class VenueCapabilities extends Codable<VenueCapabilities> {
    supportsQueue: boolean = false;
    supportsWaitTimes: boolean = false;

    static override decode<VenueCapabilities>(data: { [key: string]: any }): VenueCapabilities {
        const object = Object();

        if (data) {
            object['supportsQueue'] = data['supports_queue'] ?? false;
            object['supportsWaitTimes'] = data['supports_wait_times'] ?? false;
        }

        Object.setPrototypeOf(object, VenueCapabilities.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'supports_queue': this.supportsQueue,
            'supports_wait_times': this.supportsWaitTimes,
        };
    }
}

/**
 * A weekly recurring open window.
 * `day` is a lowercase day name ("monday"…"sunday").
 * `open` / `close` are "HH:MM" 24-hour strings.
 */
class TimeSlot extends Codable<TimeSlot> {
    day: string;
    open: string;
    close: string;

    constructor(day: string = '', open: string = '', close: string = '') {
        super();
        this.day = day;
        this.open = open;
        this.close = close;
    }

    static override decode<TimeSlot>(data: { [key: string]: any }): TimeSlot {
        const object = Object();

        if (data) {
            object['day'] = data['day'] ?? '';
            object['open'] = data['open'] ?? '';
            object['close'] = data['close'] ?? '';
        }

        Object.setPrototypeOf(object, TimeSlot.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'day': this.day,
            'open': this.open,
            'close': this.close,
        };
    }
}

/**
 * A full-day closure on a specific date (e.g. maintenance, holiday).
 */
class BlackoutTimeSlot extends Codable<BlackoutTimeSlot> {
    date: Date;
    reason?: string;

    constructor(date: Date, reason?: string) {
        super();
        this.date = date;
        this.reason = reason;
    }

    static override decode<BlackoutTimeSlot>(data: { [key: string]: any }): BlackoutTimeSlot {
        const object = Object();

        if (data) {
            object['date'] = new Date(data['date']);
            if (data['reason']) {
                object['reason'] = data['reason'];
            }
        }

        Object.setPrototypeOf(object, BlackoutTimeSlot.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'date': this.date.toISOString(),
        };
        if (this.reason) {
            data['reason'] = this.reason;
        }
        return data;
    }
}

/**
 * An override of regular hours on a specific date (e.g. holiday hours).
 */
class SpecialTimeSlot extends Codable<SpecialTimeSlot> {
    date: Date;
    open: string;
    close: string;
    reason?: string;

    constructor(date: Date, open: string = '', close: string = '', reason?: string) {
        super();
        this.date = date;
        this.open = open;
        this.close = close;
        this.reason = reason;
    }

    static override decode<SpecialTimeSlot>(data: { [key: string]: any }): SpecialTimeSlot {
        const object = Object();

        if (data) {
            object['date'] = new Date(data['date']);
            object['open'] = data['open'] ?? '';
            object['close'] = data['close'] ?? '';
            if (data['reason']) {
                object['reason'] = data['reason'];
            }
        }

        Object.setPrototypeOf(object, SpecialTimeSlot.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'date': this.date.toISOString(),
            'open': this.open,
            'close': this.close,
        };
        if (this.reason) {
            data['reason'] = this.reason;
        }
        return data;
    }
}

/**
 * A weekly schedule that applies only between StartDay and EndDay (inclusive).
 * `startDay` / `endDay` accept either:
 *   "MM-DD"      — recurring every year (e.g. "05-01" to "08-31")
 *   "YYYY-MM-DD" — one-off window for a specific year
 *
 * A window may wrap the year boundary (e.g. "12-01" → "04-14").
 * `closed=true` is shorthand for "shut for the entire window"; `hours` may be empty.
 */
class SeasonalHours extends Codable<SeasonalHours> {
    name: string;
    startDay: string;
    endDay: string;
    hours: TimeSlot[];
    closed: boolean = false;

    constructor(
        name: string = '',
        startDay: string = '',
        endDay: string = '',
        hours: TimeSlot[] = [],
        closed: boolean = false
    ) {
        super();
        this.name = name;
        this.startDay = startDay;
        this.endDay = endDay;
        this.hours = hours;
        this.closed = closed;
    }

    static override decode<SeasonalHours>(data: { [key: string]: any }): SeasonalHours {
        const object = Object();

        if (data) {
            object['name'] = data['name'] ?? '';
            object['startDay'] = data['start_day'] ?? '';
            object['endDay'] = data['end_day'] ?? '';
            object['hours'] = data['hours'] ? data['hours'].map((h: any) => TimeSlot.decode(h)) : [];
            object['closed'] = data['closed'] ?? false;
        }

        Object.setPrototypeOf(object, SeasonalHours.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'name': this.name,
            'start_day': this.startDay,
            'end_day': this.endDay,
            'hours': this.hours.map((h) => h.encode()),
        };
        if (this.closed) {
            data['closed'] = this.closed;
        }
        return data;
    }
}

/**
 * Embedded on both Venue and VenueUnit.
 *
 * Resolution order (most specific wins) when the app figures out
 * whether a venue is open at a given moment:
 *   blackoutDates → specialDates → matching seasonalHours → regularHours
 */
class Availability extends Codable<Availability> {
    regularHours: TimeSlot[];
    seasonalHours: SeasonalHours[];
    blackoutDates: BlackoutTimeSlot[];
    specialDates: SpecialTimeSlot[];

    constructor(
        regularHours: TimeSlot[] = [],
        seasonalHours: SeasonalHours[] = [],
        blackoutDates: BlackoutTimeSlot[] = [],
        specialDates: SpecialTimeSlot[] = []
    ) {
        super();
        this.regularHours = regularHours;
        this.seasonalHours = seasonalHours;
        this.blackoutDates = blackoutDates;
        this.specialDates = specialDates;
    }

    static override decode<Availability>(data: { [key: string]: any }): Availability {
        const object = Object();

        if (data) {
            object['regularHours'] = data['regular_hours']
                ? data['regular_hours'].map((t: any) => TimeSlot.decode(t)) : [];
            object['seasonalHours'] = data['seasonal_hours']
                ? data['seasonal_hours'].map((s: any) => SeasonalHours.decode(s)) : [];
            object['blackoutDates'] = data['blackout_dates']
                ? data['blackout_dates'].map((b: any) => BlackoutTimeSlot.decode(b)) : [];
            object['specialDates'] = data['special_dates']
                ? data['special_dates'].map((s: any) => SpecialTimeSlot.decode(s)) : [];
        }

        Object.setPrototypeOf(object, Availability.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'regular_hours': this.regularHours.map((t) => t.encode()),
            'seasonal_hours': this.seasonalHours.map((s) => s.encode()),
            'blackout_dates': this.blackoutDates.map((b) => b.encode()),
            'special_dates': this.specialDates.map((s) => s.encode()),
        };
    }
}

/**
 * Price for a unit on a given day + time-range.
 * `rateMinor` is in the smallest currency unit (cents for USD) to avoid float rounding.
 * `timeRange` is a string like "09:00-17:00".
 */
class VenueUnitRate extends Codable<VenueUnitRate> {
    day: string;
    timeRange: string;
    currency: string;
    rateMinor: number;

    constructor(
        day: string = '',
        timeRange: string = '',
        currency: string = '',
        rateMinor: number = 0
    ) {
        super();
        this.day = day;
        this.timeRange = timeRange;
        this.currency = currency;
        this.rateMinor = rateMinor;
    }

    static override decode<VenueUnitRate>(data: { [key: string]: any }): VenueUnitRate {
        const object = Object();

        if (data) {
            object['day'] = data['day'] ?? '';
            object['timeRange'] = data['time_range'] ?? '';
            object['currency'] = data['currency'] ?? '';
            object['rateMinor'] = data['rate_minor'] ?? 0;
        }

        Object.setPrototypeOf(object, VenueUnitRate.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        return {
            'day': this.day,
            'time_range': this.timeRange,
            'currency': this.currency,
            'rate_minor': this.rateMinor,
        };
    }
}

/**
 * A bookable sub-resource of a venue: a specific court, field, lane, etc.
 * Each unit has its own surface, rate schedule, and availability so a venue with
 * mixed surfaces (e.g. 2 hard + 2 clay courts) is modeled naturally.
 */
class VenueUnit extends Codable<VenueUnit> {
    id?: string;
    venueId: string;
    name: string;
    unitType: string;       // "court", "field", etc.
    location?: GeoJSON;
    surface: SURFACE | string;
    sports: string[];
    rates: VenueUnitRate[];
    availability: Availability;

    constructor(
        venueId: string = '',
        name: string = '',
        unitType: string = '',
        surface: SURFACE | string = '',
        sports: string[] = [],
        rates: VenueUnitRate[] = [],
        availability: Availability = new Availability(),
        id?: string,
        location?: GeoJSON
    ) {
        super();
        this.id = id;
        this.venueId = venueId;
        this.name = name;
        this.unitType = unitType;
        this.location = location;
        this.surface = surface;
        this.sports = sports;
        this.rates = rates;
        this.availability = availability;
    }

    static override decode<VenueUnit>(data: { [key: string]: any }): VenueUnit {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            object['venueId'] = data['venue_id'] ?? '';
            object['name'] = data['name'] ?? '';
            object['unitType'] = data['unit_type'] ?? '';
            if (data['location']) {
                object['location'] = GeoJSON.decode(data['location']);
            }
            object['surface'] = data['surface'] ?? '';
            object['sports'] = data['sports'] ?? [];
            object['rates'] = data['rates']
                ? data['rates'].map((r: any) => VenueUnitRate.decode(r)) : [];
            object['availability'] = data['availability']
                ? Availability.decode(data['availability']) : new Availability();
        }

        Object.setPrototypeOf(object, VenueUnit.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'venue_id': this.venueId,
            'name': this.name,
            'unit_type': this.unitType,
            'surface': this.surface.valueOf(),
            'sports': this.sports,
            'rates': this.rates.map((r) => r.encode()),
            'availability': this.availability.encode(),
        };
        if (this.id) {
            data['id'] = this.id;
        }
        if (this.location) {
            data['location'] = this.location.encode();
        }
        return data;
    }
}

/**
 * A public-transit line (subway, bus, train) serving the venue.
 * Stored in its own collection server-side so the same line (e.g. the NYC "Q")
 * can be referenced by many venues without duplication.
 */
class TransitLine extends Codable<TransitLine> {
    id?: string;
    type: string;       // "subway", "bus", "train", ...
    name: string;
    system: string;     // e.g. "MTA"
    color: string;
    iconURL: string;
    locality: string;
    administrativeArea: string;
    countryCode: string;

    constructor(
        type: string = '',
        name: string = '',
        system: string = '',
        color: string = '',
        iconURL: string = '',
        locality: string = '',
        administrativeArea: string = '',
        countryCode: string = '',
        id?: string
    ) {
        super();
        this.id = id;
        this.type = type;
        this.name = name;
        this.system = system;
        this.color = color;
        this.iconURL = iconURL;
        this.locality = locality;
        this.administrativeArea = administrativeArea;
        this.countryCode = countryCode;
    }

    static override decode<TransitLine>(data: { [key: string]: any }): TransitLine {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            object['type'] = data['type'] ?? '';
            object['name'] = data['name'] ?? '';
            object['system'] = data['system'] ?? '';
            object['color'] = data['color'] ?? '';
            object['iconURL'] = data['icon_url'] ?? '';
            object['locality'] = data['locality'] ?? '';
            object['administrativeArea'] = data['administrative_area'] ?? '';
            object['countryCode'] = data['country_code'] ?? '';
        }

        Object.setPrototypeOf(object, TransitLine.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'type': this.type,
            'name': this.name,
            'system': this.system,
            'color': this.color,
            'icon_url': this.iconURL,
            'locality': this.locality,
            'administrative_area': this.administrativeArea,
            'country_code': this.countryCode,
        };
        if (this.id) {
            data['id'] = this.id;
        }
        return data;
    }
}

/**
 * A physical location where sports activities happen.
 *
 * - `ownerId` references an Organization (owners must be orgs). The client
 *   resolves this to a full Organization via the org service when rendering.
 * - `units` and `transitLines` come back fully-populated from the API, but
 *   live in their own collections server-side (so PATCH/DAO writes only
 *   manipulate the reference IDs — see VenueDao).
 * - `availability` describes the venue's overall open hours; each unit can
 *   override with its own Availability.
 */
class Venue extends Codable<Venue> {
    id?: string;
    ownerId?: string;
    name?: string;
    description?: string;

    availability: Availability = new Availability();

    sports: string[] = [];
    media: string[] = [];
    url?: string;

    address?: string;
    location?: GeoJSON;
    locality?: string;
    subLocality?: string;
    administrativeArea?: string;
    countryCode?: string;
    timezone?: string;

    units: VenueUnit[] = [];
    transitLines: TransitLine[] = [];

    features: VenueFeatures = new VenueFeatures();
    access: VenueAccess = new VenueAccess();
    capabilities: VenueCapabilities = new VenueCapabilities();

    amenities: string[] = [];

    createdAt?: Date;
    updatedAt?: Date;

    static override decode<Venue>(data: { [key: string]: any }): Venue {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            if (data['owner_id']) {
                object['ownerId'] = data['owner_id'];
            }
            if (data['name']) {
                object['name'] = data['name'];
            }
            if (data['description']) {
                object['description'] = data['description'];
            }

            object['availability'] = data['availability']
                ? Availability.decode(data['availability']) : new Availability();

            object['sports'] = data['sports'] ?? [];
            object['media'] = data['media'] ?? [];
            if (data['url']) {
                object['url'] = data['url'];
            }

            if (data['address']) {
                object['address'] = data['address'];
            }
            if (data['location']) {
                object['location'] = GeoJSON.decode(data['location']);
            }
            if (data['locality']) {
                object['locality'] = data['locality'];
            }
            if (data['sub_locality']) {
                object['subLocality'] = data['sub_locality'];
            }
            if (data['administrative_area']) {
                object['administrativeArea'] = data['administrative_area'];
            }
            if (data['country_code']) {
                object['countryCode'] = data['country_code'];
            }
            if (data['timezone']) {
                object['timezone'] = data['timezone'];
            }

            object['units'] = data['units']
                ? data['units'].map((u: any) => VenueUnit.decode(u)) : [];
            object['transitLines'] = data['transit_lines']
                ? data['transit_lines'].map((l: any) => TransitLine.decode(l)) : [];

            object['features'] = data['features']
                ? VenueFeatures.decode(data['features']) : new VenueFeatures();
            object['access'] = data['access']
                ? VenueAccess.decode(data['access']) : new VenueAccess();
            object['capabilities'] = data['capabilities']
                ? VenueCapabilities.decode(data['capabilities']) : new VenueCapabilities();

            object['amenities'] = data['amenities'] ?? [];

            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
            if (data['updated_at']) {
                object['updatedAt'] = new Date(data['updated_at']);
            }
        }

        Object.setPrototypeOf(object, Venue.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id) data['id'] = this.id;
        if (this.ownerId) data['owner_id'] = this.ownerId;
        if (this.name) data['name'] = this.name;
        if (this.description) data['description'] = this.description;

        data['availability'] = this.availability.encode();

        data['sports'] = this.sports;
        data['media'] = this.media;
        if (this.url) data['url'] = this.url;

        if (this.address) data['address'] = this.address;
        if (this.location) data['location'] = this.location.encode();
        if (this.locality) data['locality'] = this.locality;
        if (this.subLocality) data['sub_locality'] = this.subLocality;
        if (this.administrativeArea) data['administrative_area'] = this.administrativeArea;
        if (this.countryCode) data['country_code'] = this.countryCode;
        if (this.timezone) data['timezone'] = this.timezone;

        data['units'] = this.units.map((u) => u.encode());
        data['transit_lines'] = this.transitLines.map((l) => l.encode());

        data['features'] = this.features.encode();
        data['access'] = this.access.encode();
        data['capabilities'] = this.capabilities.encode();

        data['amenities'] = this.amenities;

        if (this.createdAt) data['created_at'] = this.createdAt.toISOString();
        if (this.updatedAt) data['updated_at'] = this.updatedAt.toISOString();

        return data;
    }
}

/**
 * Data access object for partial Venue writes (PATCH-style updates).
 *
 * Every field is optional so callers can send only fields they intend to
 * change; missing fields are left untouched server-side. `units` and
 * `transitLines` here hold ID references (not embedded documents) — DAO
 * writes only touch the reference list, not the underlying unit/line docs.
 */
class VenueDao extends Codable<VenueDao> {
    id?: string;
    ownerId?: string;
    name?: string;
    description?: string;

    availability?: Availability;

    sports?: string[];
    media?: string[];
    url?: string;

    address?: string;
    location?: GeoJSON;
    locality?: string;
    subLocality?: string;
    administrativeArea?: string;
    countryCode?: string;
    timezone?: string;

    /** ID-only references — full unit/line documents live in their own collections. */
    units?: string[];
    transitLines?: string[];

    features?: VenueFeatures;
    access?: VenueAccess;
    capabilities?: VenueCapabilities;

    amenities?: string[];

    createdAt?: Date;
    updatedAt?: Date;

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id !== undefined) data['id'] = this.id;
        if (this.ownerId !== undefined) data['owner_id'] = this.ownerId;
        if (this.name !== undefined) data['name'] = this.name;
        if (this.description !== undefined) data['description'] = this.description;

        if (this.availability !== undefined) data['availability'] = this.availability.encode();

        if (this.sports !== undefined) data['sports'] = this.sports;
        if (this.media !== undefined) data['media'] = this.media;
        if (this.url !== undefined) data['url'] = this.url;

        if (this.address !== undefined) data['address'] = this.address;
        if (this.location !== undefined) data['location'] = this.location.encode();
        if (this.locality !== undefined) data['locality'] = this.locality;
        if (this.subLocality !== undefined) data['sub_locality'] = this.subLocality;
        if (this.administrativeArea !== undefined) data['administrative_area'] = this.administrativeArea;
        if (this.countryCode !== undefined) data['country_code'] = this.countryCode;
        if (this.timezone !== undefined) data['timezone'] = this.timezone;

        if (this.units !== undefined) data['units'] = this.units;
        if (this.transitLines !== undefined) data['transit_lines'] = this.transitLines;

        if (this.features !== undefined) data['features'] = this.features.encode();
        if (this.access !== undefined) data['access'] = this.access.encode();
        if (this.capabilities !== undefined) data['capabilities'] = this.capabilities.encode();

        if (this.amenities !== undefined) data['amenities'] = this.amenities;

        if (this.createdAt !== undefined) data['created_at'] = this.createdAt.toISOString();
        if (this.updatedAt !== undefined) data['updated_at'] = this.updatedAt.toISOString();

        return data;
    }
}

/**
 * A booking of a specific VenueUnit for a time range.
 *
 * Payment flows through Stripe — `transactionId` is the Stripe payment id.
 * A reservation is created in `pending` state with `expiresAt` set; a TTL
 * index on `expires_at` cleans up abandoned bookings server-side. On
 * successful payment the webhook flips status to `confirmed` and clears
 * `expiresAt`. `clubId` / `organizationId` are populated when the booking
 * is on behalf of a group rather than an individual.
 */
class VenueReservation extends Codable<VenueReservation> {
    id?: string;
    venueId: string = '';
    venueUnitId: string = '';

    transactionId: string = '';

    userId: string = '';
    clubId?: string;
    organizationId?: string;

    startDate?: Date;
    endDate?: Date;
    timezone: string = '';

    currency: string = '';
    amountPaidMinor: number = 0;

    status: RESERVATION_STATUS = RESERVATION_STATUS.PENDING;
    expiresAt?: Date;

    createdBy: string = '';
    createdAt?: Date;
    updatedAt?: Date;

    static override decode<VenueReservation>(data: { [key: string]: any }): VenueReservation {
        const object = Object();

        if (data) {
            if (data['id']) {
                object['id'] = data['id'];
            }
            object['venueId'] = data['venue_id'] ?? '';
            object['venueUnitId'] = data['venue_unit_id'] ?? '';
            object['transactionId'] = data['transaction_id'] ?? '';

            object['userId'] = data['user_id'] ?? '';
            if (data['club_id']) {
                object['clubId'] = data['club_id'];
            }
            if (data['organization_id']) {
                object['organizationId'] = data['organization_id'];
            }

            if (data['start_date']) {
                object['startDate'] = new Date(data['start_date']);
            }
            if (data['end_date']) {
                object['endDate'] = new Date(data['end_date']);
            }
            object['timezone'] = data['timezone'] ?? '';

            object['currency'] = data['currency'] ?? '';
            object['amountPaidMinor'] = data['amount_paid_minor'] ?? 0;

            object['status'] = (data['status'] as RESERVATION_STATUS) ?? RESERVATION_STATUS.PENDING;
            if (data['expires_at']) {
                object['expiresAt'] = new Date(data['expires_at']);
            }

            object['createdBy'] = data['created_by'] ?? '';
            if (data['created_at']) {
                object['createdAt'] = new Date(data['created_at']);
            }
            if (data['updated_at']) {
                object['updatedAt'] = new Date(data['updated_at']);
            }
        }

        Object.setPrototypeOf(object, VenueReservation.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {
            'venue_id': this.venueId,
            'venue_unit_id': this.venueUnitId,
            'transaction_id': this.transactionId,
            'user_id': this.userId,
            'timezone': this.timezone,
            'currency': this.currency,
            'amount_paid_minor': this.amountPaidMinor,
            'status': this.status.valueOf(),
            'created_by': this.createdBy,
        };

        if (this.id) data['id'] = this.id;
        if (this.clubId) data['club_id'] = this.clubId;
        if (this.organizationId) data['organization_id'] = this.organizationId;
        if (this.startDate) data['start_date'] = this.startDate.toISOString();
        if (this.endDate) data['end_date'] = this.endDate.toISOString();
        if (this.expiresAt) data['expires_at'] = this.expiresAt.toISOString();
        if (this.createdAt) data['created_at'] = this.createdAt.toISOString();
        if (this.updatedAt) data['updated_at'] = this.updatedAt.toISOString();

        return data;
    }
}

/**
 * Top-level DAO for the venue creation endpoint.
 * Bundles the Venue write with its initial set of Units in a single payload.
 */
class VenueCreationRequest extends Codable<VenueCreationRequest> {
    venue: VenueDao;
    units: VenueUnit[];

    constructor(venue: VenueDao, units: VenueUnit[] = []) {
        super();
        this.venue = venue;
        this.units = units;
    }

    override encode(): { [key: string]: any } {
        return {
            'venue': this.venue.encode(),
            'units': this.units.map((u) => u.encode()),
        };
    }
}

class VenuesResponse extends Codable<VenuesResponse> {
    venues: Venue[] = [];
    totalVenues: number = 0;

    static override decode<VenuesResponse>(data: { [key: string]: any }): VenuesResponse {
        const object = Object();

        if (data) {
            object['venues'] = data['venues']
                ? data['venues'].map((v: any) => Venue.decode(v)) : [];
            object['totalVenues'] = data['total_venues'] ?? 0;
        }

        Object.setPrototypeOf(object, VenuesResponse.prototype);
        return object;
    }
}

export {
    Venue,
    VenueDao,
    VenueFeatures,
    VenueAccess,
    VenueCapabilities,

    Availability,
    SeasonalHours,
    TimeSlot,
    BlackoutTimeSlot,
    SpecialTimeSlot,

    VenueUnit,
    VenueUnitRate,

    TransitLine,

    VenueReservation,
    VenueCreationRequest,

    VenuesResponse,
};
