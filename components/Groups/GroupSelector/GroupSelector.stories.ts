import GroupSelector from "./GroupSelector.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { Club } from "@/data/models/ClubModels";
import { Organization } from "@/data/models/OrganizationModels";
import GroupSelectorSkeleton from "./GroupSelectorSkeleton.vue";

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
  sport: "Soccer",
  city: "Salt Lake City",
  state: "UT",
  country: "USA",
  imageURL: "https://example.com/slcfc-logo.png",
  imageGallery: [
    "https://example.com/slcfc-team1.jpg",
    "https://example.com/slcfc-team2.jpg",
    "https://example.com/slcfc-field.jpg",
  ],
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

const club2: Club = Club.decode({
  id: "mfc-utah",
  parent: {
    id: "us-ysa-soccer",
    name: "US Youth Soccer Association",
    description:
      "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
    city: "Salt Lake City",
    state: "UT",
    country: "USA",
  },
  name: "MFC",
  description:
    "MFC (Murray Football Club) is a youth soccer organization based in Murray, Utah. Our mission is to provide a supportive environment for players to develop their skills and passion for the game.",
  sport: "Soccer",
  city: "Murray",
  state: "UT",
  country: "USA",
  imageURL: "https://example.com/mfc-logo.png",
  imageGallery: [
    "https://example.com/mfc-team1.jpg",
    "https://example.com/mfc-team2.jpg",
    "https://example.com/mfc-field.jpg",
  ],
  visibility: "public",
  members: [
    {
      id: "alex.rodriguez",
      name: "Alex Rodriguez",
      role: "player",
    },
    {
      id: "sarah.wilson",
      name: "Sarah Wilson",
      role: "coach",
    },
  ],
  rules: [
    "Respect your teammates, coaches, and opponents.",
    "Always give your best effort on and off the field.",
    "Have fun and enjoy the beautiful game!",
  ],
  pinnedPostId: "announcement-456",
  createdAt: 1619827200000,
});

const org: Organization = Organization.decode({
  id: "us-ysa-soccer",
  name: "US Youth Soccer Association",
  description:
    "The US Youth Soccer Association is the national governing body for youth soccer in the United States.",
  sport: "Soccer",
  city: "Salt Lake City",
  state: "UT",
  country: "USA",
  imageURL: "https://example.com/usysasoccer-logo.png",
  imageGallery: [
    "https://example.com/usysasoccer-event1.jpg",
    "https://example.com/usysasoccer-event2.jpg",
    "https://example.com/usysasoccer-team.jpg",
  ],
  members: [
    {
      id: "john.smith",
      name: "John Smith",
      role: "president",
    },
    {
      id: "jane.doe",
      name: "Jane Doe",
      role: "vice-president",
    },
  ],
  pinnedPostId: "announcement-789",
  children: [
    {
      id: "slc-fc",
      name: "SLC FC",
      description:
        "SLC FC is a youth soccer club based in Salt Lake City, Utah.",
      sport: "Soccer",
      city: "Salt Lake City",
      state: "UT",
      country: "USA",
    },
    {
      id: "mfc-utah",
      name: "MFC",
      description:
        "MFC (Murray Football Club) is a youth soccer organization based in Murray, Utah.",
      sport: "Soccer",
      city: "Murray",
      state: "UT",
      country: "USA",
    },
  ],
  createdAt: 1483228800000,
});

const meta: Meta<typeof GroupSelector> = {
  component: GroupSelector,
};

export default meta;
type Story = StoryObj<typeof GroupSelector>;

export const Basic: Story = {
  name: "GroupSelector",
  args: {
    // // groups: [
    // //   new GroupSelection(GROUP_TYPE.CLUB, club, undefined),
    // //   new GroupSelection(GROUP_TYPE.CLUB, club2, undefined),
    // //   new GroupSelection(
    // //     GROUP_TYPE.ORGANIZATION,
    // //     undefined,
    // //     org,
    // //   ),
    // // ],
    // state: LOADING_STATE.LOADING
  },
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { GroupSelector },
    template: '<GroupSelector :groups="groups"/>',
  }),
  tags: ["autodocs"],
  decorators: [],
};

export const Skeleton: Story = {
  name: "GroupSelector - Skeleton",
  render: (args) => ({
    setup() {
      return {
        ...args,
      };
    },
    components: { GroupSelectorSkeleton },
    template: '<GroupSelectorSkeleton/>',
  }),
  decorators: [],
}
