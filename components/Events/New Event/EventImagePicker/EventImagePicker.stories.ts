import EventImagePicker from "./EventImagePicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventImagePicker> = {
    component: EventImagePicker
};
  
export default meta;
type Story = StoryObj<typeof EventImagePicker>;

export const Basic: Story = {
name: "Event Image Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventImagePicker },
    template: '<EventImagePicker />',
}),
tags: ["autodocs"],
decorators: [],
};