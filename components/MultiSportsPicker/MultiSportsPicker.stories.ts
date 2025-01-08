
import MultiSportsPicker from "./MultiSportsPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MultiSportsPicker> = {
    component: MultiSportsPicker
};
  
export default meta;
type Story = StoryObj<typeof MultiSportsPicker>;

export const Basic: Story = {
name: "Multi Sports Picker",
args: {},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { MultiSportsPicker },
    template: '<MultiSportsPicker />',
}),
tags: ["autodocs"],
decorators: [],
};