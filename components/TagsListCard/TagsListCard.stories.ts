import TagsListCard from "./TagsListCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof TagsListCard> = {
  component: TagsListCard,
};

export default meta;
type Story = StoryObj<typeof TagsListCard>;

export const Basic: Story = {
  name: "Tags List Card",
  args: {
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { TagsListCard },
    template: '<TagsListCard />',
  }),
  decorators: [],
  tags: ["autodocs"],
};