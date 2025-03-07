import EventsTab from "./EventsTab.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventsTab> = {
    component: EventsTab
};
  
export default meta;
type Story = StoryObj<typeof EventsTab>;

export const Basic: Story = {
    name: "Events Tab",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventsTab },
        template: '<EventsTab />',
    }),
    tags: ["autodocs"],
    decorators: [],
};