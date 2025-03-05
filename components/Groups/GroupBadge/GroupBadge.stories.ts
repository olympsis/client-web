import GroupBadge from "./GroupBadge.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import { sampleOrgs } from "~/data/dev-data/sample-orgs";
import { sampleClubs } from "~/data/dev-data/sample-clubs";
import { sampleEvents } from "~/data/dev-data/sample-events";
import { GROUP_TYPE, groupTypeToNumber } from "~/data/Enums";

const meta: Meta<typeof GroupBadge> = {
    component: GroupBadge
};
  
export default meta;
type Story = StoryObj<typeof GroupBadge>;

export const Basic: Story = {
name: "Group Badge",
args: {
    type: groupTypeToNumber(GROUP_TYPE.CLUB),
    imageURL: "club-images/e811b923-26e5-4971-8e92-d3d168bdb03a.jpeg",
    size: 2
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupBadge },
    template: '<GroupBadge :type="type" :imageURL="imageURL" :size="size"/>',
}),
tags: ["autodocs"],
decorators: [],
};