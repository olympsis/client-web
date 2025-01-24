import type { Meta, StoryObj } from "@storybook/vue3";
import { Comment } from "~/data/models/GenericModels";
import { samplePosts } from "~/data/dev-data/sample-posts";
import PostCommentListItem from "./PostCommentListItem.vue";

const meta: Meta<typeof PostCommentListItem> = {
    component: PostCommentListItem
};
  
export default meta;
type Story = StoryObj<typeof PostCommentListItem>;

export const Basic: Story = {
name: "Post Comment List Item",
args: {
    comment: samplePosts[0].comments[0]
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { PostCommentListItem },
    template: '<PostCommentListItem :comment="comment"/>',
}),
tags: ["autodocs"],
decorators: [],
};