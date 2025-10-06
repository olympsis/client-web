import { COMPETITION_FORMAT } from "~/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import EventFormats from "./EventFormats.vue";

const meta: Meta<typeof EventFormats> = {
    component: EventFormats
};
  
export default meta;
type Story = StoryObj<typeof EventFormats>;

export const Basic: Story = {
    name: "Event Formats",
    args: {
        formats: Object.values(COMPETITION_FORMAT) as Array<COMPETITION_FORMAT>
    },
    render: (args) => ({
        setup() {
            return {
                ...args,
            };
        },
        components: { EventFormats },
        template: '<EventFormats :formats="formats"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};