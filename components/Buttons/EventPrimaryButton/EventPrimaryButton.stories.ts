import { VIEW_STATE } from "@/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import EventPrimaryButton from "./EventPrimaryButton.vue";
import { sampleEvents } from "@/data/dev-data/sample-events";

import '@assets/main.css';

const meta: Meta<typeof EventPrimaryButton> = {
    component: EventPrimaryButton
};
  
export default meta;
type Story = StoryObj<typeof EventPrimaryButton>;

export const Basic: Story = {
    name: "Event Primary Button",
    args: {
        event: sampleEvents[0],
        state: VIEW_STATE.LOADING
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { EventPrimaryButton },
        template: '<EventPrimaryButton :event="event" :model-value="modelValue"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};