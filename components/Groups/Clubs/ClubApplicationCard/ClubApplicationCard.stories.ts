import ClubApplicationCard from "./ClubApplicationCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ClubApplicationCard> = {
    component: ClubApplicationCard
};
  
export default meta;
type Story = StoryObj<typeof ClubApplicationCard>;

export const Basic: Story = {
    name: "Club Application Card",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { ClubApplicationCard },
        template: '<ClubApplicationCard />',
    }),
    tags: ["autodocs"],
    decorators: [],
};