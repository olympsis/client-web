import EventsSettings from "./EventsSettings.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventsSettings> = {
    component: EventsSettings
};
  
export default meta;
type Story = StoryObj<typeof EventsSettings>;

export const Basic: Story = {
    name: "Events Settings Modal",
    args: {
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventsSettings },
        template: '<EventsSettings />',
    }),
    tags: ["autodocs"],
    decorators: [],
};