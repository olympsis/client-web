import EventMedia from "./EventMedia.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventMedia> = {
    component: EventMedia
};
  
export default meta;
type Story = StoryObj<typeof EventMedia>;

export const Basic: Story = {
name: "Event Media",
args: {
    event: sampleEvents[0]
},
render: (args) => ({
    setup() {
        return {
            ...args,
        };
    },
    components: { EventMedia },
    template: '<EventMedia :event="event" />',
}),
tags: ["autodocs"],
decorators: [],
};