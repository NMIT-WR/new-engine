"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "../../src/atoms/rating";
import { useState } from "react";

const meta: Meta<typeof Rating> = {
  title: "Atoms/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 5, step: 5 },
    },
    maxValue: {
      control: { type: "number", min: 1, max: 10 },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    readOnly: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || 0);

    return (
      <div className="flex flex-col gap-2">
        <Rating {...args} value={value} onChange={setValue} />
        <p className="text-sm">Current value: {value}</p>
      </div>
    );
  },
  args: {
    value: 0,
    maxValue: 5,
    size: "sm",
  },
};
