import EventTypePicker from "./EventTypePicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventTypePicker> = {
    component: EventTypePicker
};
  
export default meta;
type Story = StoryObj<typeof EventTypePicker>;

export const Basic: Story = {
name: "Event Type Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventTypePicker },
    template: '<EventTypePicker />',
}),
tags: ["autodocs"],
decorators: [],
};