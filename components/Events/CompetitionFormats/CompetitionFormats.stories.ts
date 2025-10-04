import type { Meta, StoryObj } from "@storybook/vue3";
import CompetitionFormats from "./CompetitionFormats.vue";
import { COMPETITION_FORMAT } from "~/data/Enums";

const meta: Meta<typeof CompetitionFormats> = {
    component: CompetitionFormats
};
  
export default meta;
type Story = StoryObj<typeof CompetitionFormats>;

export const Basic: Story = {
name: "Competition Formats",
args: {
    selectedSport: undefined,
    selectedFormats: []
},
render: (args) => ({
    setup() {
        return {
        ...args,
        };
    },
    components: { CompetitionFormats },
    template: '<CompetitionFormats v-model:selectedSport="selectedSport" v-model:selectedFormats="selectedFormats"/>',
}),
tags: ["autodocs"],
decorators: [],
};