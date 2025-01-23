import type { Meta, StoryObj } from "@storybook/vue3";
import EventRecurrenceSettings from "./EventRecurrenceSettings.vue";

const meta: Meta<typeof EventRecurrenceSettings> = {
    component: EventRecurrenceSettings
};
  
export default meta;
type Story = StoryObj<typeof EventRecurrenceSettings>;

export const Basic: Story = {
name: "Event Recurrence Settings",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventRecurrenceSettings },
    template: '<EventRecurrenceSettings />',
}),
tags: ["autodocs"],
decorators: [],
};