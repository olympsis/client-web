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
    isPrimary: false,
    isDestructive: true
},
render: (args: any) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { BlockImageButton },
    template: '<BlockImageButton :text="text" :icon="icon" :isPrimary="isPrimary" :isDestructive="isDestructive"/>',
}),
tags: ["autodocs"],
decorators: [],
};