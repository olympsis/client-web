import EventBody from "./EventBody.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventBody> = {
    component: EventBody
};
  
export default meta;
type Story = StoryObj<typeof EventBody>;

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
    components: { EventBody },
    template: '<EventBody v-model:event="event"/>',
}),
tags: ["autodocs"],
decorators: [],
};