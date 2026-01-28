import type { Meta, StoryObj } from '@storybook/react'
import {
  Breadcrumb,
  type BreadcrumbItemType,
} from '../../src/molecules/breadcrumb'

const simplePath: BreadcrumbItemType[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Smartphones', href: '/products/electronics/smartphones' },
]

const withIcons: BreadcrumbItemType[] = [
  { label: 'Home', href: '/', icon: 'token-icon-home' },
  {
    label: 'Products',
    href: '/products',
    icon: 'token-icon-shopping-bag',
  },
  {
    label: 'Electronics',
    href: '/products/electronics',
    icon: 'token-icon-cpu',
  },
  {
    label: 'Smartphones',
    href: '/products/electronics/smartphones',
    icon: 'token-icon-smartphone',
  },
]

const longPath: BreadcrumbItemType[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Smartphones', href: '/products/electronics/smartphones' },
  { label: 'Apple', href: '/products/electronics/smartphones/apple' },
  { label: 'iPhone', href: '/products/electronics/smartphones/apple/iphone' },
  {
    label: 'iPhone 14',
    href: '/products/electronics/smartphones/apple/iphone/iphone-14',
  },
  {
    label: 'Pro Max',
    href: '/products/electronics/smartphones/apple/iphone/iphone-14/pro-max',
  },
]

const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A breadcrumb navigation component that shows the hierarchical path within a website.
Provides users with links to previous levels in the hierarchy and their current location.

## Features
- Simple breadcrumb trail with links
- Support for icons, custom separators and truncation
- Accessible by default (aria-* attributes)
- Responsive design
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-screen-lg bg-surface p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of breadcrumb items to display',
    },
    maxItems: {
      control: { type: 'number', min: 0 },
      description:
        'Maximum number of items to display before truncating (0 = show all)',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the breadcrumbs',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the breadcrumb navigation',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: simplePath,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium text-lg">Small</h3>
        <Breadcrumb items={simplePath} size="sm" />
      </div>

      <div>
        <h3 className="mb-2 font-medium text-lg">Medium (Default)</h3>
        <Breadcrumb items={simplePath} size="md" />
      </div>

      <div>
        <h3 className="mb-2 font-medium text-lg">Large</h3>
        <Breadcrumb items={simplePath} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Story with different sizes of breadcrumbs.',
      },
    },
  },
}

export const WithIcons: Story = {
  args: {
    items: withIcons,
  },
}

export const LongPath: Story = {
  args: {
    items: longPath,
    maxItems: 4,
  },
}

export const CustomIconsAndSeparator: Story = {
  args: {
    items: [
      {
        label: 'Home',
        href: '/',
        icon: 'icon-[mdi--home]',
        separator: 'icon-[mdi--chevron-right]',
      },
      {
        label: 'Products',
        href: '/products',
        icon: 'icon-[mdi--shopping]',
        separator: 'icon-[mdi--chevron-double-right]',
      },
      {
        label: 'Electronics',
        href: '/products/electronics',
        icon: 'icon-[mdi--computer-classic]',
        separator: 'icon-[mdi--chevron-triple-right]',
        isCurrent: true,
      },
      {
        label: 'Smartphones',
        href: '/products/electronics/smartphones',
        icon: 'icon-[mdi--smartphone]',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with custom icons for each item and different separators between items.',
      },
    },
  },
}

const veryLongPath: BreadcrumbItemType[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Computers', href: '/products/electronics/computers' },
  { label: 'Laptops', href: '/products/electronics/computers/laptops' },
  { label: 'Gaming', href: '/products/electronics/computers/laptops/gaming' },
  {
    label: 'High-End',
    href: '/products/electronics/computers/laptops/gaming/high-end',
  },
  {
    label: 'ASUS ROG',
    href: '/products/electronics/computers/laptops/gaming/high-end/asus-rog',
  },
  {
    label: 'RTX 4090',
    href: '/products/electronics/computers/laptops/gaming/high-end/asus-rog/rtx-4090',
  },
]

// Very long path pro stress test
export const VeryLongPath: Story = {
  args: {
    items: veryLongPath,
    maxItems: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Stress test with very long breadcrumb path to demonstrate ellipsis with many hidden items.',
      },
    },
  },
}

// Ellipsis s custom icons
export const EllipsisWithCustomIcons: Story = {
  args: {
    items: [
      {
        label: 'Home',
        href: '/',
        icon: 'icon-[mdi--home]',
        separator: 'icon-[mdi--chevron-right]',
      },
      {
        label: 'Category',
        href: '/category',
        icon: 'icon-[mdi--folder]',
        separator: 'icon-[mdi--chevron-double-right]',
      },
      {
        label: 'Subcategory',
        href: '/category/sub',
        icon: 'icon-[mdi--folder-open]',
      },
      {
        label: 'Product Type',
        href: '/category/sub/type',
        icon: 'icon-[mdi--tag]',
      },
      {
        label: 'Brand',
        href: '/category/sub/type/brand',
        icon: 'icon-[mdi--store]',
      },
      {
        label: 'Model',
        href: '/category/sub/type/brand/model',
        icon: 'icon-[mdi--package-variant]',
      },
      {
        label: 'Variant',
        href: '/category/sub/type/brand/model/variant',
        icon: 'icon-[mdi--palette]',
      },
    ],
    maxItems: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ellipsis functionality combined with custom icons and separators for each breadcrumb item.',
      },
    },
  },
}
