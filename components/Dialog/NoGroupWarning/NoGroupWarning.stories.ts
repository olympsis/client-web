import NoGroupWarning from "./NoGroupWarning.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof NoGroupWarning> = {
  component: NoGroupWarning,
};

export default meta;
type Story = StoryObj<typeof NoGroupWarning>;

export const Basic: Story = {
  name: "No Group Warning",
  args: {
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { NoGroupWarning },
    template: '<NoGroupWarning />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
