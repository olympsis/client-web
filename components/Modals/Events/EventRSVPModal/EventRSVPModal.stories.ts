
import EventRSVPModal from "./EventRSVPModal.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "@/data/dev-data/sample-events";

const meta: Meta<typeof EventRSVPModal> = {
    component: EventRSVPModal
};
  
export default meta;
type Story = StoryObj<typeof EventRSVPModal>;

export const Basic: Story = {
    name: "Event RSVP Modal",
    args: {
        event: sampleEvents[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventRSVPModal },
        template: '<EventRSVPModal :event="event"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};