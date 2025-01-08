import type { Meta, StoryObj } from "@storybook/vue3";
import GroupLogoAndBanner from "./GroupLogoAndBanner.vue";

const meta: Meta<typeof GroupLogoAndBanner> = {
    component: GroupLogoAndBanner
};
  
export default meta;
type Story = StoryObj<typeof GroupLogoAndBanner>;

export const Basic: Story = {
name: "Group Logo And Banner",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { GroupLogoAndBanner },
    template: '<GroupLogoAndBanner :bannerURL="" :logoURL=""/>',
}),
tags: ["autodocs"],
decorators: [],
};