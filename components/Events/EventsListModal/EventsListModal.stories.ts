import EventsListModal from "./EventsListModal.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { Event } from "../../../data/models/EventModels";
import { Organizer } from "../../../data/models/GenericModels";
import { VenueDescriptor } from "../../../data/models/GenericModels";

const meta: Meta<typeof EventsListModal> = {
  component: EventsListModal,
};

export default meta;
type Story = StoryObj<typeof EventsListModal>;

const organizer = Organizer.decode({
    type: "club",
    id: "",
});

const events: Event[] = [
    Event.decode({
        "id": "event-id",
        "type": "event",
        "poster": {
            uuid: "",
            username: "",
            avatar: "",
        },
        organizer,
        "field": VenueDescriptor.decode({
            type: "internal",
            id: "string",
            name: "Richard Building Fields",
            location: {
            type: "Point",
            coordinates: [],
            },
        }),
        "image_url": "event-images/soccer-1.jpg",
        "start_time": Math.floor(Date.now() / 1000),
        "title": "Sunday Pick Up",
        "description": "Lets play this sunday!!",
        "sport": "soccer"
    }),

    Event.decode({
        "id": "event-id-1",
        "type": "event",
        "poster": {
          uuid: "user-uuid-1",
          username: "jane_doe",
          avatar: "avatars/jane_doe.jpg",
        },
        organizer,
        "field": VenueDescriptor.decode({
          type: "internal",
          id: "field-id-1",
          name: "Downtown Soccer Field",
          location: {
            type: "Point",
            coordinates: [40.7128, -74.0060], // Coordinates for New York City
          },
        }),
        "image_url": "event-images/soccer-2.jpg",
        "start_time": Math.floor(Date.now() / 1000) + 86400, // 1 day from now
        "title": "Midweek Soccer Match",
        "description": "Join us for a fun soccer game this Wednesday evening!",
        "sport": "soccer",
      }),
      
      Event.decode({
        "id": "event-id-2",
        "type": "event",
        "poster": {
          uuid: "user-uuid-2",
          username: "michael_smith",
          avatar: "avatars/michael_smith.jpg",
        },
        organizer,
        "field": VenueDescriptor.decode({
          type: "internal",
          id: "field-id-2",
          name: "Lakeside Basketball Court",
          location: {
            type: "Point",
            coordinates: [34.0522, -118.2437], // Coordinates for Los Angeles
          },
        }),
        "image_url": "event-images/basketball-1.jpg",
        "start_time": Math.floor(Date.now() / 1000) + 172800, // 2 days from now
        "title": "Saturday Basketball Game",
        "description": "Looking for players for a competitive game this weekend.",
        "sport": "basketball",
      }),

      Event.decode({
        "id": "event-id-3",
        "type": "event",
        "poster": {
          uuid: "user-uuid-3",
          username: "emily_johnson",
          avatar: "avatars/emily_johnson.jpg",
        },
        organizer,
        "field": VenueDescriptor.decode({
          type: "internal",
          id: "field-id-3",
          name: "Beachside Volleyball Court",
          location: {
            type: "Point",
            coordinates: [36.1699, -115.1398], // Coordinates for Las Vegas
          },
        }),
        "image_url": "event-images/volleyball-1.jpg",
        "start_time": Math.floor(Date.now() / 1000) + 259200, // 3 days from now
        "title": "Sunday Volleyball Fun",
        "description": "Join us for a casual volleyball game by the beach.",
        "sport": "volleyball",
      })
]

export const Basic: Story = {
  name: "Events List Modal",
  args: {
    events: events
  },
  render: (args) => ({
    setup() {
        return {
          ...args,
        };
    },
    components: { EventsListModal },
    template: '<EventsListModal :events="events"/>',
  }),
  tags: ["autodocs"],
  decorators: [],
};
