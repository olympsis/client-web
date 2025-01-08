import AnnouncementsGallery from "./AnnouncementsGallery.vue";

export default {
  component: AnnouncementsGallery,
  title: "Announcements Gallery",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
};

export const Default = {
  args: {
    images: [
      "https://storage.googleapis.com/olympsis-feed-images/072bb74c-bebe-449d-9d1f-efe26b974081.jpg",
      "https://storage.googleapis.com/olympsis-feed-images/89b037d3-e4d6-4e65-86a4-27ef09983489.jpg",
    ],
  },
};
