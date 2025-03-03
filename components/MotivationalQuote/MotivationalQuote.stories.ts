import MotivationalQuote from "./MotivationalQuote.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MotivationalQuote> = {
    component: MotivationalQuote
};
  
export default meta;
type Story = StoryObj<typeof MotivationalQuote>;

export const Basic: Story = {
    name: "Motivational Quote",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { MotivationalQuote },
        template: '<MotivationalQuote />',
    }),
    tags: ["autodocs"],
    decorators: [],
};