import EventParticipants from "./EventParticipants.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { Event } from "@/data/models/EventModels";

const meta: Meta<typeof EventParticipants> = {
  component: EventParticipants,
};

export default meta;
type Story = StoryObj<typeof EventParticipants>;

const event: Event = Event.decode({
    "id": "event-id",
    "type": "event",
    "poster": {
        uuid: "",
        username: "",
        avatar: "",
    },
    "image_url": "event-images/soccer-1.jpg",
    "start_time": Math.floor(Date.now() / 1000),
    "title": "Sunday Pick Up",
    "description": "Lets play this sunday!!",
    "sport": "soccer",
    "participants": []
});

export const Basic: Story = {
  name: "Event Participants",
  args: {
    event: event
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { EventParticipants },
    template: '<EventParticipants />',
  }),
  decorators: [],
  tags: ["autodocs"],
};
