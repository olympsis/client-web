import { userSnippets } from "./sample-users";
import { Post } from "~/data/models/PostModels";
import { Like } from "~/data/models/GenericModels";
import { Comment } from "~/data/models/GenericModels";

const comments = {
    post1Comments: [
        new Comment("comment-1", userSnippets.sarah, "Great form! Keep it up!", Math.floor(Date.now() / 1000) - 3600),
        new Comment("comment-2", userSnippets.mike, "This is inspiring!", Math.floor(Date.now() / 1000) - 1800)
    ],
    post2Comments: [
        new Comment("comment-3", userSnippets.emma, "Count me in for next time!", Math.floor(Date.now() / 1000) - 7200),
        new Comment("comment-4", userSnippets.chris, "Perfect weather for it!", Math.floor(Date.now() / 1000) - 5400)
    ]
};


// Template likes
const likes = {
    post1Likes: [
        new Like("like-1", userSnippets.sarah.userId!, Math.floor(Date.now() / 1000) - 3600),
        new Like("like-2", userSnippets.mike.userId!, Math.floor(Date.now() / 1000) - 3000),
        new Like("like-3", userSnippets.emma.userId!, Math.floor(Date.now() / 1000) - 2400)
    ],
    post2Likes: [
        new Like("like-4", userSnippets.chris.userId!, Math.floor(Date.now() / 1000) - 7200),
        new Like("like-5", userSnippets.alex.userId!, Math.floor(Date.now() / 1000) - 6600)
    ]
};

// Template posts
export const samplePosts = [
    new Post(
        "post-1",
        "workout",
        userSnippets.alex,
        "Just finished a 10k run with a new personal best! 🏃‍♂️",
        undefined,
        ["https://example.com/run-1.jpg"],
        likes.post1Likes,
        comments.post1Comments,
        Math.floor(Date.now() / 1000) - 86400
    ),
    new Post(
        "post-2",
        "event",
        userSnippets.sarah,
        "Beach volleyball tournament this weekend was amazing! 🏐",
        undefined,
        ["https://example.com/volleyball-1.jpg", "https://example.com/volleyball-2.jpg"],
        likes.post2Likes,
        comments.post2Comments,
        Math.floor(Date.now() / 1000) - 172800
    ),
    new Post(
        "post-3",
        "achievement",
        userSnippets.mike,
        "Finally mastered that backhand serve! 🎾",
        undefined,
        ["https://example.com/tennis.jpg"],
        [new Like("like-6", userSnippets.emma.userId!, Math.floor(Date.now() / 1000) - 1800)],
        [new Comment("comment-5", userSnippets.chris, "Looking sharp!", Math.floor(Date.now() / 1000) - 1200)],
        Math.floor(Date.now() / 1000) - 43200
    ),
    new Post(
        "post-4",
        "training",
        userSnippets.emma,
        "Morning yoga session to start the day right 🧘‍♀️",
        undefined,
        ["https://example.com/yoga.jpg"],
        [new Like("like-7", userSnippets.sarah.userId!, Math.floor(Date.now() / 1000) - 900)],
        [new Comment("comment-6", userSnippets.alex, "So peaceful!", Math.floor(Date.now() / 1000) - 600)],
        Math.floor(Date.now() / 1000) - 21600
    ),
    new Post(
        "post-5",
        "highlight",
        userSnippets.chris,
        "Basketball drills with the team 🏀",
        undefined,
        ["https://example.com/basketball-1.jpg", "https://example.com/basketball-2.jpg"],
        [
            new Like("like-8", userSnippets.mike.userId!, Math.floor(Date.now() / 1000) - 2700),
            new Like("like-9", userSnippets.alex.userId!, Math.floor(Date.now() / 1000) - 1500)
        ],
        [
            new Comment("comment-7", userSnippets.sarah, "Great practice session!", Math.floor(Date.now() / 1000) - 1800),
            new Comment("comment-8", userSnippets.emma, "The team is looking strong!", Math.floor(Date.now() / 1000) - 900)
        ],
        Math.floor(Date.now() / 1000) - 10800
    )
];