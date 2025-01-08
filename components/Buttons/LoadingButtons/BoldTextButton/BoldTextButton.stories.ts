import { VIEW_STATE } from "~/data/Enums";
import BoldTextButton from "./BoldTextButton.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof BoldTextButton> = {
    component: BoldTextButton
};
  
export default meta;
type Story = StoryObj<typeof BoldTextButton>;

export const Basic: Story = {
name: "Bold Text Button",
args: {
    text: "complete",
    modelValue: VIEW_STATE.PENDING
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { BoldTextButton },
    template: '<BoldTextButton :text="text"/>',
}),
tags: ["autodocs"],
decorators: [],
};