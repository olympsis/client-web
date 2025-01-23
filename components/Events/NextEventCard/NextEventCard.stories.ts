import NextEventCard from "./NextEventCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof NextEventCard> = {
    component: NextEventCard
};
  
export default meta;
type Story = StoryObj<typeof NextEventCard>;

export const Basic: Story = {
name: "Next Event Card",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { NextEventCard },
    template: '<NextEventCard />',
}),
tags: ["autodocs"],
decorators: [],
};