import NewPostView from "./NewPostView.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof NewPostView> = {
    component: NewPostView
};
  
export default meta;
type Story = StoryObj<typeof NewPostView>;

export const Basic: Story = {
name: "New Post View",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { NewPostView },
    template: '<NewPostView />',
}),
tags: ["autodocs"],
decorators: [],
};