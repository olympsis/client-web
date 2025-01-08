import MediaPicker from "./MediaPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MediaPicker> = {
  component: MediaPicker,
};

export default meta;
type Story = StoryObj<typeof MediaPicker>;

export const Basic: Story = {
  name: "Media Picker",
  args: {},
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { MediaPicker },
    template: '<MediaPicker />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
