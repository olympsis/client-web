import type { Meta, StoryObj } from "@storybook/vue3";
import GroupMembersPeek from "./GroupMembersPeek.vue";

const meta: Meta<typeof GroupMembersPeek> = {
    component: GroupMembersPeek
};
  
export default meta;
type Story = StoryObj<typeof GroupMembersPeek>;

export const Basic: Story = {
name: "Group Members Peek",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupMembersPeek },
    template: '<GroupMembersPeek :members="[]"/>',
}),
tags: ["autodocs"],
decorators: [],
};