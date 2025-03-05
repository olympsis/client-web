
import { EVENT_RSVP_STATUS } from '~/data/Enums';
import { Event } from '~/data/models/EventModels';
import { UserSnippet } from '~/data/models/UserModels';
import { VenueDescriptor, Participant } from '~/data/models/GenericModels';

// Helper to create timestamps relative to now
const now = new Date();
const today = new Date(now);
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);

// Sample users data
const sampleUsers: Array<UserSnippet | undefined> = [
    UserSnippet.decode({
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        username: "johndoe",
        name: "John Doe",
        avatar_url: "https://example.com/avatar1.jpg"
    }),
    UserSnippet.decode({
        uuid: "223e4567-e89b-12d3-a456-426614174001",
        username: "janedoe",
        name: "Jane Doe",
        avatar_url: "https://example.com/avatar2.jpg"
    }),
    UserSnippet.decode({
        uuid: "323e4567-e89b-12d3-a456-426614174002",
        username: "mikebrown",
        name: "Mike Brown",
        avatar_url: "https://example.com/avatar3.jpg"
    })
];

// Create sample participants
const createParticipants = () => [
    new Participant(sampleUsers[0], EVENT_RSVP_STATUS.YES, Math.floor(Date.now() / 1000) - 7200),
    new Participant(sampleUsers[1], EVENT_RSVP_STATUS.YES, Math.floor(Date.now() / 1000) - 3600),
    new Participant(sampleUsers[2], EVENT_RSVP_STATUS.MAYBE, Math.floor(Date.now() / 1000) - 1800)
];

// Sample venue data
const sampleVenue = new VenueDescriptor(
    "external",
    "ven_123456",
    "Downtown Sports Complex",
    "San Francisco",
    "CA",
    "USA",
    37.7749,
    -122.4194
);

// Create sample events
const sampleEvents: Event[] = [
    // Event happening today
    Event.decode({
        id: "evt_001",
        type: "pickup",
        poster: sampleUsers[0],
        organizers: [{
            type: 0,
            id: "club_001"
        }],
        venues: [sampleVenue],
        image_url: "event-images/basketball-0.jpg",
        title: "Pickup Basketball Game",
        body: "Casual pickup basketball game. All skill levels welcome!",
        sports: ["basketball"],
        level: 1,
        start_time: Math.floor(today.setHours(18, 30) / 1000), // Today at 6:30 PM
        stop_time: Math.floor(today.setHours(20, 0) / 1000),   // Today at 8:00 PM
        min_participants: 6,
        max_participants: 12,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 86400, // Created yesterday
    }),

    // Event happening tomorrow
    Event.decode({
        id: "evt_002",
        type: "tournament",
        poster: sampleUsers[1],
        organizers: [{
            type: "organization",
            id: "org_456"
        }],
        venues: [sampleVenue],
        image_url: "event-images/soccer-1.jpg",
        title: "5-a-side Soccer Tournament",
        body: "Competitive 5-a-side soccer tournament. Prizes for winners!",
        sports: ["soccer"],
        level: 2,
        start_time: Math.floor(tomorrow.setHours(10, 0) / 1000), // Tomorrow at 10:00 AM
        stop_time: Math.floor(tomorrow.setHours(16, 0) / 1000),  // Tomorrow at 4:00 PM
        min_participants: 20,
        max_participants: 40,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 172800, // Created 2 days ago
    }),

    // Event happening next week
    Event.decode({
        id: "evt_003",
        type: "pickup",
        poster: sampleUsers[2],
        organizers: [{
            type: "organization",
            id: "org_789"
        }],
        venues: [sampleVenue],
        image_url: "event-images/tennis-0.jpg",
        title: "Tennis Practice Session",
        body: "Open tennis practice session for intermediate players.",
        sports: ["tennis"],
        level: 2,
        start_time: Math.floor(nextWeek.setHours(9, 0) / 1000),  // Next week at 9:00 AM
        stop_time: Math.floor(nextWeek.setHours(11, 0) / 1000),  // Next week at 11:00 AM
        min_participants: 4,
        max_participants: 8,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 259200, // Created 3 days ago
    }),

    //DUPLICATES
    Event.decode({
        id: "evt_001",
        type: "pickup",
        poster: sampleUsers[0],
        organizers: [{
            type: "club",
            id: "club_123"
        }],
        venues: [sampleVenue],
        image_url: "event-images/basketball-1.jpg",
        title: "Pickup Basketball Game",
        body: "Casual pickup basketball game. All skill levels welcome!",
        sports: ["basketball"],
        level: 1,
        start_time: Math.floor(today.setHours(18, 30) / 1000), // Today at 6:30 PM
        stop_time: Math.floor(today.setHours(20, 0) / 1000),   // Today at 8:00 PM
        min_participants: 6,
        max_participants: 12,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 86400, // Created yesterday
    }),

    Event.decode({
        id: "evt_001",
        type: "pickup",
        poster: sampleUsers[0],
        organizers: [{
            type: "club",
            id: "club_123"
        }],
        venues: [sampleVenue],
        image_url: "event-images/basketball-2.jpg",
        title: "Pickup Basketball Game",
        body: "Casual pickup basketball game. All skill levels welcome!",
        sports: ["basketball"],
        level: 1,
        start_time: Math.floor(today.setHours(18, 30) / 1000), // Today at 6:30 PM
        stop_time: Math.floor(today.setHours(20, 0) / 1000),   // Today at 8:00 PM
        min_participants: 6,
        max_participants: 12,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 86400, // Created yesterday
    }),

    // Event happening tomorrow
    Event.decode({
        id: "evt_002",
        type: "tournament",
        poster: sampleUsers[1],
        organizers: [{
            type: "organization",
            id: "org_456"
        }],
        venues: [sampleVenue],
        image_url: "event-images/soccer-2.jpg",
        title: "5-a-side Soccer Tournament",
        body: "Competitive 5-a-side soccer tournament. Prizes for winners!",
        sports: ["soccer"],
        level: 2,
        start_time: Math.floor(tomorrow.setHours(10, 0) / 1000), // Tomorrow at 10:00 AM
        stop_time: Math.floor(tomorrow.setHours(16, 0) / 1000),  // Tomorrow at 4:00 PM
        min_participants: 20,
        max_participants: 40,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 172800, // Created 2 days ago
    }),

    // Event happening next week
    Event.decode({
        id: "evt_003",
        type: "pickup",
        poster: sampleUsers[2],
        organizers: [{
            type: "organization",
            id: "org_789"
        }],
        venues: [sampleVenue],
        image_url: "event-images/tennis-1.jpg",
        title: "Tennis Practice Session",
        body: "Open tennis practice session for intermediate players.",
        sports: ["tennis"],
        level: 2,
        start_time: Math.floor(nextWeek.setHours(9, 0) / 1000),  // Next week at 9:00 AM
        stop_time: Math.floor(nextWeek.setHours(11, 0) / 1000),  // Next week at 11:00 AM
        min_participants: 4,
        max_participants: 8,
        participants: createParticipants(),
        visibility: "public",
        created_at: Math.floor(Date.now() / 1000) - 259200, // Created 3 days ago
    })
];

export { sampleEvents };