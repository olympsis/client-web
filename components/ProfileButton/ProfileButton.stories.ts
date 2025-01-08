import ProfileButton from "./ProfileButton.vue";

export default {
  component: ProfileButton,
  title: "Profile Button",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    imageURL:
      "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1713310766~exp=1713314366~hmac=6bdd8179f1778ba51c26c5aa7cbfcb0af3a5324a2ec379f078dae038421974df&w=2000",
  },
};
