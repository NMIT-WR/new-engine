import type { Meta, StoryObj } from '@storybook/react'
import { CarouselTemplate } from '../../src/templates/carousel'
import placeholderLandscape from '../assets/placeholder-landscape.webp'
import placeholderProduct from '../assets/placeholder-product.webp'
import placeholderSquare from '../assets/placeholder-square.webp'

const meta: Meta<typeof CarouselTemplate> = {
  title: 'Templates/CarouselTemplate',
  component: CarouselTemplate,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A ready-to-use carousel template with props-based API.
          This template provides a simplified interface for the Carousel compound component,
          making it ideal for Storybook controls and rapid prototyping.

          Part of the templates layer in atomic design architecture.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    slides: {
      control: 'object',
      description: 'Array of carousel slides with id, src, alt, and optional content',
      table: {
        category: 'Content',
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Size variant',
      table: {
        category: 'Appearance',
      },
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none'],
      description: 'How images fit within slides',
      table: {
        category: 'Appearance',
      },
    },
    aspectRatio: {
      control: 'select',
      options: ['square', 'landscape', 'portrait', 'wide', 'none'],
      description: 'Aspect ratio of slides',
      table: {
        category: 'Appearance',
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Carousel orientation',
      table: {
        category: 'Layout',
      },
    },
    showControls: {
      control: 'boolean',
      description: 'Show previous/next navigation buttons',
      table: {
        category: 'Controls',
      },
    },
    showIndicators: {
      control: 'boolean',
      description: 'Show slide indicators',
      table: {
        category: 'Controls',
      },
    },
    showAutoplay: {
      control: 'boolean',
      description: 'Show autoplay control button',
      table: {
        category: 'Controls',
      },
    },
    loop: {
      control: 'boolean',
      description: 'Enable infinite loop',
      table: {
        category: 'Behavior',
      },
    },
    autoplay: {
      control: 'boolean',
      description: 'Enable autoplay',
      table: {
        category: 'Behavior',
      },
    },
    allowMouseDrag: {
      control: 'boolean',
      description: 'Allow mouse drag to navigate',
      table: {
        category: 'Behavior',
      },
    },
    slidesPerPage: {
      control: 'number',
      description: 'Number of slides visible per page',
      table: {
        category: 'Behavior',
      },
    },
    onPageChange: {
      action: 'page-changed',
      table: {
        category: 'Events',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CarouselTemplate>

const defaultSlides = [
  {
    id: 'slide-1',
    src: placeholderProduct,
    alt: 'Product 1',
  },
  {
    id: 'slide-2',
    src: placeholderSquare,
    alt: 'Product 2',
  },
  {
    id: 'slide-3',
    src: placeholderLandscape,
    alt: 'Product 3',
  },
  {
    id: 'slide-4',
    src: placeholderProduct,
    alt: 'Product 4',
  },
]

export const Default: Story = {
  args: {
    slides: defaultSlides,
    size: 'md',
    objectFit: 'cover',
    aspectRatio: 'square',
    orientation: 'horizontal',
    loop: true,
    autoplay: false,
    showControls: true,
    showIndicators: true,
    showAutoplay: false,
    allowMouseDrag: true,
    slidesPerPage: 1,
  },
}

export const Playground: Story = {
  name: '🎮 Interactive Playground',
  args: {
    slides: [
      ...defaultSlides,
      {
        id: 'slide-5',
        src: placeholderSquare,
        alt: 'Product 5',
      },
    ],
    size: 'lg',
    objectFit: 'cover',
    aspectRatio: 'landscape',
    orientation: 'horizontal',
    loop: true,
    autoplay: true,
    showControls: true,
    showIndicators: true,
    showAutoplay: true,
    allowMouseDrag: true,
    slidesPerPage: 1,
  },
}
