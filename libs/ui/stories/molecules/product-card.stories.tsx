import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ProductCard } from '../../src/molecules/product-card'

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    imageUrl: 'https://picsum.photos/200',
    name: 'Pánská kšiltovka Fox Level Up Strapback Hat',
    price: '999 Kč',
    stockStatus: 'Skladem více než 10 ks',
    badges: [
      { children: 'Novinka', variant: 'info' },
      { children: 'OS', variant: 'outline' },
      {
        children: 'Dynamic',
        variant: 'dynamic',
        bgColor: '#0000ff',
        fgColor: '#eef',
        borderColor: 'pink',
      },
    ],
    addToCartText: 'DO KOŠÍKU',
    onAddToCart: fn(),
  },
  argTypes: {
    imageUrl: { control: 'text' },
    name: { control: 'text' },
    price: { control: 'text' },
    stockStatus: { control: 'text' },
    badges: { control: 'object' },
    addToCartText: { control: 'text' },
    onAddToCart: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithoutBadges: Story = {
  args: {
    badges: [],
  },
}

export const CustomButtonText: Story = {
  args: {
    addToCartText: 'Add Now',
  },
}
