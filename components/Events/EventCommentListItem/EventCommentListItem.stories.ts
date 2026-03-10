import type { Meta, StoryObj } from "@storybook/vue3";
import { EventComment } from "~/data/models/EventModels";
import EventCommentListItem from "./EventCommentListItem.vue";

const meta: Meta<typeof EventCommentListItem> = {
    component: EventCommentListItem
};

export default meta;
type Story = StoryObj<typeof EventCommentListItem>;

/** Sample comment created 12 hours ago for Storybook preview */
const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

const sampleComment = EventComment.decode({
    id: "comment-001",
    user: {
        user_id: "user-001",
        first_name: "Joel",
        last_name: "Joseph",
        username: "joeljoseph",
        image_url: undefined
    },
    text: "Hey! Sup guys, ready for the event? I am super excited!",
    event_id: "event-001",
    created_at: twelveHoursAgo.toISOString(),
    reactions: [
        {
            id: "reaction-001",
            user: { user_id: "user-002", first_name: "Alex", last_name: "Smith", username: "alexsmith" },
            type: "thumbs_up",
            created_at: twelveHoursAgo.toISOString()
        },
        {
            id: "reaction-002",
            user: { user_id: "user-003", first_name: "Jordan", last_name: "Lee", username: "jordanlee" },
            type: "thumbs_up",
            created_at: twelveHoursAgo.toISOString()
        },
        {
            id: "reaction-003",
            user: { user_id: "user-002", first_name: "Alex", last_name: "Smith", username: "alexsmith" },
            type: "fire",
            created_at: twelveHoursAgo.toISOString()
        },
        {
            id: "reaction-004",
            user: { user_id: "user-001", first_name: "Joel", last_name: "Joseph", username: "joeljoseph" },
            type: "heart",
            created_at: twelveHoursAgo.toISOString()
        }
    ]
});

/** Comment with no reactions for testing empty state */
const sampleCommentNoReactions = EventComment.decode({
    id: "comment-002",
    user: {
        user_id: "user-002",
        first_name: "Alex",
        last_name: "Smith",
        username: "alexsmith",
        image_url: undefined
    },
    text: "Can't wait! See you all there.",
    event_id: "event-001",
    created_at: twelveHoursAgo.toISOString()
});

export const WithReactions: Story = {
    name: "With Reactions",
    args: {
        comment: sampleComment
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventCommentListItem },
        template: '<EventCommentListItem :comment="comment"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};

export const Basic: Story = {
    name: "No Reactions",
    args: {
        comment: sampleCommentNoReactions
    },
    render: (args) => ({
        setup() {
            return { ...args };
        },
        components: { EventCommentListItem },
        template: '<EventCommentListItem :comment="comment"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};
