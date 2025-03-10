import GroupInfo from "./GroupInfo.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleOrgs } from "~/data/dev-data/sample-orgs";
import { sampleClubs } from "~/data/dev-data/sample-clubs";

const meta: Meta<typeof GroupInfo> = {
    component: GroupInfo
};
  
export default meta;
type Story = StoryObj<typeof GroupInfo>;

export const Basic: Story = {
name: "Group Info",
args: {
    group: sampleOrgs[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupInfo },
    template: '<GroupInfo :group="group"/>',
}),
tags: ["autodocs"],
decorators: [],
};