import GroupNextEvent from "./GroupNextEvent.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupNextEvent> = {
    component: GroupNextEvent
};
  
export default meta;
type Story = StoryObj<typeof GroupNextEvent>;

export const Basic: Story = {
name: "Group Next Event",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupNextEvent },
    template: '<GroupNextEvent/>',
}),
tags: ["autodocs"],
decorators: [],
};