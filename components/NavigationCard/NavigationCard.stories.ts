import { VIEW_STATE } from "~/data/Enums";
import NavigationCard from "./NavigationCard.vue";

export default {
  component: NavigationCard,
  title: "Navigation Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    state: VIEW_STATE.SUCCESS,
  },
};
