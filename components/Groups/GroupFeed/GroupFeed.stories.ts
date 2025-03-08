import { sampleClubs } from "~/data/dev-data/sample-clubs";
import GroupFeed from "./GroupFeed.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupFeed> = {
    component: GroupFeed
};
  
export default meta;
type Story = StoryObj<typeof GroupFeed>;

export const Basic: Story = {
name: "Group Feed",
args: {
    club: sampleClubs[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupFeed },
    template: '<GroupFeed :club="club"/>',
}),
tags: ["autodocs"],
decorators: [],
};