import type { Meta, StoryObj } from "@storybook/vue3";
import NavigationButton from "./NavigationButton.vue";

const meta: Meta<typeof NavigationButton> = {
    component: NavigationButton
};

export default meta;
type Story = StoryObj<typeof NavigationButton>;

export const Light: Story = {
    name: "Light Variant",
    args: {
        to: "/events",
        text: "Events",
        icon: "--events-icon",
        variant: "light"
    },
    render: (args: any) => ({
        setup() {
            return { ...args };
        },
        components: { NavigationButton },
        template: '<NavigationButton :to="to" :text="text" :icon="icon" :variant="variant" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

export const Dark: Story = {
    name: "Dark Variant",
    args: {
        to: "/signin",
        text: "Sign In",
        variant: "dark"
    },
    render: (args: any) => ({
        setup() {
            return { ...args };
        },
        components: { NavigationButton },
        template: '<NavigationButton :to="to" :text="text" :variant="variant" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};
