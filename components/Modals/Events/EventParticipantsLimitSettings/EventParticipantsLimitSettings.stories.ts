import type { Meta, StoryObj } from "@storybook/vue3";
import EventParticipantsLimitSettings from "./EventParticipantsLimitSettings.vue";

const meta: Meta<typeof EventParticipantsLimitSettings> = {
    component: EventParticipantsLimitSettings
};
  
export default meta;
type Story = StoryObj<typeof EventParticipantsLimitSettings>;

export const Basic: Story = {
name: "Event Participants Limit Settings",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventParticipantsLimitSettings },
    template: '<EventParticipantsLimitSettings />',
}),
tags: ["autodocs"],
decorators: [],
};