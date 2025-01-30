import FallbackLocation from "./FallbackLocation.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof FallbackLocation> = {
    component: FallbackLocation
};
  
export default meta;
type Story = StoryObj<typeof FallbackLocation>;

export const Basic: Story = {
name: "Fallback Location Modal",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { FallbackLocation },
    template: '<FallbackLocation />',
}),
tags: ["autodocs"],
decorators: [],
};