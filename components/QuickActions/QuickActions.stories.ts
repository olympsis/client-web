import QuickActions from "./QuickActions.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof QuickActions> = {
    component: QuickActions
};
  
export default meta;
type Story = StoryObj<typeof QuickActions>;

export const Basic: Story = {
    name: "Quick Actions",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { QuickActions },
        template: '<QuickActions />',
    }),
    tags: ["autodocs"],
    decorators: [],
};