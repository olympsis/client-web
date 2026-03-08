import CompleteProfileCard from "./CompleteProfileCard.vue";

export default {
  component: CompleteProfileCard,
  title: "Complete Profile Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {},
};

export const WithPrefilledData = {
  args: {
    initialFirstName: "Joel",
    initialLastName: "",
    initialEmail: "joel@example.com",
  },
};
