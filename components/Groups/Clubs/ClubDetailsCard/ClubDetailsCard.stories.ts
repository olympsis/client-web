import { Club } from "@/data/models/ClubModels";
import ClubDetailsCard from "./ClubDetailsCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof ClubDetailsCard> = {
  component: ClubDetailsCard,
};

export default meta;
type Story = StoryObj<typeof ClubDetailsCard>;

const club: Club = Club.decode({
    id: "slc-fc",
    parent: {
      id: "us-ysa-soccer",
      name: "US Youth Soccer Association",
      description:
        "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
      city: "Salt Lake City",
      state: "UT",
      country: "USA",
    },
    name: "SLC FC",
    description:
      "SLC FC is a youth soccer club based in Salt Lake City, Utah. We provide a positive and competitive environment for players to develop their skills and love for the game.",
    sports: ["soccer"],
    city: "Salt Lake City",
    state: "UT",
    country: "USA",
    logo: "https://example.com/slcfc-logo.png",
    banner: "https://example.com/slcfc-team1.jpg",
    visibility: "public",
    members: [
      {
        id: "john.doe",
        name: "John Doe",
        role: "player",
      },
      {
        id: "jane.smith",
        name: "Jane Smith",
        role: "coach",
      },
    ],
    rules: [
      "Respect your teammates, coaches, and opponents.",
      "Always give your best effort.",
      "Have fun and enjoy the game!",
    ],
    pinnedPostId: "announcement-123",
    createdAt: 1619827200000,
});

export const Basic: Story = {
  name: "Club Details Card",
  args: {
    club: club
  },
  render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { ClubDetailsCard },
    template: '<ClubDetailsCard :club="club"/>',
  }),
  decorators: [],
  tags: ["autodocs"],
};