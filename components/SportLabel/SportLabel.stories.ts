import SportLabel from "./SportLabel.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof SportLabel> = {
  component: SportLabel,
};

export default meta;
type Story = StoryObj<typeof SportLabel>;

export const Basic: Story = {
  name: "Sports Label",
  args: {
    sport: 'soccer'
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { SportLabel },
    template: '<SportLabel :sport="sport" />',
  }),
  decorators: [],
  tags: ["autodocs"],
};