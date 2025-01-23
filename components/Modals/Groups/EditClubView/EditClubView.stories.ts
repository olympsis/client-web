import type { Meta, StoryObj } from "@storybook/vue3";
import EditClubView from "./EditClubView.vue";

const meta: Meta<typeof EditClubView> = {
    component: EditClubView
};
  
export default meta;
type Story = StoryObj<typeof EditClubView>;

export const Basic: Story = {
name: "Edit Club View",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EditClubView },
    template: '<EditClubView />',
}),
tags: ["autodocs"],
decorators: [],
};