
import AuthModal from "./AuthModal.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof AuthModal> = {
    component: AuthModal
};
  
export default meta;
type Story = StoryObj<typeof AuthModal>;

export const Basic: Story = {
    name: "Auth Modal",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { AuthModal },
        template: '<AuthModal/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};