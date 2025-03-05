import EventOrganizers from "./EventOrganizers.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import { sampleOrgs } from "~/data/dev-data/sample-orgs";
import { sampleClubs } from "~/data/dev-data/sample-clubs";
import { sampleEvents } from "~/data/dev-data/sample-events";

const meta: Meta<typeof EventOrganizers> = {
    component: EventOrganizers
};
  
export default meta;
type Story = StoryObj<typeof EventOrganizers>;

export const Basic: Story = {
name: "Event Body",
args: {
    event: sampleEvents[0],
    clubs: sampleClubs,
    organizations: sampleOrgs
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventOrganizers },
    template: '<EventOrganizers :event="event" :clubs="clubs" :organizations="organizations" />',
}),
tags: ["autodocs"],
decorators: [],
};