import type { Meta, StoryObj } from '@storybook/react'
import { Image } from '../../src/atoms/image'

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
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
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
      src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
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
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Small"
        className="h-20 w-20 rounded object-cover"
      />
      <Image
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Medium"
        className="h-32 w-32 rounded-lg object-cover"
      />
      <Image
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Large"
        className="h-48 w-48 rounded-xl object-cover"
      />
    </div>
  ),
}
