import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../src/atoms/badge";

const meta: Meta<typeof Badge> = {
	title: "Atoms/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "outline"],
		},
		children: {
			control: "text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	args: {
		variant: "info",
		children: "Novinka",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "OS",
	},
};
