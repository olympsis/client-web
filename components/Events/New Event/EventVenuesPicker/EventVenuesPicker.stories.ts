import EventVenuesPicker from "./EventVenuesPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventVenuesPicker> = {
    component: EventVenuesPicker
};
  
export default meta;
type Story = StoryObj<typeof EventVenuesPicker>;

export const Basic: Story = {
name: "Event Venues Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventVenuesPicker },
    template: '<EventVenuesPicker />',
}),
tags: ["autodocs"],
decorators: [],
};