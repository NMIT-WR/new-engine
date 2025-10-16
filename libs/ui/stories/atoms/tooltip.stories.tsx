import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Button } from '../../src/atoms/button'
import { Icon, type IconType } from '../../src/atoms/icon'
import { Tooltip } from '../../src/atoms/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A tooltip component built with Zag.js that provides accessible, customizable tooltips with rich positioning and interaction options.

## Features
- Accessible with proper ARIA attributes
- Customizable delays and interactions
- Rich positioning with auto-flip
- Interactive mode for complex content
- Multiple close triggers
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Core
    content: {
      control: 'text',
      description: 'Content to display in the tooltip',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the tooltip',
    },

    // Timing & Interaction
    openDelay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
      description: 'Delay before tooltip opens (ms)',
    },
    closeDelay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
      description: 'Delay before tooltip closes (ms)',
    },
    interactive: {
      control: 'boolean',
      description: 'Allow hovering over tooltip content',
    },

    // Position
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
      ],
      description: 'Where tooltip appears relative to trigger',
    },
    gutter: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
      description: 'Minimum distance from screen edges',
    },
    flip: {
      control: 'boolean',
      description: "Auto-flip to opposite side if doesn't fit",
    },
    sameWidth: {
      control: 'boolean',
      description: 'Match trigger element width',
    },
    strategy: {
      control: { type: 'select' },
      options: ['absolute', 'fixed'],
      description: 'CSS positioning strategy',
    },

    // State & Behavior
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable tooltip functionality',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close on ESC key press',
    },
    closeOnPointerDown: {
      control: 'boolean',
      description: 'Close on any pointer down',
    },
    closeOnScroll: {
      control: 'boolean',
      description: 'Close when page scrolls',
    },
    closeOnClick: {
      control: 'boolean',
      description: 'Close on any click',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// === BASIC EXAMPLES ===

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip!',
    children: <Button variant="primary">Hover me</Button>,
  },
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Tooltip Sizes">
        <Tooltip content="Small tooltip" size="sm">
          <Button size="sm">Small</Button>
        </Tooltip>
        <Tooltip content="Medium tooltip (default)" size="md">
          <Button size="md">Medium</Button>
        </Tooltip>
        <Tooltip content="Large tooltip with more content" size="lg">
          <Button size="lg">Large</Button>
        </Tooltip>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const WithIcon: Story = {
  args: {
    content: 'Get help and support',
    children: (
      <Icon size="lg" icon="icon-[mdi--help-circle-outline]" color="primary" />
    ),
    placement: 'top',
  },
}

// === CONTENT VARIATIONS ===

export const RichContent: Story = {
  args: {
    content: (
      <div className="space-y-2">
        <div className="font-semibold">User Profile</div>
        <div className="text-sm opacity-80">
          View and edit your profile settings
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-primary px-2 py-1 text-xs">Edit</button>
          <button className="rounded bg-secondary px-2 py-1 text-xs">
            View
          </button>
        </div>
      </div>
    ),
    interactive: true,
    children: <Button variant="secondary">Rich Content</Button>,
  },
}

export const WithLinks: Story = {
  args: {
    content: (
      <div>
        Learn more in our{' '}
        <a
          href="#"
          className="text-primary underline hover:no-underline"
          onClick={(e) => e.preventDefault()}
        >
          documentation
        </a>
      </div>
    ),
    interactive: true,
    placement: 'top',
    children: <Icon icon="icon-[mdi--information]" />,
  },
}

// === PLACEMENT EXAMPLES ===

export const AllPlacements: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Top Placements">
        <Tooltip content="Top start" placement="top-start">
          <Button size="sm" className="w-48">
            ↖ top-start
          </Button>
        </Tooltip>
        <Tooltip content="Top end" placement="top-end">
          <Button size="sm" className="w-48">
            ↗ top-end
          </Button>
        </Tooltip>
      </VariantGroup>

      <VariantGroup title="Side Placements">
        <Tooltip content="Left start" placement="left-start">
          <Button size="sm" className="h-24">
            ← left-start
          </Button>
        </Tooltip>

        <Tooltip content="Left end" placement="left-end">
          <Button size="sm" className="h-24">
            ← left-end
          </Button>
        </Tooltip>
        <Tooltip content="Right start" placement="right-start">
          <Button size="sm" className="h-24">
            right-start →
          </Button>
        </Tooltip>

        <Tooltip content="Right end" placement="right-end">
          <Button size="sm" className="h-24">
            right-end →
          </Button>
        </Tooltip>
      </VariantGroup>

      <VariantGroup title="Bottom Placements">
        <Tooltip content="Bottom start" placement="bottom-start">
          <Button size="sm" className="w-48">
            ↙ bottom-start
          </Button>
        </Tooltip>

        <Tooltip content="Bottom end" placement="bottom-end">
          <Button size="sm" className="w-48">
            ↘ bottom-end
          </Button>
        </Tooltip>
      </VariantGroup>
    </VariantContainer>
  ),
}

// === POSITIONING OPTIONS ===

