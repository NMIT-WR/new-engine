import type { Meta, StoryObj } from '@storybook/react';
import { VariantContainer, VariantGroup } from '../../.storybook/decorator';
import { Icon } from '../../src/atoms/icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

// Basic usage
export const Basic: Story = {
  args: {
    icon: 'icon-[mdi-light--alert]',
    size: 'md',
  },
};

// All sizes
export const AllSizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes">
        <Icon icon="token-icon-error" size="xs" />
        <Icon icon="token-icon-error" size="sm" />
        <Icon icon="token-icon-error" size="md" />
        <Icon icon="token-icon-error" size="lg" />
        <Icon icon="token-icon-error" size="xl" />
      </VariantGroup>
    </VariantContainer>
  ),
};

// All colors
export const AllColors: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Colors">
        <Icon icon="token-icon-error" color="current" />
        <Icon icon="token-icon-error" color="primary" />
        <Icon icon="token-icon-error" color="secondary" />
        <Icon icon="token-icon-error" color="success" />
        <Icon icon="token-icon-error" color="danger" />
        <Icon icon="token-icon-error" color="warning" />
        <Icon icon="token-icon-error" />
        <Icon icon="token-icon-error" />
      </VariantGroup>
    </VariantContainer>
  ),
};

// Semantic tokens
export const SemanticTokens: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Semantic Icons">
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-error" size="md" />
          <span>token-icon-error</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-success" size="md" />
          <span>token-icon-success</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-warning" size="md" />
          <span>token-icon-warning</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-info" size="md" />
          <span>token-icon-info</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="icon-[mdi-light--check-circle]" size="md" />
          <span>token-icon-check-circle</span>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
};

// Component tokens
export const ComponentTokens: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Component Tokens">
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-input-error" size="md" />
          <span>token-icon-input-error</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-input-success" size="md" />
          <span>token-icon-input-success</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-input-warning" size="md" />
          <span>token-icon-input-warning</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon icon="token-icon-input-info" size="md" />
          <span>token-icon-input-info</span>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
};
