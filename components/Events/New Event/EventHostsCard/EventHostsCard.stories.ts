import EventHostsCard from "./EventHostsCard.vue";
import type { OrganizerItem, SponsorItem } from "./EventHostsCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import { UserSnippet } from "~/data/models/UserModels";

const meta: Meta<typeof EventHostsCard> = {
    component: EventHostsCard
};

export default meta;
type Story = StoryObj<typeof EventHostsCard>;

export const samplePoster = new UserSnippet(
    "user-001",
    "John",
    "Doe",
    "johndoe",
    undefined
);

const sampleOrganizers: OrganizerItem[] = [
    { type: 0, name: "NYC Tennis Club", imageURL: "https://example.com/logos/tennis.png" }
];

const sampleSponsors: SponsorItem[] = [
    { name: "Lacoste", imageURL: "https://example.com/logos/lacoste.png" }
];

/** Default state — no poster passed, falls back to "John Doe" */
export const Default: Story = {
    name: "Default",
    args: {
        organizers: [],
        sponsors: [],
        removable: false
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventHostsCard },
        template: '<EventHostsCard :organizers="organizers" :sponsors="sponsors" :removable="removable" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

/** Empty state — poster provided, no organizers or sponsors */
export const Empty: Story = {
    name: "Empty",
    args: {
        poster: samplePoster,
        organizers: [],
        sponsors: [],
        removable: false
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventHostsCard },
        template: '<EventHostsCard :poster="poster" :organizers="organizers" :sponsors="sponsors" :removable="removable" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

/** With an organizer added but no sponsors */
export const WithOrganizer: Story = {
    name: "With Organizer",
    args: {
        poster: samplePoster,
        organizers: sampleOrganizers,
        sponsors: [],
        removable: false
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventHostsCard },
        template: '<EventHostsCard :poster="poster" :organizers="organizers" :sponsors="sponsors" :removable="removable" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};

/** Full state — organizers and sponsors with removable badges */
export const Full: Story = {
    name: "Full",
    args: {
        poster: samplePoster,
        organizers: sampleOrganizers,
        sponsors: sampleSponsors,
        removable: true
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventHostsCard },
        template: '<EventHostsCard :poster="poster" :organizers="organizers" :sponsors="sponsors" :removable="removable" />',
    }),
    tags: ["autodocs"],
    decorators: [],
};
