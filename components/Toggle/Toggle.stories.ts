import Toggle from "./Toggle.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Toggle> = {
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Basic: Story = {
  name: "Toggle",
  args: {
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { Toggle },
    template: '<Toggle />',
  }),
  decorators: [],
  tags: ["autodocs"],
};