
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "@/data/dev-data/sample-events";
import EventDetailSettingsModal from "./EventDetailSettingsModal.vue";

const meta: Meta<typeof EventDetailSettingsModal> = {
    component: EventDetailSettingsModal
};
  
export default meta;
type Story = StoryObj<typeof EventDetailSettingsModal>;

export const Basic: Story = {
    name: "Event Detail Settings Modal",
    args: {
        event: sampleEvents[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventDetailSettingsModal },
        template: '<EventDetailSettingsModal :event="event"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};