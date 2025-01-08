
import EventVisibilityPicker from "./EventVisibilityPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventVisibilityPicker> = {
    component: EventVisibilityPicker
};
  
export default meta;
type Story = StoryObj<typeof EventVisibilityPicker>;

export const Basic: Story = {
name: "Event Visibility Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventVisibilityPicker },
    template: '<EventVisibilityPicker />',
}),
tags: ["autodocs"],
decorators: [],
};