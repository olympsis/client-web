import { sampleClubs } from "~/data/dev-data/sample-clubs";
import GroupsTab from "./GroupsTab.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupsTab> = {
    component: GroupsTab
};
  
export default meta;
type Story = StoryObj<typeof GroupsTab>;

export const Basic: Story = {
    name: "Groups Tab",
    args: {
        clubs: sampleClubs,
        organizations: []
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { GroupsTab },
        template: '<GroupsTab :clubs="clubs" :organizations="organizations"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};