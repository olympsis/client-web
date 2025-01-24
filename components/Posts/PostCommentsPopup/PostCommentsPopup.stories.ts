import type { Meta, StoryObj } from "@storybook/vue3";
import PostCommentsPopup from "./PostCommentsPopup.vue";
import { samplePosts } from "~/data/dev-data/sample-posts";

const meta: Meta<typeof PostCommentsPopup> = {
    component: PostCommentsPopup
};
  
export default meta;
type Story = StoryObj<typeof PostCommentsPopup>;

export const Basic: Story = {
name: "Post Comments Popup",
args: {
    post: samplePosts[0]
},
render: (args) => ({
    setup() {
        return {
            ...args,
        };
    },
    components: { PostCommentsPopup },
    template: '<PostCommentsPopup :post="post"/>',
}),
tags: ["autodocs"],
decorators: [],
};