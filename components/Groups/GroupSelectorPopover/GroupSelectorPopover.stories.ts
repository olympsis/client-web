import type { Meta, StoryObj } from "@storybook/vue3";
import GroupSelectorPopover from "./GroupSelectorPopover.vue";

const meta: Meta<typeof GroupSelectorPopover> = {
    component: GroupSelectorPopover
};
  
export default meta;
type Story = StoryObj<typeof GroupSelectorPopover>;

export const Basic: Story = {
name: "Group Logo And Banner",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupSelectorPopover },
    template: '<GroupSelectorPopover/>',
}),
tags: ["autodocs"],
decorators: [],
};