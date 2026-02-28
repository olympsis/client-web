import EventVenuesPicker from "./EventVenuesPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import { VenueDescriptor } from "~/data/models/GenericModels";

const meta: Meta<typeof EventVenuesPicker> = {
    component: EventVenuesPicker
};

export default meta;
type Story = StoryObj<typeof EventVenuesPicker>;

const sampleVenue = new VenueDescriptor(
    "external",
    "ven_001",
    "Central Park North",
    "New York",
    "NY",
    "USA",
    40.785091,
    -73.968285
);

/** Empty state — no venues selected */
export const Empty: Story = {
    name: "Empty",
    args: {
        modelValue: []
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventVenuesPicker },
        template: '<EventVenuesPicker />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

/** With a venue selected */
export const WithVenue: Story = {
    name: "With Venue",
    args: {
        modelValue: [sampleVenue]
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventVenuesPicker },
        template: '<EventVenuesPicker :model-value="modelValue" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};
