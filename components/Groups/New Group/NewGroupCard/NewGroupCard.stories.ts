import NewGroupCard from "./NewGroupCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof NewGroupCard> = {
    component: NewGroupCard
};
  
export default meta;
type Story = StoryObj<typeof NewGroupCard>;

export const Basic: Story = {
name: "New Group Card",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { NewGroupCard },
    template: '<NewGroupCard />',
}),
tags: ["autodocs"],
decorators: [],
};