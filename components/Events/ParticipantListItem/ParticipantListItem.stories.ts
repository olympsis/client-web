import ParticipantListItem from "./ParticipantListItem.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof ParticipantListItem> = {
    component: ParticipantListItem
};
  
export default meta;
type Story = StoryObj<typeof ParticipantListItem>;

export const Basic: Story = {
name: "Next Event Card",
args: {
    participant: sampleEvents[0].participants[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { ParticipantListItem },
    template: '<ParticipantListItem :participant="participant"/>',
}),
tags: ["autodocs"],
decorators: [],
};