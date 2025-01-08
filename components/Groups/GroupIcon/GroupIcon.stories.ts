import { GROUP_TYPE } from "~/data/Enums";
import GroupIcon from "./GroupIcon.vue";

export default {
  component: GroupIcon,
  title: "Group Icon",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    type: GROUP_TYPE.CLUB,
    image: "",
    size: 5,
  },
};
