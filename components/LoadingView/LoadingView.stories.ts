import LoadingView from "./LoadingView.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof LoadingView> = {
  component: LoadingView,
};

export default meta;
type Story = StoryObj<typeof LoadingView>;

export const Basic: Story = {
  name: "Loading View",
  args: {},
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { LoadingView },
    template: '<LoadingView/>',
  }),
  decorators: [],
  tags: ["autodocs"],
};
