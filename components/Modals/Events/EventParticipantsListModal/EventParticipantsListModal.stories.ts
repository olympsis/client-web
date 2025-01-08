
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "@/data/dev-data/sample-events";
import EventParticipantsListModal from "./EventParticipantsListModal.vue";

const meta: Meta<typeof EventParticipantsListModal> = {
    component: EventParticipantsListModal
};
  
export default meta;
type Story = StoryObj<typeof EventParticipantsListModal>;

export const Basic: Story = {
    name: "Event Participants List Modal",
    args: {
        event: sampleEvents[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventParticipantsListModal },
        template: '<EventParticipantsListModal :event="event"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};