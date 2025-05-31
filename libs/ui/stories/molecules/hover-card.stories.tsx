import type { Meta, StoryObj } from '@storybook/react'
import { HoverCard } from '../../src/molecules/hover-card'
import { Button } from '../../src/atoms/button'
import { Icon } from '../../src/atoms/icon'

const meta: Meta<typeof HoverCard> = {
  title: 'Molecules/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    showArrow: {
      control: { type: 'boolean' },
    },
    openDelay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
    },
    closeDelay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <Button>Hover me</Button>,
    content: (
      <div>
        <h3 className="font-semibold mb-2">Hover Card Title</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is a simple hover card with some content.
        </p>
      </div>
    ),
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: <Button size="sm">Small hover card</Button>,
    content: (
      <div>
        <p className="text-xs">Small content with less padding</p>
      </div>
    ),
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: <Button size="lg">Large hover card</Button>,
    content: (
      <div>
        <h2 className="text-xl font-bold mb-3">Large Hover Card</h2>
        <p>This hover card has larger text and more padding.</p>
      </div>
    ),
  },
}

export const WithoutArrow: Story = {
  args: {
    showArrow: false,
    children: <Button>No arrow</Button>,
    content: (
      <div>
        <p>This hover card doesn't have an arrow pointer.</p>
      </div>
    ),
  },
}

export const CustomTrigger: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-help">
        Learn more
        <Icon icon="token-icon-info" className="w-4 h-4" />
      </span>
    ),
    content: (
      <div className="space-y-2">
        <h4 className="font-medium">Additional Information</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hover cards are great for providing additional context without cluttering the interface.
        </p>
      </div>
    ),
  },
}

export const RichContent: Story = {
  args: {
    children: <Button icon="token-icon-user">User Profile</Button>,
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Icon icon="token-icon-user" className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold">John Doe</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Button size="sm" variant="primary" className="w-full">View Profile</Button>
          <Button size="sm" variant="secondary" className="w-full">Sign Out</Button>
        </div>
      </div>
    ),
  },
}

export const DifferentPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-20">
      <HoverCard
        positioning={{ placement: 'top' }}
        content={<p>Top placement</p>}
      >
        <Button>Top</Button>
      </HoverCard>
      
      <HoverCard
        positioning={{ placement: 'right' }}
        content={<p>Right placement</p>}
      >
        <Button>Right</Button>
      </HoverCard>
      
      <HoverCard
        positioning={{ placement: 'bottom' }}
        content={<p>Bottom placement</p>}
      >
        <Button>Bottom</Button>
      </HoverCard>
      
      <HoverCard
        positioning={{ placement: 'left' }}
        content={<p>Left placement</p>}
      >
        <Button>Left</Button>
      </HoverCard>
    </div>
  ),
}

export const CustomDelays: Story = {
  args: {
    openDelay: 200,
    closeDelay: 100,
    children: <Button>Fast hover card</Button>,
    content: (
      <div>
        <p className="text-sm">This hover card opens quickly (200ms) and closes quickly (100ms)</p>
      </div>
    ),
  },
}

export const LongContent: Story = {
  args: {
    children: <Button>Long content</Button>,
    content: (
      <div className="space-y-3 max-w-xs">
        <h3 className="font-semibold">Extended Content Example</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This hover card contains a longer piece of content to demonstrate how the component handles 
          text wrapping and maintains a reasonable width constraint.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The max-width ensures the content remains readable and doesn't stretch too wide on larger screens.
        </p>
        <div className="pt-2">
          <Button size="sm" variant="primary">Learn More</Button>
        </div>
      </div>
    ),
  },
}

export const AuthenticationPrompt: Story = {
  args: {
    children: (
      <Button
        variant="tertiary"
        theme="borderless"
        size="sm"
        icon="token-icon-user"
        aria-label="Sign in"
      />
    ),
    content: (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Sign in to access your account
        </div>
        <div className="space-y-2">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Create Account
          </Button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using HoverCard for authentication prompt, similar to auth dropdown',
      },
    },
  },
}

export const TooltipStyle: Story = {
  args: {
    size: 'sm',
    openDelay: 500,
    children: (
      <Icon icon="token-icon-help" className="w-5 h-5 text-gray-500 cursor-help" />
    ),
    content: (
      <p className="text-xs max-w-[200px]">
        This is a tooltip-style hover card with minimal content and faster open delay.
      </p>
    ),
  },
}

export const InteractiveContent: Story = {
  args: {
    children: <Button>Interactive hover card</Button>,
    content: (
      <div className="space-y-3">
        <h4 className="font-medium">Interactive Elements</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You can interact with elements inside the hover card.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="primary">Accept</Button>
          <Button size="sm" variant="secondary">Decline</Button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'The hover card stays open when you move your cursor into it, allowing interaction with content',
      },
    },
  },
}