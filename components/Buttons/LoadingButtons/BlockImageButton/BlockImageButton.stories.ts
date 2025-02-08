import { VIEW_STATE } from "~/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";
import BlockImageButton from "./BlockImageButton.vue";

const meta: Meta<typeof BlockImageButton> = {
    component: BlockImageButton
};
  
export default meta;
type Story = StoryObj<typeof BlockImageButton>;

export const Basic: Story = {
name: "Block Image Button",
args: {
    text: "Directions",
    icon: "mail",
    modelValue: VIEW_STATE.PENDING,
    isPrimary: false,
    isDestructive: true
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { BlockImageButton },
    template: '<BlockImageButton :text="text" :icon="icon" :modelValue="modelValue" :isPrimary="isPrimary" :isDestructive="isDestructive"/>',
}),
tags: ["autodocs"],
decorators: [],
};