import EventSkillLevelPicker from "./EventSkillLevelPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventSkillLevelPicker> = {
    component: EventSkillLevelPicker
};
  
export default meta;
type Story = StoryObj<typeof EventSkillLevelPicker>;

export const Basic: Story = {
name: "Event Skill Level Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventSkillLevelPicker },
    template: '<EventSkillLevelPicker />',
}),
tags: ["autodocs"],
decorators: [],
};