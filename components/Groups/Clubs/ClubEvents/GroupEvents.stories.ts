import GroupEvents from "./GroupEvents.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleClubs } from "~/data/dev-data/sample-clubs";

const meta: Meta<typeof GroupEvents> = {
    component: GroupEvents
};
  
export default meta;
type Story = StoryObj<typeof GroupEvents>;

export const Basic: Story = {
name: "Group Feed",
args: {
    group: sampleClubs[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupEvents },
    template: '<GroupEvents :group="group"/>',
}),
tags: ["autodocs"],
decorators: [],
};