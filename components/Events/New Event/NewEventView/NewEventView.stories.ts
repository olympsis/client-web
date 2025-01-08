import NewEventView from "./NewEventView.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof NewEventView> = {
    component: NewEventView
};
  
export default meta;
type Story = StoryObj<typeof NewEventView>;

export const Basic: Story = {
name: "New Event Card",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { NewEventView },
    template: '<NewEventView />',
}),
tags: ["autodocs"],
decorators: [],
};