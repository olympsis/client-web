import TabLabel from "./TabLabel.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof TabLabel> = {
  component: TabLabel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabLabel>;

export const Default: Story = {
  name: "Default",
  args: {
    label: "soccer",
    variant: "default",
  },
  render: (args) => ({
    setup() {
      return { ...args };
    },
    components: { TabLabel },
    template: '<TabLabel :label="label" :variant="variant" />',
  }),
};

export const Full: Story = {
  name: "Full",
  args: {
    label: "full",
    variant: "full",
  },
  render: (args) => ({
    setup() {
      return { ...args };
    },
    components: { TabLabel },
    template: '<TabLabel :label="label" :variant="variant" />',
  }),
};

export const Paid: Story = {
  name: "Paid",
  args: {
    label: "$10",
    variant: "paid",
  },
  render: (args) => ({
    setup() {
      return { ...args };
    },
    components: { TabLabel },
    template: '<TabLabel :label="label" :variant="variant" />',
  }),
};

export const Waitlist: Story = {
  name: "Waitlist",
  args: {
    label: "waitlist",
    variant: "waitlist",
  },
  render: (args) => ({
    setup() {
      return { ...args };
    },
    components: { TabLabel },
    template: '<TabLabel :label="label" :variant="variant" />',
  }),
};

export const Tournament: Story = {
  name: "Tournament",
  args: {
    label: "tournament",
    variant: "tournament",
  },
  render: (args) => ({
    setup() {
      return { ...args };
    },
    components: { TabLabel },
    template: '<TabLabel :label="label" :variant="variant" />',
  }),
};
