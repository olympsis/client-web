import { ref, watch } from "vue";
import SearchBar from "./SearchBar.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof SearchBar> = {
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Basic: Story = {
  name: "Search Bar",
  args: {
    value: ''
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { SearchBar },
    template: '<SearchBar :modelValue="value" />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
