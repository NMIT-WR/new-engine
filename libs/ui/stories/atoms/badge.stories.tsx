import type { Meta, StoryObj } from '@storybook/react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Badge, type BadgeProps } from '../../src/atoms/badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'outline', 'dynamic'],
    },
    children: {
      control: 'text',
    },
    bgColor: {
      control: 'color',
      description: 'Background color for dynamic variant',
      if: {
        arg: 'variant',
        eq: 'dynamic',
      },
    },
    fgColor: {
      control: 'color',
      description: 'Foreground color for dynamic variant',
      if: {
        arg: 'variant',
        eq: 'dynamic',
      },
    },
    borderColor: {
      control: 'color',
      description: 'Border color for dynamic variant',
      if: {
        arg: 'variant',
        eq: 'dynamic',
      },
    },
  },
}

export default meta
// ! Storybook can't infer dynamic badge props, we need to enforce manually
type Story = Omit<StoryObj<typeof meta>, 'args'> & { args: BadgeProps }

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Dynamic: Story = {
  args: {
    variant: 'dynamic',
    bgColor: '#f00',
    fgColor: '#fff',
    borderColor: '#fff500',
    children: 'Dynamic Badge',
  },
}

export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Solid themes">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="tertiary">Tertirary</Badge>
        <Badge variant="discount">Sleva 30%</Badge>
        <Badge variant="info">Odesíláme do 24h</Badge>
        <Badge variant="success">Doručeno</Badge>
        <Badge variant="warning">Poslední kusy</Badge>
        <Badge variant="danger">Nedostupné</Badge>
      </VariantGroup>
    </VariantContainer>
  ),
}
