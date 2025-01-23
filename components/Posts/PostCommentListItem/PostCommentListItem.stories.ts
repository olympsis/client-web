import type { Meta, StoryObj } from "@storybook/vue3";
import PostCommentListItem from "./PostCommentListItem.vue";

const meta: Meta<typeof PostCommentListItem> = {
    component: PostCommentListItem
};
  
export default meta;
type Story = StoryObj<typeof PostCommentListItem>;

export const Basic: Story = {
name: "Post Comment List Item",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { PostCommentListItem },
    template: '<PostCommentListItem />',
}),
tags: ["autodocs"],
decorators: [],
};