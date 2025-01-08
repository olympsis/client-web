import EventOrganizersPicker from "./EventOrganizersPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventOrganizersPicker> = {
    component: EventOrganizersPicker
};
  
export default meta;
type Story = StoryObj<typeof EventOrganizersPicker>;

export const Basic: Story = {
name: "Event Organizers Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventOrganizersPicker },
    template: '<EventOrganizersPicker />',
}),
tags: ["autodocs"],
decorators: [],
};