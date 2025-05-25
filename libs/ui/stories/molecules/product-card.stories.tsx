import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from '../../src/molecules/product-card'

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['column', 'row', 'compact', 'featured', 'grid'],
      description: 'Product card layout',
    },
    buttonLayout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'stretched'],
      description: 'Button layout',
    },
    hasCartButton: {
      control: 'boolean',
      description: 'Show add to cart button',
    },
    hasDetailButton: {
      control: 'boolean',
      description: 'Show detail button',
    },
    hasWishlistButton: {
      control: 'boolean',
      description: 'Show wishlist button',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProductCard>

// Base props shared across stories
const baseArgs = {
  imageUrl: 'https://picsum.photos/200',
  name: "Men's Fox Level Up Strapback Hat",
  price: '$29.99',
  stockStatus: 'In stock (10+)',
  badges: [
    { children: 'New', variant: 'primary' },
    { children: '20% Off', variant: 'discount' },
    { children: 'Many variants', variant: 'info' },
  ],
  rating: {
    value: 4,
    maxValue: 5,
    readOnly: true,
  },
}

export const ColumnLayout: Story = {
  args: {
    ...baseArgs,
    layout: 'column',
    hasCartButton: true,
    hasDetailButton: true,
    hasWishlistButton: true,
  },
}

export const RowLayout: Story = {
  args: {
    ...baseArgs,
    layout: 'row',
    hasCartButton: true,
    numericInput: true,
  },
}
