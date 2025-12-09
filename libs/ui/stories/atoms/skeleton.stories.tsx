import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Skeleton } from '../../src/atoms/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton components provide loading placeholders while content is being fetched. Supports pulse animation, accessibility, and compound pattern for different shapes.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

// ===== BASIC USAGE =====

export const Basic: Story = {
  render: () => <Skeleton className="h-20 w-64" />,
}

export const WithContent: Story = {
  render: () => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsLoaded(!isLoaded)}
          className="px-4 py-2 bg-primary text-white rounded"
          type="button"
        >
          Toggle Loaded State
        </button>
        <Skeleton isLoaded={isLoaded} className="h-20 w-64">
          <div className="h-20 w-64 bg-primary text-white flex items-center justify-center rounded">
            ✨ Content loaded!
          </div>
        </Skeleton>
      </div>
    )
  },
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-gray-600">Primary (default)</p>
        <Skeleton variant="primary" className="h-20 w-64" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Secondary</p>
        <Skeleton variant="secondary" className="h-20 w-64" />
      </div>
    </div>
  ),
}

// ===== CIRCLE VARIANTS =====

export const CircleSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <div className="text-center">
        <Skeleton.Circle size="sm" />
        <p className="mt-2 text-xs">sm (32px)</p>
      </div>
      <div className="text-center">
        <Skeleton.Circle size="md" />
        <p className="mt-2 text-xs">md (48px)</p>
      </div>
      <div className="text-center">
        <Skeleton.Circle size="lg" />
        <p className="mt-2 text-xs">lg (64px)</p>
      </div>
      <div className="text-center">
        <Skeleton.Circle size="xl" />
        <p className="mt-2 text-xs">xl (96px)</p>
      </div>
    </div>
  ),
}

export const CircleWithAvatar: Story = {
  render: () => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsLoaded(!isLoaded)}
          className="px-4 py-2 bg-primary text-white rounded"
          type="button"
        >
          Toggle Avatar
        </button>
        <Skeleton.Circle size="lg" isLoaded={isLoaded}>
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="User avatar"
            className="rounded-full size-16"
          />
        </Skeleton.Circle>
      </div>
    )
  },
}

// ===== TEXT VARIANTS =====

export const TextBasic: Story = {
  render: () => <Skeleton.Text />,
}

export const TextCustomLines: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-gray-600">3 lines (default)</p>
        <Skeleton.Text noOfLines={3} />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">5 lines</p>
        <Skeleton.Text noOfLines={5} />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">1 line</p>
        <Skeleton.Text noOfLines={1} />
      </div>
    </div>
  ),
}

export const TextSpacing: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-gray-600">Small spacing</p>
        <Skeleton.Text spacing="sm" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Medium spacing (default)</p>
        <Skeleton.Text spacing="md" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Large spacing</p>
        <Skeleton.Text spacing="lg" />
      </div>
    </div>
  ),
}

export const TextLastLineWidth: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-gray-600">80% last line (default)</p>
        <Skeleton.Text lastLineWidth="80%" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">90% last line</p>
        <Skeleton.Text lastLineWidth="90%" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">60% last line</p>
        <Skeleton.Text lastLineWidth="60%" />
      </div>
    </div>
  ),
}

// ===== RECTANGLE VARIANTS =====

export const RectangleAspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="mb-2 text-sm text-gray-600">16:9 (Video)</p>
        <Skeleton.Rectangle aspectRatio="16/9" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">4:3</p>
        <Skeleton.Rectangle aspectRatio="4/3" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">1:1 (Square)</p>
        <Skeleton.Rectangle aspectRatio="1/1" />
      </div>
    </div>
  ),
}

export const RectangleFixedDimensions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-gray-600">Fixed height: 200px</p>
        <Skeleton.Rectangle height="200px" />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">Fixed width: 300px</p>
        <Skeleton.Rectangle width="300px" height="100px" />
      </div>
    </div>
  ),
}

// ===== COMPOSITION EXAMPLES =====

export const ProductCardSkeleton: Story = {
  name: '🛍️ Product Card',
  render: () => (
    <div className="w-80 border p-4 rounded-lg">
      <Skeleton.Rectangle aspectRatio="1/1" className="mb-4" />
      <Skeleton.Text noOfLines={2} spacing="sm" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  ),
}

export const UserProfileSkeleton: Story = {
  name: '👤 User Profile',
  render: () => (
    <div className="flex gap-4 p-4 border rounded-lg max-w-md">
      <Skeleton.Circle size="lg" />
      <div className="flex-1">
        <Skeleton.Text noOfLines={3} />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  ),
}

export const FeedSkeleton: Story = {
  name: '📰 Feed Item',
  render: () => (
    <div className="space-y-4 max-w-xs">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border p-4 rounded-lg">
          <div className="flex gap-3 mb-4">
            <Skeleton.Circle size="md" />
            <div className="flex-1">
              <Skeleton.Text noOfLines={2} spacing="sm" />
            </div>
          </div>
          <Skeleton.Rectangle aspectRatio="16/9" className="mb-3" />
          <Skeleton.Text noOfLines={3} />
        </div>
      ))}
    </div>
  ),
}

// ===== ACCESSIBILITY =====

export const ReducedMotion: Story = {
  name: '♿ Reduced Motion',
  parameters: {
    docs: {
      description: {
        story:
          'This story shows what the skeleton would look like with reduced motion enabled (without having to enable it)',
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-sm text-yellow-800">
          💡 <strong>Accessibility:</strong> When users enable "Reduce motion"
            in their OS, animations automatically switch to the static state shown below.
        </p>
      </div>
      <Skeleton className="h-20 w-64 force-reduced-motion" />
      <Skeleton.Text noOfLines={3} className="force-reduced-motion" />
      <Skeleton.Circle size="lg" className="force-reduced-motion" />
    </div>
  ),
}

export const AriaLabels: Story = {
  name: '♿ ARIA Labels',
  parameters: {
    docs: {
      description: {
        story:
          'Skeletons include proper ARIA attributes for screen readers: `aria-busy="true"` and `aria-label="Loading content"`.',
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <p className="text-sm text-blue-800">
          🔊 Screen readers will recognize the loading state via aria-busy attribute.
        </p>
      </div>
      <Skeleton className="h-20 w-64" />
    </div>
  ),
}
