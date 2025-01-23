import NavigationBar from "./NavigationBar.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import "~/assets/css/main.css";

const meta: Meta<typeof NavigationBar> = {
  component: NavigationBar,
};

export default meta;
type Story = StoryObj<typeof NavigationBar>;

export const Basic: Story = {
  name: "Navigation Bar",
  render: () => ({
    components: { NavigationBar },
    template: '<NavigationBar imageURL="https://storage.googleapis.com/olympsis-profile-images/78B944B9-F969-4D11-B940-BFA0C9E83A7F.jpeg"/>',
  }),
  tags: ["autodocs"],
  decorators: [],
};
