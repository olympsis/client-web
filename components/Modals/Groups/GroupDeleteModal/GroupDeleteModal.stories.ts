import { GROUP_TYPE } from "@/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import { GroupSelection } from "@/data/models/GenericModels";
import { sampleOrgs } from "@/data/dev-data/sample-orgs";

import GroupDeleteModal from "./GroupDeleteModal.vue";

const meta: Meta<typeof GroupDeleteModal> = {
    component: GroupDeleteModal
};
  
export default meta;
type Story = StoryObj<typeof GroupDeleteModal>;

export const Basic: Story = {
    name: "Group Delete Dialog",
    args: {
        group: new GroupSelection(GROUP_TYPE.ORGANIZATION, undefined, sampleOrgs[0])
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { GroupDeleteModal },
        template: '<GroupDeleteModal :group="group"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};