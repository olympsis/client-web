import type { Meta, StoryObj } from "@storybook/vue3";
import PostCommentsPopup from "./PostCommentsPopup.vue";

const meta: Meta<typeof PostCommentsPopup> = {
    component: PostCommentsPopup
};
  
export default meta;
type Story = StoryObj<typeof PostCommentsPopup>;

export const Basic: Story = {
name: "Post Comments Popup",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { PostCommentsPopup },
    template: '<PostCommentsPopup />',
}),
tags: ["autodocs"],
decorators: [],
};