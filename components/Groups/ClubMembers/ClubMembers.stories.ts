import { sampleClubs } from "~/data/dev-data/sample-clubs";
import ClubMembers from "./ClubMembers.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ClubMembers> = {
    component: ClubMembers
};
  
export default meta;
type Story = StoryObj<typeof ClubMembers>;

export const Basic: Story = {
name: "Group Feed",
args: {
    club: sampleClubs[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { ClubMembers },
    template: '<ClubMembers :club="club"/>',
}),
tags: ["autodocs"],
decorators: [],
};