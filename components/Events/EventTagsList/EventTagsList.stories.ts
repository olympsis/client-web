import EventTagsList from "./EventTagsList.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof EventTagsList> = {
    component: EventTagsList
};
  
export default meta;
type Story = StoryObj<typeof EventTagsList>;

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
        components: { EventTagsList },
        template: '<EventTagsList :tags="tags"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};