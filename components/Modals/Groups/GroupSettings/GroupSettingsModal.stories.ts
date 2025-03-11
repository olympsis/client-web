import { GROUP_TYPE } from "@/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import { sampleClubs } from "@/data/dev-data/sample-clubs";
import GroupSettingsModal from "./GroupSettingsModal.vue";

const meta: Meta<typeof GroupSettingsModal> = {
    component: GroupSettingsModal
};
  
export default meta;
type Story = StoryObj<typeof GroupSettingsModal>;

export const Basic: Story = {
    name: "Group Leave Dialog",
    args: {
        group: sampleClubs[0]
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { GroupSettingsModal },
        template: '<GroupSettingsModal :group="group"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};