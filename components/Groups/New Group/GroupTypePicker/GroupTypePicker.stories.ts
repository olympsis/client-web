import GroupTypePicker from "./GroupTypePicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupTypePicker> = {
    component: GroupTypePicker
};
  
export default meta;
type Story = StoryObj<typeof GroupTypePicker>;

export const Basic: Story = {
name: "Group Type Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupTypePicker },
    template: '<GroupTypePicker />',
}),
tags: ["autodocs"],
decorators: [],
};