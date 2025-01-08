import PostListItem from "./PostListItem.vue";
import { Post } from "@/data/models/PostModels";
import type { Meta, StoryObj } from "@storybook/vue3";
import PostListItemSkeleton from "./PostListItemSkeleton.vue";

import "@assets/main.css"

const data: Post = Post.decode({
  id: "0",
  type: "post",
  poster: {
    id: "",
    uuid: "uuuu",
    username: "john-doe",
    image_url: "profile-images/4A148BB8-F712-4152-BC8A-1A9416F134EF.jpeg",
  },
  body: "This morning i ran across a bear on my trail hike. Please watch out on your hike this week.",
  images: ["feed-images/DA67B2B4-8C8E-422F-B8A2-967779DE0A5B.jpeg"],
  created_at: 1713430943,
});

const meta: Meta<typeof PostListItem> = {
  component: PostListItem,
};

export default meta;
type Story = StoryObj<typeof PostListItem>;

export const Basic: Story = {
  name: "PostListItem",
  args: {
    post: data,
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { PostListItem },
    template: '<PostListItem :post="post"/>',
  }),
  tags: ["autodocs"],
  decorators: [],
};

export const Skeleton: StoryObj<typeof PostListItemSkeleton> = {
  name: "PostListItem - Skeleton",
  render: (args) => ({
    args: {
      hasImages: true,
    },
    setup() {
      return {
        ...args,
      };
    },
    components: { PostListItemSkeleton },
    template: '<PostListItemSkeleton :hasImages="hasImages"/>',
  }),
  tags: ["autodocs"],
  decorators: [],
};