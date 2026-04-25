import { VIEW_STATE } from "~/data/Enums";
import { Venue } from "~/data/models/VenueModels";

import FieldListPeek from "./VenueListPeek.vue";

export default {
  component: FieldListPeek,
  title: "Field List Peek",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

const data = {
  id: "field-123",
  owner_id: "org_nyc_parks",
  name: "Central Park Soccer Field",
  description:
    "A large soccer field located in the heart of Central Park, New York City",
  sports: ["Soccer"],
  media: [
    "field-images/189bddfa-4456-43c3-8ee3-0107870aabb6.jpg",
    "field-images/506285fb-dd6f-4ae2-b3f5-c898b6cdf305.jpg",
  ],
  location: {
    type: "Point",
    coordinates: [40.783499, -111.862922],
  },
  locality: "New York",
  administrative_area: "NY",
  country_code: "US",
};

export const Default = {
  args: {
    fields: [Venue.decode(data)],
    state: VIEW_STATE.LOADING,
  },
};