export const PositioningOptions: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Flip Behavior">
        <Tooltip
          content="Auto-flips if doesn't fit"
          flip={true}
          placement="top"
        >
          <Button>With Flip</Button>
        </Tooltip>
        <Tooltip
          content="Won't flip, might go offscreen"
          flip={false}
          placement="top"
        >
          <Button>No Flip</Button>
        </Tooltip>
      </VariantGroup>

      <VariantGroup title="Width Matching" fullWidth>
        <Tooltip
          content="Matches button width exactly"
          sameWidth={true}
          placement="bottom"
        >
          <Button className="w-full">
            Same Width Tooltip, LOOOOONG trigger
          </Button>
        </Tooltip>
        <Tooltip
          content="Natural content width"
          sameWidth={false}
          placement="bottom"
        >
          <Button className="w-full">Natural Width for LOOOOONG trigger</Button>
        </Tooltip>
      </VariantGroup>
    </VariantContainer>
  ),
}

// === CLOSE BEHAVIORS ===

export const CloseBehaviors: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Different Close Triggers" fullWidth>
        <div className="grid w-full grid-cols-2 gap-4">
          <Tooltip
            content="Press ESC to close"
            closeOnEscape={true}
            closeOnScroll={false}
            closeOnClick={false}
            defaultOpen={false}
          >
            <Button className="w-full">ESC to Close</Button>
          </Tooltip>

          <Tooltip
            content="Closes on any click"
            closeOnClick={true}
            closeOnScroll={false}
            closeOnEscape={false}
            defaultOpen={false}
          >
            <Button className="w-full">Click to Close</Button>
          </Tooltip>

          <Tooltip
            content="Closes when page scrolls"
            closeOnScroll={true}
            closeOnEscape={false}
            closeOnClick={false}
            defaultOpen={false}
          >
            <Button className="w-full">Scroll to Close</Button>
          </Tooltip>

          <Tooltip
            content="Standard close behavior"
            closeOnEscape={true}
            closeOnPointerDown={true}
            defaultOpen={false}
          >
            <Button className="w-full">Default Behavior</Button>
          </Tooltip>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

// === STATE MANAGEMENT ===

export const ControlledTooltip: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <VariantContainer>
        <VariantGroup title="External State Control" fullWidth>
          <div className="w-full space-y-4">
            <div className="flex justify-center gap-4">
              <Button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close' : 'Open'} Tooltip
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="secondary"
                disabled={!isOpen}
              >
                Force Close
              </Button>
            </div>

            <div className="flex justify-center">
              <Tooltip
                content="This tooltip is controlled externally"
                open={isOpen}
                onOpenChange={(details) => setIsOpen(details.open)}
                interactive={true}
              >
                <Button variant="primary">Controlled Tooltip</Button>
              </Tooltip>
            </div>

            <div className="text-center text-sm">
              Tooltip state: {isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </VariantGroup>
      </VariantContainer>
    )
  },
}

export const LongContent: Story = {
  args: {
    content: (
      <div className="max-w-xs">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </div>
    ),
    placement: 'top',
    children: <Button>Long Content</Button>,
  },
}

// === REAL-WORLD EXAMPLES ===
export const FormHelper: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Form Field Helpers" fullWidth>
        <div className="max-w-3xl space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              Password
              <Tooltip
                content="Must be at least 8 characters with uppercase, lowercase, and numbers"
                placement="right"
              >
                <Icon icon="icon-[mdi--help-circle]" />
              </Tooltip>
            </label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2"
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              API Key
              <Tooltip
                content="Found in your account settings under 'Developer Options'"
                placement="right"
              >
                <Icon icon="icon-[mdi--information]" />
              </Tooltip>
            </label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="sk-..."
            />
          </div>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const OutlineVariant: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Navigation Bar">
        <div className="flex gap-1 rounded-lg p-2">
          {[
            { icon: 'icon-[mdi--home]', label: 'Dashboard' },
            { icon: 'icon-[mdi--chart-line]', label: 'Analytics' },
            { icon: 'icon-[mdi--users]', label: 'Team Members' },
            { icon: 'icon-[mdi--settings]', label: 'Settings' },
            { icon: 'icon-[mdi--help-circle]', label: 'Help & Support' },
          ].map(({ icon, label }) => (
            <Tooltip key={label} content={label} placement="bottom" variant="outline">
              <button className="rounded p-2 transition-colors">
                <Icon icon={icon as IconType} />
              </button>
            </Tooltip>
          ))}
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const DataPreview: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Dashboard Cards" fullWidth>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            { value: '1,234', label: 'Users', change: '+12%' },
            { value: '$45.2K', label: 'Revenue', change: '+8%' },
            { value: '98.5%', label: 'Uptime', change: '+0.2%' },
          ].map(({ value, label, change }) => (
            <Tooltip
              key={label}
              content={
                <div className="text-center">
                  <div className="font-semibold">{label}</div>
                  <div className="text-2xl">{value}</div>
                  <div className="text-green-500 text-sm">
                    {change} this month
                  </div>
                </div>
              }
              interactive={true}
              placement="top"
            >
              <div className="cursor-pointer rounded-lg border p-4 transition-colors">
                <div className="text-sm">{label}</div>
                <div className="font-bold text-2xl">{value}</div>
              </div>
            </Tooltip>
          ))}
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}
