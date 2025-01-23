import { Event } from "~/data/models/EventModels";
import { Venue } from "~/data/models/VenueModels";
import { VenueDescriptor, Organizer } from "~/data/models/GenericModels";

import EventListItem from "./EventListItem.vue";

import '~/assets/css/main.css';

export default {
  component: EventListItem,
  title: "Event List Item",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

const venue = Venue.decode({
  id: "field-123",
  name: "Central Park Soccer Field",
  owner: {
    name: "City of New York",
    type: "Government",
  },
  description:
    "A large soccer field located in the heart of Central Park, New York City",
  sports: ["Soccer"],
  images: [
    "field-images/189bddfa-4456-43c3-8ee3-0107870aabb6.jpg",
    "field-images/506285fb-dd6f-4ae2-b3f5-c898b6cdf305.jpg",
  ],
  location: {
    type: "Point",
    coordinates: [40.783499, -111.862922],
  },
  city: "New York",
  state: "NY",
  country: "USA",
});

const organizer = Organizer.decode({
  type: "club",
  id: "",
});


const event = Event.decode({
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
  "sport": "soccer",
});

export const Default = {
  args: {
    event: event,
  },
};
