import { GROUP_TYPE } from "@/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import { clubSamples } from "@/data/dev-data/sample-clubs";
import { GroupSelection } from "@/data/models/GenericModels";

import GroupLeaveModal from "./GroupLeaveModal.vue";

const meta: Meta<typeof GroupLeaveModal> = {
    component: GroupLeaveModal
};
  
export default meta;
type Story = StoryObj<typeof GroupLeaveModal>;

export const Basic: Story = {
    name: "Group Leave Dialog",
    args: {
        group: new GroupSelection(GROUP_TYPE.CLUB, clubSamples[0], undefined)
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { GroupLeaveModal },
        template: '<GroupLeaveModal :group="group"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};