import type { Meta, StoryObj } from "@storybook/vue3";
import EventExternalLinkSetting from "./EventExternalLinkSetting.vue";

const meta: Meta<typeof EventExternalLinkSetting> = {
    component: EventExternalLinkSetting
};
  
export default meta;
type Story = StoryObj<typeof EventExternalLinkSetting>;

export const Basic: Story = {
name: "Event External Link Setting",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { EventExternalLinkSetting },
    template: '<EventExternalLinkSetting />',
}),
tags: ["autodocs"],
decorators: [],
};