import type { Meta, StoryObj } from "@storybook/react";
import { SearchForm } from "../../src/molecules/search-form";
import { VariantGroup, VariantContainer } from "../../.storybook/decorator";

const meta: Meta<typeof SearchForm> = {
  title: "Molecules/SearchForm",
  component: SearchForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls the size of the search form elements",
    },
    buttonText: {
      control: "text",
      description: "Text displayed on the search button",
    },
    label: {
      control: "text",
      description: "Label text for the search form",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

// Basic search form variations
export const Default: Story = {
  args: {
    placeholder: "Search products, articles ...",
    buttonText: "Search",
  },
};

// Size and layout variants showcase
export const Variants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes" fullWidth>
        <SearchForm size="sm" placeholder="Small search..." buttonIcon={true} />
        <SearchForm
          size="md"
          placeholder="Medium search..."
          buttonText="Search"
        />
        <SearchForm
          size="lg"
          placeholder="Large search..."
          buttonText="Search"
        />
      </VariantGroup>

      <VariantGroup title="Solid theme" fullWidth>
        <SearchForm
          placeholder="Search products..."
          buttonIcon={true}
          buttonProps={{ theme: "borderless" }}
        />
        <SearchForm
          placeholder="Search products... "
          buttonText="Search"
          buttonProps={{ theme: "solid" }}
        />
      </VariantGroup>
      <VariantGroup title="Without button" fullWidth>
        <SearchForm placeholder="search on typing..." />
      </VariantGroup>
    </VariantContainer>
  ),
};
