import MemberListItem from "./MemberListItem.vue";
import { Member } from "@/data/models/GenericModels";

export default {
  component: MemberListItem,
  title: "Member List Item",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

const data = {
  id: "6493b93fd69bf7890c99785f",
  user: {
    user_id: "0cd71e07-cfba-4a10-9d41-c0af122612f6",
    username: "joeljojo",
    image_url: "profile-images/C775179C-52A6-4311-969A-E220408C7D1D.jpeg",
  },
  role: "owner",
  joined_at: 1687402815,
};

export const Default = {
  args: {
    member: Member.decode(data),
  },
};
