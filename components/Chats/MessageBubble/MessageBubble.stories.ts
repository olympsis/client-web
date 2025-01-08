import { ChatMessage } from "@/data/models/ChatModels";
import MessageBubble from "./MessageBubble.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const Basic: Story = {
	name: "Message Bubble",
	args: {
		isUser: false,
		message: ChatMessage.decode({
			'id': '0',
			'sender': '',
			'type': 'text',
			'body': `Let's go play some football!`,
			'timestamp': 1731934148
		})
	},
	render: (args) => ({
		setup() {
			return {
			...args,
			};
		},
		components: { MessageBubble },
		template: '<MessageBubble :isUser="isUser" :message="message"/>',
	}),
	decorators: [],
	tags: ["autodocs"],
};
