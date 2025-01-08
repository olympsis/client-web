import { VIEW_STATE } from "~/data/Enums";
import TextButton from "./TextButton.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, watch } from "vue";

const meta: Meta<typeof TextButton> = {
    component: TextButton
};
  
export default meta;
type Story = StoryObj<typeof TextButton>;

export const Basic: Story = {
    name: "Text Button",
    args: {
        text: 'Apply',
        modelValue: VIEW_STATE.PENDING,
    },
    render: (args) => ({
        setup() {
            const model = ref(args.modelValue);
            watch(
                () => args.modelValue,
                (val) => {
                    model.value = val;
                },
            );
            return {
                ...args,
                model
            };
        },
        components: { TextButton },
        template: '<TextButton :text="text" v-model="model"/>',
    }),
    tags: ["autodocs"],
    decorators: [],
};