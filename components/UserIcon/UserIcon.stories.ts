import { UserSnippet } from "../../data/models/UserModels";
import UserIcon from "./UserIcon.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof UserIcon> = {
  component: UserIcon,
};

export default meta;
type Story = StoryObj<typeof UserIcon>;

export const Basic: Story = {
  name: "UserIcon",
  args: {
    user: UserSnippet.decode({
      uuid: "0",
      username: "john-doe",
      image_url: "profile-images/78B944B9-F969-4D11-B940-BFA0C9E83A7F.jpeg",
    }),
    size: 5,
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { UserIcon },
    template: '<UserIcon :user="user" :size="size"/>',
  }),
  decorators: [],
  tags: ["autodocs"],
};
