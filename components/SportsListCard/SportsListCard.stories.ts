import SportsListCard from "./SportsListCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof SportsListCard> = {
  component: SportsListCard,
};

export default meta;
type Story = StoryObj<typeof SportsListCard>;

export const Basic: Story = {
  name: "Sports List Card",
  args: {
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { SportsListCard },
    template: '<SportsListCard />',
  }),
  decorators: [],
  tags: ["autodocs"],
};