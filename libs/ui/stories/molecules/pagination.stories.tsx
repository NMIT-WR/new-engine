import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../../src/molecules/pagination";
import { VariantContainer, VariantGroup } from "../../.storybook/decorator";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    page: {
      control: { type: "number", min: 1 },
      description: "Current active page (controlled)",
    },
    defaultPage: {
      control: { type: "number", min: 1 },
      description: "Initial active page (uncontrolled)",
      defaultValue: 1,
    },
    count: {
      control: { type: "number", min: 1 },
      description: "Total number of items",
      defaultValue: 100,
    },
    pageSize: {
      control: { type: "number", min: 1 },
      description: "Number of items per page",
      defaultValue: 10,
    },
    siblingCount: {
      control: { type: "number", min: 0 },
      description:
        "Number of sibling pages to show on each side of current page",
      defaultValue: 1,
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "minimal"],
      description: "Visual style variant",
      defaultValue: "filled",
    },
    showFirstLast: {
      control: "boolean",
      description: "Show first/last page buttons",
      defaultValue: true,
    },
    showPrevNext: {
      control: "boolean",
      description: "Show previous/next page buttons",
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    defaultPage: 5,
    count: 100,
    pageSize: 10,
    siblingCount: 1,
    variant: "filled",
    showFirstLast: true,
    showPrevNext: true,
  },
};

export const StyleVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Default (Filled)">
        <Pagination
          defaultPage={5}
          count={100}
          pageSize={10}
          showFirstLast={true}
          showPrevNext={true}
          variant="filled"
        />
      </VariantGroup>

      <VariantGroup title="Outlined">
        <Pagination
          defaultPage={5}
          count={100}
          pageSize={10}
          siblingCount={1}
          showFirstLast={true}
          showPrevNext={true}
          variant="outlined"
        />
      </VariantGroup>

      <VariantGroup title="Minimal">
        <Pagination
          defaultPage={5}
          count={100}
          pageSize={10}
          siblingCount={1}
          showFirstLast={true}
          showPrevNext={true}
          variant="minimal"
        />
      </VariantGroup>
    </VariantContainer>
  ),
};
