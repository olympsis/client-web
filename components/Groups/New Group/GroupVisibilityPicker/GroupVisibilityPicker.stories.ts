import GroupVisibilityPicker from "./GroupVisibilityPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupVisibilityPicker> = {
    component: GroupVisibilityPicker
};
  
export default meta;
type Story = StoryObj<typeof GroupVisibilityPicker>;

export const Basic: Story = {
name: "Group Visibility Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupVisibilityPicker },
    template: '<GroupVisibilityPicker />',
}),
tags: ["autodocs"],
decorators: [],
};