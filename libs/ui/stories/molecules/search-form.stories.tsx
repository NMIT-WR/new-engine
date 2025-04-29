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
    layout: {
      control: "radio",
      options: ["inline", "stacked"],
      description: "Controls the layout orientation",
    },
    buttonPosition: {
      control: "radio",
      options: ["inside", "outside"],
      description: "Position of the button relative to the input",
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
    placeholder: "Search products, articles, docs...",
    buttonText: "Search",
  },
};

// Size and layout variants showcase
export const Variants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes" fullWidth>
        <SearchForm
          size="sm"
          placeholder="Small search..."
          buttonText="Search"
        />
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

      <VariantGroup title="Layouts" fullWidth>
        <SearchForm
          layout="inline"
          label="Inline with label"
          placeholder="Inline search..."
          buttonText="Search"
        />
        <SearchForm
          layout="stacked"
          label="Stacked with label"
          placeholder="Stacked search..."
          buttonText="Search"
        />
        <SearchForm layout="inline" placeholder="Icon only" buttonText="" />
      </VariantGroup>

      <VariantGroup title="Button Positions" fullWidth>
        <SearchForm buttonPosition="inside" placeholder="Button inside..." />
        <SearchForm
          buttonPosition="outside"
          placeholder="Button outside..."
          buttonText="Search"
        />
      </VariantGroup>
    </VariantContainer>
  ),
};
