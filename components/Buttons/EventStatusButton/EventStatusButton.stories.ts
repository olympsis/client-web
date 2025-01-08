import { VIEW_STATE } from "~/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import EventStatusButton from "./EventStatusButton.vue";
import { sampleEvents } from "~/data/dev-data/sample-events";

import '@assets/main.css';

const meta: Meta<typeof EventStatusButton> = {
    component: EventStatusButton
};
  
export default meta;
type Story = StoryObj<typeof EventStatusButton>;

export const Basic: Story = {
    name: "Event Status Button",
    args: {
        event: sampleEvents[0],
        modelValue: VIEW_STATE.PENDING
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventStatusButton },
        template: '<EventStatusButton :event="event" :model-value="modelValue"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};