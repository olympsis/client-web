import SmallEventListItem from "./SmallEventListItem.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof SmallEventListItem> = {
    component: SmallEventListItem
};
  
export default meta;
type Story = StoryObj<typeof SmallEventListItem>;

export const Basic: Story = {
    name: "Small Event List Item",
    args: {
        event: sampleEvents[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { SmallEventListItem },
        template: '<SmallEventListItem :event="event"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};