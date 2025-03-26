import LabelsList from "./LabelsList.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof LabelsList> = {
    component: LabelsList
};
  
export default meta;
type Story = StoryObj<typeof LabelsList>;

export const Basic: Story = {
    name: "Event Tags List",
    args: {
        tags: ['$10', 'tournament', 'soccer', 'indoor', 'expert']
    },
    render: (args) => ({
        setup() {
            return {
                ...args,
            };
        },
        components: { LabelsList },
        template: '<LabelsList :tags="tags"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};