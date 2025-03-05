import EventComments from "./EventComments.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventComments> = {
    component: EventComments
};
  
export default meta;
type Story = StoryObj<typeof EventComments>;

export const Basic: Story = {
name: "Event Body",
args: {
    event: sampleEvents[0],
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventComments },
    template: '<EventComments v-model:event="event"/>',
}),
tags: ["autodocs"],
decorators: [],
};