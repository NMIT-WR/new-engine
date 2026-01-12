import type { Meta, StoryObj } from '@storybook/react'
import NextImage from 'next/image'
import { Image } from '../../src/atoms/image'
import testImg from '../assets/test-image.webp'

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
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
      type: { name: 'string', required: true },
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility',
      type: { name: 'string', required: true },
    },
    className: {
      control: 'text',
      description: 'Tailwind classes for styling (size, rounded, object-fit)',
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

export const Playground: Story = {
    render: (args) => <Image {...args} />,
  }

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

export const WithNextImage: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Using Next.js Image via `as` prop:
        </p>
        <Image
          as={NextImage}
          src={testImg}
          alt="Next.js optimized image"
          width={200}
          height={200}
          className="rounded-lg"
          priority
          placeholder="blur"
          blurDataURL={testImg}
          unoptimized
        />
      </div>
    )
  },
}
