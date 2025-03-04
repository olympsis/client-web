import EventsSection from "./EventsSection.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventsSection> = {
    component: EventsSection
};
  
export default meta;
type Story = StoryObj<typeof EventsSection>;

export const Basic: Story = {
    name: "Events Section",
    args: {
        events: sampleEvents
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventsSection },
        template: '<EventsSection :events="events"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};