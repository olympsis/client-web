import ProfileSettings from "./ProfileSettings.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ProfileSettings> = {
    component: ProfileSettings
};
  
export default meta;
type Story = StoryObj<typeof ProfileSettings>;

export const Basic: Story = {
    name: "Profile Settings",
    args: {
    },
    render: (args) => ({
        setup() {
            return {
            ...args,
            };
        },
        components: { ProfileSettings },
        template: '<ProfileSettings/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};