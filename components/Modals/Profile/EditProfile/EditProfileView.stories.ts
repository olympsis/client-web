import EditProfileView from "./EditProfileView.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EditProfileView> = {
    component: EditProfileView
};
  
export default meta;
type Story = StoryObj<typeof EditProfileView>;

export const Basic: Story = {
name: "Edit Profile View",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EditProfileView },
    template: '<EditProfileView />',
}),
tags: ["autodocs"],
decorators: [],
};