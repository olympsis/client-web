import FailedView from "./FailedView.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof FailedView> = {
    component: FailedView
};
  
export default meta;
type Story = StoryObj<typeof FailedView>;

export const Basic: Story = {
    name: "Failed View",
    args: {
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { FailedView },
        template: '<FailedView />',
    }),
    tags: ["autodocs"],
    decorators: [],
};