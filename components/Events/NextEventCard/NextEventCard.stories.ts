import NextEventCard from "./NextEventCard.vue";

export default {
  component: NextEventCard,
  title: "Next Event Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    events: [],
  },
};
