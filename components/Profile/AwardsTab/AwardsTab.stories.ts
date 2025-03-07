import AwardsTab from "./AwardsTab.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof AwardsTab> = {
    component: AwardsTab
};
  
export default meta;
type Story = StoryObj<typeof AwardsTab>;

export const Basic: Story = {
    name: "Award Tabs",
    args: {},
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { AwardsTab },
        template: '<AwardsTab />',
    }),
    tags: ["autodocs"],
    decorators: [],
};