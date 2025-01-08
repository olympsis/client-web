import LocalePicker from "./LocalePicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof LocalePicker> = {
  component: LocalePicker,
};

export default meta;
type Story = StoryObj<typeof LocalePicker>;

export const Basic: Story = {
  name: "Location Picker",
  args: {
    showCities: true
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { LocalePicker },
    template: '<LocalePicker :showCities="showCities"/>',
  }),
  decorators: [],
  tags: ["autodocs"],
};
