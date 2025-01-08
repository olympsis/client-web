import type { Meta, StoryObj } from "@storybook/vue3";
import BannerAndLogoEditor from "./BannerAndLogoEditor.vue";

const meta: Meta<typeof BannerAndLogoEditor> = {
    component: BannerAndLogoEditor
};
  
export default meta;
type Story = StoryObj<typeof BannerAndLogoEditor>;

export const Basic: Story = {
name: "Banner and Logo Editor",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { BannerAndLogoEditor },
    template: '<BannerAndLogoEditor />',
}),
tags: ["autodocs"],
decorators: [],
};