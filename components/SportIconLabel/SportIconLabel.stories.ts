import { Sports } from "@/data/models/SportsModels";
import SportIconLabel from "./SportIconLabel.vue";

export default {
  component: SportIconLabel,
  title: "Sport Icon Label",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    sport: Sports.Running
  },
};
