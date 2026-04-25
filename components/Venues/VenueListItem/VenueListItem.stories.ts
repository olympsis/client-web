import VenueListItem from "./VenueListItem.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { Venue } from "@/data/models/VenueModels";

const meta: Meta<typeof VenueListItem> = {
  component: VenueListItem,
};

export default meta;
type Story = StoryObj<typeof VenueListItem>;

export const Basic: Story = {
  name: "VenueListItem",
  args: {
    venue: Venue.decode({
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
    })
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { VenueListItem },
    template: '<VenueListItem :venue="venue"/>',
  }),
  decorators: [],
  tags: ["autodocs"]
};
