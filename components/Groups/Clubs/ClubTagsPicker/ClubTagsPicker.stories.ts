import ClubTagsPicker from "./ClubTagsPicker.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ClubTagsPicker> = {
    component: ClubTagsPicker
};
  
export default meta;
type Story = StoryObj<typeof ClubTagsPicker>;

export const Basic: Story = {
    name: "Club Logo & Banner",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { ClubTagsPicker },
        template: '<ClubTagsPicker />',
    }),
    tags: ["autodocs"],
    decorators: [],
};