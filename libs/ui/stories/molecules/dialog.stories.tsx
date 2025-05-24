import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { Dialog } from '../../src/molecules/dialog'

const meta: Meta<typeof Dialog> = {
  title: 'Molecules/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog component built with Zag.js that provides accessible dialog functionality with customizable content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: { type: 'select' },
      options: ['dialog', 'alertdialog'],
      description: 'The semantic role of the dialog',
    },
    open: {
      control: { type: 'boolean' },
      description: 'Controlled open state of the dialog',
    },
    closeOnEscape: {
      control: { type: 'boolean' },
      description: 'Whether to close dialog on Escape key',
    },
    closeOnInteractOutside: {
      control: { type: 'boolean' },
      description: 'Whether to close dialog when clicking outside',
    },
    preventScroll: {
      control: { type: 'boolean' },
      description: 'Whether to prevent body scroll when open',
    },
    trapFocus: {
      control: { type: 'boolean' },
      description: 'Whether to trap focus inside dialog',
    },
    modal: {
      control: { type: 'boolean' },
      description:
        'Whether dialog is modal (blocks interaction with background)',
    },
    hideCloseButton: {
      control: { type: 'boolean' },
      description: 'Whether to hide the close button',
    },
    triggerText: {
      control: { type: 'text' },
      description: 'Text for default trigger button',
    },
    title: {
      control: { type: 'text' },
      description: 'Dialog title',
    },
    description: {
      control: { type: 'text' },
      description: 'Dialog description/subtitle',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic dialog example
export const Default: Story = {
  args: {
    triggerText: 'Open Dialog',
    title: 'Edit Profile',
    description:
      'Make changes to your profile here. Click save when you are done.',
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right font-medium text-sm">
            Name
          </label>
          <input
            id="name"
            defaultValue="John Doe"
            className="col-span-3 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="username" className="text-right font-medium text-sm">
            Username
          </label>
          <input
            id="username"
            defaultValue="@johndoe"
            className="col-span-3 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    ),
    actions: (
      <>
        <Button variant="secondary" theme="outlined">
          Cancel
        </Button>
        <Button variant="primary">Save Changes</Button>
      </>
    ),
  },
}

// Alert dialog for destructive actions
export const AlertDialog: Story = {
  args: {
    role: 'alertdialog',
    triggerText: 'Delete Account',
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    closeOnEscape: false,
    closeOnInteractOutside: false,
    actions: (
      <>
        <Button variant="secondary" theme="outlined">
          Cancel
        </Button>
        <Button variant="danger">Yes, delete account</Button>
      </>
    ),
  },
}

// Dialog with custom trigger
export const CustomTrigger: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div>
        <Button
          size="sm"
          variant="tertiary"
          theme="light"
          onClick={() => setIsOpen(true)}
        >
          Custom Trigger
        </Button>
        <Dialog
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
          customTrigger={true}
          title="Custom Trigger"
          description="This dialog was opened with a custom trigger component."
          children={<p>Content opened by custom trigger.</p>}
        />
      </div>
    )
  },
}

// Controlled dialog example
export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="space-y-4">
        <Button onClick={() => setIsOpen(true)}>Open Controlled Dialog</Button>
        <p className="text-gray-600 text-sm">
          Dialog is currently: {isOpen ? 'Open' : 'Closed'}
        </p>

        <Dialog
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
          title="Controlled Dialog"
          description="This dialog's state is controlled by a parent component."
          children={
            <div className="space-y-2">
              <p>The open state is managed externally.</p>
              <p>
                Current state: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
              </p>
            </div>
          }
          actions={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Close from Action
            </Button>
          }
        />
      </div>
    )
  },
}

// Dialog with rich content
export const RichContent: Story = {
  args: {
    triggerText: 'View Details',
    title: 'Product Information',
    description: 'Complete details about the selected product.',
    children: (
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
            <span className="text-gray-500 text-sm">Image</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Premium Headphones</h3>
            <p className="text-gray-600">
              High-quality wireless headphones with noise cancellation
            </p>
            <p className="mt-2 font-bold text-2xl text-green-600">$299.99</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="mb-2 font-semibold">Features</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-600 text-sm">
            <li>Active noise cancellation</li>
            <li>30-hour battery life</li>
            <li>Premium leather ear cups</li>
            <li>Wireless and wired connectivity</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <h4 className="mb-2 font-semibold">Reviews</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm">4.8 out of 5 stars</span>
            </div>
            <p className="text-gray-600 text-sm">Based on 2,847 reviews</p>
          </div>
        </div>
      </div>
    ),
    actions: (
      <>
        <Button variant="secondary" theme="outlined">
          Add to Wishlist
        </Button>
        <Button variant="primary">Add to Cart</Button>
      </>
    ),
  },
}

// Minimal dialog
export const Minimal: Story = {
  args: {
    triggerText: 'Simple Dialog',
    title: 'Simple Message',
    children: <p>This is a minimal dialog with just basic content.</p>,
  },
}

// Test different behaviors
export const BehaviorTests: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Dialog
          triggerText="No Escape Close"
          title="Escape Disabled"
          description="This dialog won't close when you press Escape."
          closeOnEscape={false}
          children={<p>Press Escape - nothing happens!</p>}
        />

        <Dialog
          triggerText="No Outside Click"
          title="Outside Click Disabled"
          description="This dialog won't close when you click outside."
          closeOnInteractOutside={false}
          children={<p>Click outside - nothing happens!</p>}
        />

        <Dialog
          triggerText="Allow Body Scroll"
          title="Scroll Allowed"
          description="Body scroll is not prevented when this dialog is open."
          preventScroll={false}
          children={<p>Body scroll is still enabled!</p>}
        />

        <Dialog
          triggerText="Non-Modal"
          title="Non-Modal Dialog"
          description="This dialog doesn't block interaction with background."
          modal={false}
          children={<p>You can interact with the background!</p>}
        />
      </div>
    )
  },
}
