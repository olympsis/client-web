import LocationDialog from "./LocationDialog.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof LocationDialog> = {
  component: LocationDialog,
};

export default meta;
type Story = StoryObj<typeof LocationDialog>;

export const Basic: Story = {
  name: "Location Dialog",
  args: {
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { LocationDialog },
    template: '<LocationDialog/>',
  }),
  decorators: [],
  tags: ["autodocs"],
};