import EventHeader from "./EventHeader.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";
import { sampleVenues } from "~/data/dev-data/sample-venues";

const meta: Meta<typeof EventHeader> = {
    component: EventHeader
};
  
export default meta;
type Story = StoryObj<typeof EventHeader>;

export const Basic: Story = {
name: "Event Header",
args: {
    event: sampleEvents[0],
    venues: [sampleVenues[0]]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventHeader },
    template: '<EventHeader :event="event" :venues="venues"/>',
}),
tags: ["autodocs"],
decorators: [],
};