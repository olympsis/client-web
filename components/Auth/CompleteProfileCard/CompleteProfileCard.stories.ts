import type { Sport } from "~/data/models/GenericModels";
import { useSessionStore } from "~/stores/session-store";

import sampleSports from "~/data/dev-data/sample-sports";
import CompleteProfileCard from "./CompleteProfileCard.vue";
export default {
  component: CompleteProfileCard,
  title: "Complete Profile Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  decorators: [
    () => {
      // Seed the session store with sample sports so they render in Storybook
      const session = useSessionStore();
      session.sports = sampleSports as Sport[];
      return { template: '<story />' };
    },
  ],
};

export const Default = {
  args: {},
};

export const WithPrefilledData = {
  args: {
    initialFullName: "Joel Joseph",
    initialEmail: "joel@example.com",
  },
};
