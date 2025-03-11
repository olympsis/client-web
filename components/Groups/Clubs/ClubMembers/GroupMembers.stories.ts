import { sampleClubs } from "~/data/dev-data/sample-clubs";
import GroupMembers from "./GroupMembers.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupMembers> = {
    component: GroupMembers
};
  
export default meta;
type Story = StoryObj<typeof GroupMembers>;

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
    components: { GroupMembers },
    template: '<GroupMembers :group="group"/>',
}),
tags: ["autodocs"],
decorators: [],
};