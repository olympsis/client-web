import type { Meta, StoryObj } from "@storybook/vue3";
import ClubListCardTemplate from "./ClubListCardTemplate.vue";

const meta: Meta<typeof ClubListCardTemplate> = {
    component: ClubListCardTemplate
};
  
export default meta;
type Story = StoryObj<typeof ClubListCardTemplate>;

export const Basic: Story = {
    name: "Club List Card Template",
    args: {
    },
    render: (args) => ({
        components: { ClubListCardTemplate },
        template: '<ClubListCardTemplate />',
    }),
    tags: ["autodocs"],
    decorators: [],
};