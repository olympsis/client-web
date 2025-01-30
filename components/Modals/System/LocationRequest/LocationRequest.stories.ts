import LocationRequest from "./LocationRequest.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof LocationRequest> = {
    component: LocationRequest
};
  
export default meta;
type Story = StoryObj<typeof LocationRequest>;

export const Basic: Story = {
name: "Location Request Modal",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { LocationRequest },
    template: '<LocationRequest />',
}),
tags: ["autodocs"],
decorators: [],
};