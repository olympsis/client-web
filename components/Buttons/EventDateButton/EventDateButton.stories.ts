import EventDateButton from "./EventDateButton.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventDateButton> = {
  component: EventDateButton,
};

export default meta;
type Story = StoryObj<typeof EventDateButton>;

export const Basic: Story = {
  name: "Event Date Button",
  args: {
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { EventDateButton },
    template: '<EventDateButton />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
