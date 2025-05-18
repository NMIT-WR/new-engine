import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "../../src/atoms/tooltip";
import { Button } from "../../src/atoms/button";
import { VariantContainer } from "../../.storybook/decorator";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
      description: "Preferred placement of the tooltip.",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size variant of the tooltip content.",
    },
    openDelay: {
      control: "number",
      description: "Delay in milliseconds before the tooltip opens.",
    },
    closeDelay: {
      control: "number",
      description: "Delay in milliseconds before the tooltip closes.",
    },
    interactive: {
      control: "boolean",
      description: "Tooltip remains open when hovered.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the tooltip.",
    },
    defaultOpen: {
      control: "boolean",
      description: "If the tooltip should be open by default.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "This is a default tooltip!",
    children: <Button variant="primary">Hover me</Button>,
    placement: "bottom",
    offset: { mainAxis: 20, crossAxis: 0 },
  },
};

export const Placements: Story = {
  render: (args) => (
    <VariantContainer>
      {(
        ["top", "bottom", "left", "right", "top-start", "bottom-end"] as const
      ).map((placement) => (
        <Tooltip
          key={placement}
          content={`Tooltip on ${placement}`}
          placement={placement}
          {...args}
        >
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </VariantContainer>
  ),
  args: {
    openDelay: 0,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <VariantContainer>
      <Tooltip content="Small tooltip" size="sm" {...args}>
        <Button>Small</Button>
      </Tooltip>
      <Tooltip content="Medium tooltip (default)" size="md" {...args}>
        <Button>Medium</Button>
      </Tooltip>
      <Tooltip content="Large tooltip" size="lg" {...args}>
        <Button>Large</Button>
      </Tooltip>
    </VariantContainer>
  ),
  args: {
    placement: "top",
  },
};

export const WithHTMLContent: Story = {
  args: {
    content: (
      <div>
        <strong>Formatted</strong> <em>tooltip</em> content with a{" "}
        <a href="#" className="text-blue-400 hover:underline">
          link
        </a>
        .
      </div>
    ),
    children: <Button>With HTML</Button>,
    placement: "bottom",
    interactive: true,
  },
};

export const Disabled: Story = {
  args: {
    content: "You won't see this, I'm disabled.",
    children: <Button>Disabled Tooltip Trigger</Button>,
    disabled: true,
  },
};
