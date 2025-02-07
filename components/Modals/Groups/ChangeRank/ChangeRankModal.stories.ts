import type { Meta, StoryObj } from "@storybook/vue3";
import ChangeRankModal from "./ChangeRankModal.vue";
import { Member } from "~/data/models/GenericModels";
import { GROUP_ROLE } from "~/data/Enums";
import { userSnippets } from "~/data/dev-data/sample-users";
import type { UserSnippet } from "~/data/models/UserModels";

const meta: Meta<typeof ChangeRankModal> = {
    component: ChangeRankModal
};
  
export default meta;
type Story = StoryObj<typeof ChangeRankModal>;
const member = new Member('', GROUP_ROLE.OWNER, userSnippets.alex, 0);
export const Basic: Story = {
    name: "Change Rank Modal",
    args: {
        member: member
    },
    render: (args) => ({
        setup() {
            return {
                ...args,
            };
        },
        components: { ChangeRankModal },
        template: '<ChangeRankModal :member="member"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};