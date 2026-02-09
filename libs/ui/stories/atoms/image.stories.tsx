import type { Meta, StoryObj } from '@storybook/react'
import { Image } from '../../src/atoms/image'
import placeholderLandscape from '../assets/placeholder-landscape.webp'
import placeholderSquare from '../assets/placeholder-square.webp'

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component:
          'Framework-agnostic image component that accepts any image component via the `as` prop',
      },
    },
  },
  args: {
    src: placeholderLandscape,
    alt: 'Mountain landscape',
    className: 'w-full max-w-md rounded-lg',
  },
}

export default meta
type Story = StoryObj<typeof Image>

// Basic usage with native img
export const Default: Story = {
  render: () => (
    <Image
      src={placeholderSquare}
      alt="Small"
      className="h-40 w-40 rounded object-cover"
    />
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Image
        src={placeholderSquare}
        alt="Small"
        className="h-20 w-20 rounded object-cover"
      />
      <Image
        src={placeholderSquare}
        alt="Medium"
        className="h-32 w-32 rounded-lg object-cover"
      />
      <Image
        src={placeholderSquare}
        alt="Large"
        className="h-48 w-48 rounded-xl object-cover"
      />
    </div>
  ),
}
