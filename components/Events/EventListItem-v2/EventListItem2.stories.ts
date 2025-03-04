import EventListItem2 from "./EventListItem2.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventListItem2> = {
    component: EventListItem2
};
  
export default meta;
type Story = StoryObj<typeof EventListItem2>;

export const Basic: Story = {
    name: "Event List Item",
    args: {
        event: sampleEvents[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventListItem2 },
        template: '<EventListItem2 :event="event"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};