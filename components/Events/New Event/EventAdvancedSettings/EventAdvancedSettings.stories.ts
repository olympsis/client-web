import type { Meta, StoryObj } from "@storybook/vue3";
import EventAdvancedSettings from "./EventAdvancedSettings.vue";

const meta: Meta<typeof EventAdvancedSettings> = {
    component: EventAdvancedSettings
};
  
export default meta;
type Story = StoryObj<typeof EventAdvancedSettings>;

export const Basic: Story = {
name: "Event Advanced Settings",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventAdvancedSettings },
    template: '<EventAdvancedSettings />',
}),
tags: ["autodocs"],
decorators: [],
};