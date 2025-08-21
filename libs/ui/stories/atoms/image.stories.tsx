import type { Meta, StoryObj } from '@storybook/react'
import { Image } from '../../src/atoms/image'
import NextImage from 'next/image'
import testImg from '../assets/test-image.webp'


const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component: 'Framework-agnostic image component that accepts any image component via the `as` prop'
      }
    }
  },
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    alt: 'Mountain landscape',
    className: 'w-full max-w-md rounded-lg'
  }
}

export default meta
type Story = StoryObj<typeof Image>

// Basic usage with native img
export const Default: Story = {
  render: () => (
    <Image src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Small"
        className="w-40 h-40 object-cover rounded" />
  )
}


// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Image
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Small"
        className="w-20 h-20 object-cover rounded"
      />
      <Image
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Medium"
        className="w-32 h-32 object-cover rounded-lg"
      />
      <Image
        src="https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop"
        alt="Large"
        className="w-48 h-48 object-cover rounded-xl"
      />
    </div>
  )
}

// With Next.js Image component
export const WithNextImage: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Using Next.js Image via `as` prop:</p>
        <Image
          as={NextImage}
          src={testImg}
          alt="Next.js optimized image"
          width={200}
          height={200}
          className="rounded-lg"
          priority
          placeholder='blur'
          blurDataURL={testImg}
          unoptimized
        />
      </div>
    )
  }
}