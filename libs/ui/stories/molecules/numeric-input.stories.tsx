import type { Meta, StoryObj } from "@storybook/react";
import { NumericInput } from "../../src/molecules/numeric-input";
import { VariantGroup, VariantContainer } from "../../.storybook/decorator";

const meta: Meta<typeof NumericInput> = {
  title: "Molecules/NumericInput",
  component: NumericInput,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <VariantContainer>
        <Story />
      </VariantContainer>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumericInput>;

export const Variants: Story = {
  render: () => (
    <VariantGroup title="Variants">
      <NumericInput defaultValue={5} min={0} max={10} />
      <NumericInput defaultValue={5} min={0} max={10} />
      <NumericInput defaultValue={5} min={0} max={10} />
      <NumericInput defaultValue={5} min={0} max={10} />
    </VariantGroup>
  ),
};
