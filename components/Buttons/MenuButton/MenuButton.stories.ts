import MenuButton from "./MenuButton.vue";
import { VIEW_STATE } from "~/data/Enums";
import type { Meta, StoryObj } from "@storybook/vue3";

import '@assets/main.css';

const meta: Meta<typeof MenuButton> = {
    component: MenuButton
};
  
export default meta;
type Story = StoryObj<typeof MenuButton>;

export const Basic: Story = {
    name: "Menu Button",
    args: {
        icon: '/icons/bell/bell.fill.svg',
        text: 'Report event',
        isDestructive: false
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { MenuButton },
        template: '<MenuButton :icon="icon" :text="text" :isDestructive="isDestructive"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};