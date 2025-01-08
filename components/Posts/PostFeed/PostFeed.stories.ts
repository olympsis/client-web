import PostFeed from "./PostFeed.vue";
import { VIEW_STATE } from "~/data/Enums";

export default {
  component: PostFeed,
  title: "Post Feed",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    state: VIEW_STATE.SUCCESS,
  },
};
