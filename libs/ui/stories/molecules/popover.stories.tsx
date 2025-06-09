import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Popover } from '../../src/molecules/popover'
import { Button } from '../../src/atoms/button'
import { Input } from '../../src/atoms/input'
import { Label } from '../../src/atoms/label'
import { Icon } from '../../src/atoms/icon'

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    trigger: 'Click me',
    children: (
      <div className="w-64">
        <p>This is a basic popover with some content inside.</p>
      </div>
    ),
    placement: 'bottom',
    size: 'md',
  },
}

export const WithTitleAndDescription: Story = {
  args: {
    trigger: 'Open popover',
    title: 'Popover Title',
    description: 'This is a helpful description that provides more context.',
    children: (
      <div className="mt-4">
        <p>Additional content can go here.</p>
      </div>
    ),
    showCloseButton: true,
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover
        trigger="Small"
        size="sm"
        title="Small Popover"
        description="This is a small popover"
      >
        <div className="mt-2">
          <p className="text-xs">Small content</p>
        </div>
      </Popover>
      
      <Popover
        trigger="Medium"
        size="md"
        title="Medium Popover"
        description="This is a medium popover"
      >
        <div className="mt-2">
          <p>Medium content</p>
        </div>
      </Popover>
      
      <Popover
        trigger="Large"
        size="lg"
        title="Large Popover"
        description="This is a large popover"
      >
        <div className="mt-2">
          <p>Large content</p>
        </div>
      </Popover>
    </div>
  ),
}

export const DifferentPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-20">
      <Popover trigger="Top Start" placement="top-start">
        <div className="w-32">Top Start</div>
      </Popover>
      <Popover trigger="Top" placement="top">
        <div className="w-32">Top</div>
      </Popover>
      <Popover trigger="Top End" placement="top-end">
        <div className="w-32">Top End</div>
      </Popover>
      
      <Popover trigger="Left" placement="left">
        <div className="w-32">Left</div>
      </Popover>
      <div className="flex justify-center">
        <Popover trigger="Center" placement="bottom">
          <div className="w-32">Center (Bottom)</div>
        </Popover>
      </div>
      <Popover trigger="Right" placement="right">
        <div className="w-32">Right</div>
      </Popover>
      
      <Popover trigger="Bottom Start" placement="bottom-start">
        <div className="w-32">Bottom Start</div>
      </Popover>
      <Popover trigger="Bottom" placement="bottom">
        <div className="w-32">Bottom</div>
      </Popover>
      <Popover trigger="Bottom End" placement="bottom-end">
        <div className="w-32">Bottom End</div>
      </Popover>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)} variant="secondary" size="sm">
            Open Popover
          </Button>
          <Button onClick={() => setOpen(false)} variant="secondary" size="sm">
            Close Popover
          </Button>
        </div>
        
        <Popover
          trigger="Controlled Popover"
          open={open}
          onOpenChange={setOpen}
          title="Controlled Popover"
          description="This popover is controlled by external state"
        >
          <div className="mt-4">
            <p>The popover is {open ? 'open' : 'closed'}.</p>
            <Button 
              onClick={() => setOpen(false)} 
              size="sm" 
              variant="secondary"
              className="mt-2"
            >
              Close from inside
            </Button>
          </div>
        </Popover>
      </div>
    )
  },
}

export const WithForm: Story = {
  args: {
    trigger: 'Edit Profile',
    title: 'Edit Profile',
    children: (
      <form className="mt-4 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input size='sm' className='px-2 py-2' id="name" placeholder="Enter your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input size='sm' className='px-2 py-2' id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">Save</Button>
        </div>
      </form>
    ),
  },
}

export const CustomTrigger: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover
        trigger={
          <div className="flex items-center gap-2">
            <Icon icon="token-icon-info" size="sm" />
            <span>Info</span>
          </div>
        }
        triggerClassName="flex items-center gap-2 px-4 py-2 bg-info text-info-fg rounded-md hover:bg-info/90"
      >
        <div className="w-64">
          <p>This popover uses a custom trigger with an icon.</p>
        </div>
      </Popover>
      
      <Popover
        trigger={
          <div className="p-2 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted">Click this custom area</p>
          </div>
        }
        triggerClassName="hover:border-primary focus:border-primary"
      >
        <div className="w-64">
          <p>This popover uses a completely custom trigger element.</p>
        </div>
      </Popover>
    </div>
  ),
}

export const WithoutArrow: Story = {
  args: {
    trigger: 'No Arrow',
    showArrow: false,
    children: (
      <div className="w-64">
        <p>This popover doesn't have an arrow pointing to the trigger.</p>
      </div>
    ),
  },
}

export const Modal: Story = {
  args: {
    trigger: 'Open Modal Popover',
    modal: true,
    title: 'Modal Popover',
    description: 'This popover acts as a modal - it traps focus and blocks interactions outside.',
    showCloseButton: true,
    closeOnInteractOutside: false,
    children: (
      <div className="mt-4">
        <p>Try clicking outside - it won't close!</p>
        <p className="mt-2 text-sm text-muted">Press Escape or use the close button to dismiss.</p>
      </div>
    ),
  },
}

export const AsyncContent: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<string | null>(null)
    
    const loadData = async () => {
      setLoading(true)
      setData(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setData('Data loaded successfully!')
      setLoading(false)
    }
    
    return (
      <Popover
        trigger="Load Async Content"
        onOpenChange={(open) => {
          if (open) {
            loadData()
          }
        }}
      >
        <div className="w-64 min-h-[100px] flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-2">
              <Icon icon="token-icon-spinner" size="sm" className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : data ? (
            <div className="text-center">
              <Icon icon="token-icon-check" size="lg" color="success" className="mx-auto mb-2" />
              <p>{data}</p>
            </div>
          ) : (
            <p>Waiting to load...</p>
          )}
        </div>
      </Popover>
    )
  },
}

export const NestedPopovers: Story = {
  render: () => (
    <Popover
      trigger="Level 1"
      title="First Level"
      placement="bottom"
    >
      <div className="mt-4 space-y-4">
        <p>This is the first level popover.</p>
        
        <Popover
          trigger="Open Level 2"
          title="Second Level"
          placement="right"
          size="sm"
        >
          <div className="mt-4 space-y-4">
            <p className="text-sm">This is nested inside the first popover.</p>
            
            <Popover
              trigger="Open Level 3"
              title="Third Level"
              placement="right"
              size="sm"
            >
              <div className="mt-4">
                <p className="text-sm">This is the deepest level!</p>
              </div>
            </Popover>
          </div>
        </Popover>
      </div>
    </Popover>
  ),
}

export const LongContent: Story = {
  args: {
    trigger: 'View Details',
    title: 'Detailed Information',
    showCloseButton: true,
    children: (
      <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
        <p>This popover contains a lot of content that might need scrolling.</p>
        
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-3 bg-muted rounded">
            <h4 className="font-semibold">Section {i + 1}</h4>
            <p className="text-sm mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
        
        <p className="text-sm text-muted">End of content</p>
      </div>
    ),
  },
}

export const NonPortalled: Story = {
  args: {
    trigger: 'Non-Portalled',
    portalled: false,
    children: (
      <div className="w-64">
        <p>This popover is rendered in place, not in a portal.</p>
        <p className="text-sm text-muted mt-2">
          Useful when you need the popover to be clipped by a parent container.
        </p>
      </div>
    ),
  },
}