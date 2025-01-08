import ClubLogoAndBanner from "./ClubLogoAndBanner.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ClubLogoAndBanner> = {
    component: ClubLogoAndBanner
};
  
export default meta;
type Story = StoryObj<typeof ClubLogoAndBanner>;

export const Basic: Story = {
    name: "Club Logo & Banner",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { ClubLogoAndBanner },
        template: '<ClubLogoAndBanner />',
    }),
    tags: ["autodocs"],
    decorators: [],
};