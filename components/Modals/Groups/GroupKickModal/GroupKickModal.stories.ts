import { Member } from "~/data/models/GenericModels";
import GroupKickModal from "./GroupKickModal.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { userSnippets } from "~/data/dev-data/sample-users";
import { GROUP_ROLE } from "~/data/Enums";

const meta: Meta<typeof GroupKickModal> = {
    component: GroupKickModal
};
  
export default meta;
type Story = StoryObj<typeof GroupKickModal>;
const member = new Member('', GROUP_ROLE.OWNER, userSnippets.alex, 0);

export const Basic: Story = {
    name: "Group Kick Modal",
    args: {
        member: member
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { GroupKickModal },
        template: '<GroupKickModal :member="member"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};