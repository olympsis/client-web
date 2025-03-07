import { sampleClubs } from "~/data/dev-data/sample-clubs";
import GroupSmallSection from "./GroupSmallSection.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof GroupSmallSection> = {
    component: GroupSmallSection
};
  
export default meta;
type Story = StoryObj<typeof GroupSmallSection>;

export const Basic: Story = {
name: "Group Small Section",
args: {
    group: sampleClubs[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupSmallSection },
    template: '<GroupSmallSection :group="group"/>',
}),
tags: ["autodocs"],
decorators: [],
};