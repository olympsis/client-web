import MembersListCard from "./MembersListCard.vue";
import { Member } from "../../../data/models/GenericModels";

export default {
  component: MembersListCard,
  title: "Members List Card",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

const data = [
  {
    id: "6493b93fd69bf7890c99785f",
    user: {
      user_id: "0cd71e07-cfba-4a10-9d41-c0af122612f6",
      username: "joeljojo",
      image_url: "profile-images/C775179C-52A6-4311-969A-E220408C7D1D.jpeg",
    },
    role: "owner",
    joined_at: 1687402815,
  },
  {
    id: "649dd7164264e1672d8542a6",
    user: {
      user_id: "618f0d62-a9ea-489b-bac0-7c179707dbe8",
      username: "coltonhyer",
      image_url: "profile-images/A18689C2-AE8D-4796-B267-40FAC917A276.jpeg",
    },
    role: "member",
    joined_at: 1688065814,
  },
  {
    id: "64a25f0947868e739b0f15a2",
    user: {
      user_id: "becd1359-98e7-4906-b0c5-8c0aea252b01",
      username: "Blackblade10",
      image_url: "profile-images/D9DFD606-6F6E-4A78-B5F4-1D68ABC11069.jpeg",
    },
    role: "member",
    joined_at: 1688362761,
  },
  {
    id: "6550e781698aee0e7f4328c9",
    user: {
      user_id: "9c6e5e70-adde-4d66-a907-c74f71a842bb",
      username: "HenryBaudoux",
      image_url: "",
    },
    role: "member",
    joined_at: 1699800961,
  },
  {
    id: "66182c79da190d0f964b1ffa",
    user: {
      user_id: "29dd70d8-7ab8-48e6-9779-d00ab82489d4",
      username: "ddaugela",
      image_url: "",
    },
    role: "member",
    joined_at: 1712860281,
  },
  {
    id: "6619c6bc895eabc9ebdf0637",
    user: {
      user_id: "b456bea3-6611-432a-876a-e4f92fda4a4a",
      username: "Tyler",
      image_url: "",
    },
    role: "member",
    joined_at: 1712965308,
  },
];

export const Default = {
  args: {
    members: data.map((o) => Member.decode(o)),
  },
};
