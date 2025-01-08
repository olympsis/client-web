import ChatListItem from "./ChatListItem.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ChatListItem> = {
  component: ChatListItem,
};

export default meta;
type Story = StoryObj<typeof ChatListItem>;

export const Basic: Story = {
  name: "Chat List Item",
  args: {
    
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { ChatListItem },
    template: '<ChatListItem />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
