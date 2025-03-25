
import MultiTagsPicker from "./MultiTagsPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MultiTagsPicker> = {
    component: MultiTagsPicker
};
  
export default meta;
type Story = StoryObj<typeof MultiTagsPicker>;

export const Basic: Story = {
name: "Multi Tags Picker",
args: {
    tags: []
},
render: (args) => ({
    setup() {
        return {
            ...args,
        };
    },
    components: { MultiTagsPicker },
    template: '<MultiTagsPicker :tags="tags"/>',
}),
tags: ["autodocs"],
decorators: [],
};