import type { Meta, StoryObj } from '@storybook/react';
import { VariantContainer, VariantGroup } from '../../.storybook/decorator';
import { Textarea } from '../../src/atoms/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/**
 * Displays the available sizes for the textarea component.
 */
export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes">
        <Textarea size="sm" placeholder="Small textarea" />
        <Textarea placeholder="Medium textarea (default)" />
        <Textarea size="lg" placeholder="Large textarea" />
      </VariantGroup>
    </VariantContainer>
  ),
};

/**
 * Shows the various validation states for visual feedback.
 */
export const ValidationStates: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Validation States">
        <Textarea variant="default" placeholder="Default state" />
        <Textarea variant="error" placeholder="Error state" />
        <Textarea variant="success" placeholder="Success state" />
        <Textarea variant="warning" placeholder="Warning state" />
        <Textarea variant="borderless" placeholder="Borderless variant" />
      </VariantGroup>
    </VariantContainer>
  ),
};

/**
 * Demonstrates additional visual and functional modifiers.
 */
export const VisualModifiers: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Shadow Variants">
        <Textarea shadow="none" placeholder="No shadow (default)" />
        <Textarea shadow="sm" placeholder="Small shadow" />
        <Textarea shadow="md" placeholder="Medium shadow" />
      </VariantGroup>
    </VariantContainer>
  ),
};

/**
 * Comprehensive overview of all key variants.
 */
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes">
        <Textarea size="sm" placeholder="Small textarea" />
        <Textarea size="md" placeholder="Medium textarea" />
        <Textarea size="lg" placeholder="Large textarea" />
      </VariantGroup>

      <VariantGroup title="Resize Modes">
        <Textarea resize="y" placeholder="Vertical resize" />
        <Textarea resize="x" placeholder="Horizontal resize" />
        <Textarea resize="none" placeholder="No resize" />
        <Textarea resize="both" placeholder="Resize both" />
      </VariantGroup>

      <VariantGroup title="Validation States">
        <Textarea variant="default" placeholder="Default state" />
        <Textarea variant="error" placeholder="Error state" />
        <Textarea variant="success" placeholder="Success state" />
        <Textarea variant="warning" placeholder="Warning state" />
        <Textarea variant="borderless" placeholder="Borderless variant" />
      </VariantGroup>

      <VariantGroup title="Interactivity">
        <Textarea placeholder="Normal state" />
        <Textarea disabled placeholder="Disabled textarea" />
        <Textarea readonly placeholder="Readonly textarea" />
      </VariantGroup>
    </VariantContainer>
  ),
};

/**
 * Practical combinations for real-world use cases.
 */
export const UseCaseCombinations: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Real-world Use Cases">
        {/* Use Case 1: Product description for admins */}
        <Textarea
          size="lg"
          lineHeight="relaxed"
          resize="y"
          scrollbar="thin"
          placeholder="Product description - admin interface"
        />

        {/* Use Case 2: Order notes with validation */}
        <Textarea
          variant="error"
          size="md"
          placeholder="Order notes with validation error"
        />

        {/* Use Case 3: Read-only display of database content */}
        <Textarea
          readonly
          variant="borderless"
          defaultValue="This is a read-only display of database content that maintains the same visual structure as editable fields."
        />

        {/* Use Case 4: Product reviews with submission status */}
        <Textarea
          shadow="sm"
          variant="success"
          placeholder="Successfully submitted product review"
        />

        {/* Use Case 5: Compact notepad */}
        <Textarea
          size="sm"
          lineHeight="compact"
          resize="both"
          shadow="md"
          placeholder="Compact notepad with resizing"
        />
      </VariantGroup>
    </VariantContainer>
  ),
};
