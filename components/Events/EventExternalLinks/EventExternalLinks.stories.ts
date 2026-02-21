import EventExternalLinks from "./EventExternalLinks.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { EventLink } from "~/data/models/EventModels";

const meta: Meta<typeof EventExternalLinks> = {
    component: EventExternalLinks
};

export default meta;
type Story = StoryObj<typeof EventExternalLinks>;

export const SingleLink: Story = {
    name: "Single Link",
    args: {
        links: [
            new EventLink("Registration Page", "https://example.com/register")
        ]
    },
    render: (args) => ({
        setup() {
            return {
                ...args,
            };
        },
        components: { EventExternalLinks },
        template: '<EventExternalLinks :links="links" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

export const MultipleLinks: Story = {
    name: "Multiple Links",
    args: {
        links: [
            new EventLink("Registration Page", "https://example.com/register"),
            new EventLink("Event Website", "https://example.com/event"),
            new EventLink("Live Stream", "https://twitch.tv/example")
        ]
    },
    render: (args) => ({
        setup() {
            return {
                ...args,
            };
        },
        components: { EventExternalLinks },
        template: '<EventExternalLinks :links="links" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};
