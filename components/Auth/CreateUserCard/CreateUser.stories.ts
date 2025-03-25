import CreateUserCard from "./CreateUserCard.vue";
import sampleSports from "~/data/dev-data/sample-sports";

export default {
  component: CreateUserCard,
  title: "Create User Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {},
};
