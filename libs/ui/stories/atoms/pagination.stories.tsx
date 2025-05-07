import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../../src/molecules/pagination";
import { VariantContainer, VariantGroup } from "../../.storybook/decorator";

const meta: Meta<typeof Pagination> = {
  title: "Atoms/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    originPage: {
      control: { type: "number", min: 1 },
      description: "Current active page",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "Total number of pages",
    },
    siblingCount: {
      control: { type: "number", min: 1 },
      description: "Maximum number of page buttons to display at once",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "minimal"],
      description: "Visual style variant",
    },
    showFirstLast: {
      control: "boolean",
      description: "Show first/last page buttons",
    },
    showPrevNext: {
      control: "boolean",
      description: "Show previous/next page buttons",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const StyleVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Default (Filled)">
        <Pagination
          originPage={5}
          totalPages={10}
          siblingCount={2}
          showFirstLast={true}
          showPrevNext={true}
          variant="filled"
        />
      </VariantGroup>

      <VariantGroup title="Outlined">
        <Pagination
          originPage={5}
          totalPages={10}
          siblingCount={2}
          showFirstLast={true}
          showPrevNext={true}
          variant="outlined"
        />
      </VariantGroup>

      <VariantGroup title="Minimal">
        <Pagination
          originPage={5}
          totalPages={10}
          siblingCount={2}
          showFirstLast={true}
          showPrevNext={true}
          variant="minimal"
        />
      </VariantGroup>
    </VariantContainer>
  ),
};
