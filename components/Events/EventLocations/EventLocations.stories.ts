import EventLocations from "./EventLocations.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";
import { sampleVenues } from "~/data/dev-data/sample-venues";

const meta: Meta<typeof EventLocations> = {
    component: EventLocations
};
  
export default meta;
type Story = StoryObj<typeof EventLocations>;

export const Basic: Story = {
    name: "Event Locations",
    args: {
        event: sampleEvents[0],
        venues: sampleVenues,
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventLocations },
        template: '<EventLocations :event="event" :venues="venues" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};