import WelcomeCard from "./WelcomeCard.vue";

export default {
  component: WelcomeCard,
  title: "Welcome Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    name: " John",
  },
};
