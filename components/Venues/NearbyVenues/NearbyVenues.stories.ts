import NearbyVenues from "./NearbyVenues.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { DEV_VENUES } from "~/data/dev-data/test-data";

const meta: Meta<typeof NearbyVenues> = {
    component: NearbyVenues
};
  
export default meta;
type Story = StoryObj<typeof NearbyVenues>;

export const Basic: Story = {
    name: "Nearby Venues",
    args: {
        venues: DEV_VENUES
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { NearbyVenues },
        template: '<NearbyVenues :venues="venues"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};