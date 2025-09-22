import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
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

// Comprehensive variant showcase
export const AllVariants: Story = {
  render: () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [modelessOpen, setModelessOpen] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [noCloseOpen, setNoCloseOpen] = useState(false)

    return (
      <VariantContainer>
        <VariantGroup title="Dialog Behaviors">
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            size="sm"
          >
            Modal Dialog
          </Button>
          <Dialog
            open={modalOpen}
            onOpenChange={({ open }) => setModalOpen(open)}
            customTrigger
            title="Modal Dialog"
            description="This is a modal dialog that blocks interaction with background content."
            actions={
              <>
                <Button
                  variant="secondary"
                  theme="outlined"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Confirm
                </Button>
              </>
            }
          >
            <p>Modal dialogs prevent interaction with the page behind them.</p>
          </Dialog>

          <Button
            onClick={() => setModelessOpen(true)}
            variant="secondary"
            size="sm"
          >
            Modeless Dialog
          </Button>
          <Dialog
            open={modelessOpen}
            onOpenChange={({ open }) => setModelessOpen(open)}
            customTrigger
            behavior="modeless"
            title="Modeless Dialog"
            description="This dialog allows interaction with background content."
            actions={
              <Button variant="primary" onClick={() => setModelessOpen(false)}>
                Close
              </Button>
            }
          >
            <p>You can still interact with the page behind this dialog.</p>
          </Dialog>
        </VariantGroup>

        <VariantGroup title="Dialog Roles">
          <Dialog
            triggerText="Standard Dialog"
            role="dialog"
            title="Standard Dialog"
            description="Regular dialog for information or forms."
          >
            <p>This is a standard dialog with default settings.</p>
          </Dialog>

          <Button onClick={() => setAlertOpen(true)} variant="danger" size="sm">
            Alert Dialog
          </Button>
          <Dialog
            open={alertOpen}
            onOpenChange={({ open }) => setAlertOpen(open)}
            customTrigger
            role="alertdialog"
            title="Confirm Action"
            description="Are you sure you want to proceed? This action cannot be undone."
            closeOnEscape={false}
            closeOnInteractOutside={false}
            actions={
              <>
                <Button
                  variant="secondary"
                  theme="outlined"
                  onClick={() => setAlertOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => setAlertOpen(false)}>
                  Delete
                </Button>
              </>
            }
          >
            <p className="text-danger">
              This will permanently delete your data.
            </p>
          </Dialog>
        </VariantGroup>

        <VariantGroup title="Close Button Variations">
          <Dialog
            triggerText="With Close Button"
            title="Standard Close"
            description="Dialog with visible close button."
            hideCloseButton={false}
          >
            <p>You can close this dialog using the X button in the corner.</p>
          </Dialog>

          <Button
            onClick={() => setNoCloseOpen(true)}
            variant="primary"
            size="sm"
          >
            No Close Button
          </Button>
          <Dialog
            open={noCloseOpen}
            onOpenChange={({ open }) => setNoCloseOpen(open)}
            customTrigger
            title="No Close Button"
            description="This dialog hides the close button."
            hideCloseButton={true}
            actions={
              <Button variant="primary" onClick={() => setNoCloseOpen(false)}>
                Done
              </Button>
            }
          >
            <p>You must use the action buttons to close this dialog.</p>
          </Dialog>
        </VariantGroup>

        <VariantGroup title="Content Variations">
          <Dialog triggerText="Title Only" title="Dialog Title Only">
            <p>Dialog with only a title, no description.</p>
          </Dialog>

          <Dialog
            triggerText="With Description"
            title="Dialog with Description"
            description="This dialog includes both a title and a description for additional context."
          >
            <p>
              The description provides more context about the dialog's purpose.
            </p>
          </Dialog>

          <Dialog triggerText="Content Only">
            <p>This dialog has no title or description, just content.</p>
          </Dialog>
        </VariantGroup>
      </VariantContainer>
    )
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
      </div>
    )
  },
}

// Drawer - Left placement
export const DrawerLeft: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="primary">
          Open Left Drawer
        </Button>
        <Dialog
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          customTrigger
          placement="left"
          size="md"
          title="Left Drawer"
          description="This is a drawer sliding in from the left side"
          actions={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-200">
            <p>Drawer content goes here.</p>
            <p>It slides in from the left edge of the screen.</p>
            <p>Perfect for navigation menus or filters.</p>
          </div>
        </Dialog>
      </>
    )
  },
}

// Drawer - Right placement
export const DrawerRight: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="primary">
          Open Right Drawer
        </Button>
        <Dialog
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          customTrigger
          placement="right"
          size="md"
          title="Right Drawer"
          description="This drawer slides in from the right"
        >
          <div className="space-y-100">
            <p>Right drawer content.</p>
            <p>Great for settings panels or additional information.</p>
            <div className="rounded bg-gray-100 p-150">
              <p className="text-fg-reverse text-sm">Example content block</p>
            </div>
          </div>
        </Dialog>
      </>
    )
  },
}

// Drawer - Top placement
export const DrawerTop: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="primary">
          Open Top Drawer
        </Button>
        <Dialog
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          customTrigger
          placement="top"
          size="sm"
          title="Notification Panel"
          hideCloseButton={false}
        >
          <div className="space-y-100">
            <div className="flex items-center gap-150 rounded p-100">
              <span>📧</span>
              <div>
                <p className="font-medium">New message</p>
                <p className="text-fg-secondary text-sm">
                  You have 3 unread messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-150 rounded p-100">
              <span>✅</span>
              <div>
                <p className="font-medium">Task completed</p>
                <p className="text-fg-secondary text-sm">
                  Your deployment is ready
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      </>
    )
  },
}

// Drawer - Bottom placement
export const DrawerBottom: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="primary">
          Open Bottom Drawer
        </Button>
        <Dialog
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          customTrigger
          placement="bottom"
          size="md"
          title="Actions"
        >
          <div className="grid grid-cols-2 gap-200">
            <Button variant="secondary" theme="outlined">
              Cancel
            </Button>
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </>
    )
  },
}

// Drawer sizes showcase
export const DrawerSizes: Story = {
  render: () => {
    const [leftXs, setLeftXs] = useState(false)
    const [leftSm, setLeftSm] = useState(false)
    const [leftMd, setLeftMd] = useState(false)
    const [leftLg, setLeftLg] = useState(false)
    const [leftXl, setLeftXl] = useState(false)
    const [leftFull, setLeftFull] = useState(false)

    return (
      <VariantContainer>
        <VariantGroup title="Left Drawer Sizes">
          <Button onClick={() => setLeftXs(true)} variant="primary" size="sm">
            XS (20rem)
          </Button>
          <Dialog
            open={leftXs}
            onOpenChange={({ open }) => setLeftXs(open)}
            customTrigger
            placement="left"
            size="xs"
            title="Extra Small Drawer"
          >
            <p>This drawer is 20rem wide</p>
          </Dialog>

          <Button onClick={() => setLeftSm(true)} variant="primary" size="sm">
            SM (24rem)
          </Button>
          <Dialog
            open={leftSm}
            onOpenChange={({ open }) => setLeftSm(open)}
            customTrigger
            placement="left"
            size="sm"
            title="Small Drawer"
          >
            <p>This drawer is 24rem wide</p>
          </Dialog>

          <Button onClick={() => setLeftMd(true)} variant="primary" size="sm">
            MD (32rem)
          </Button>
          <Dialog
            open={leftMd}
            onOpenChange={({ open }) => setLeftMd(open)}
            customTrigger
            placement="left"
            size="md"
            title="Medium Drawer"
          >
            <p>This drawer is 32rem wide</p>
          </Dialog>

          <Button onClick={() => setLeftLg(true)} variant="primary" size="sm">
            LG (40rem)
          </Button>
          <Dialog
            open={leftLg}
            onOpenChange={({ open }) => setLeftLg(open)}
            customTrigger
            placement="left"
            size="lg"
            title="Large Drawer"
          >
            <p>This drawer is 40rem wide</p>
          </Dialog>

          <Button onClick={() => setLeftXl(true)} variant="primary" size="sm">
            XL (48rem)
          </Button>
          <Dialog
            open={leftXl}
            onOpenChange={({ open }) => setLeftXl(open)}
            customTrigger
            placement="left"
            size="xl"
            title="Extra Large Drawer"
          >
            <p>This drawer is 48rem wide</p>
          </Dialog>

          <Button onClick={() => setLeftFull(true)} variant="primary" size="sm">
            Full Width
          </Button>
          <Dialog
            open={leftFull}
            onOpenChange={({ open }) => setLeftFull(open)}
            customTrigger
            placement="left"
            size="full"
            title="Full Width Drawer"
          >
            <p>This drawer takes the full screen width</p>
          </Dialog>
        </VariantGroup>
      </VariantContainer>
    )
  },
}

// Mobile menu example
export const MobileMenuDrawer: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          icon="icon-[mdi--menu]"
        >
          Open Mobile Menu
        </Button>
        <Dialog
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          customTrigger
          placement="left"
          size="sm"
          hideCloseButton={false}
        >
          <nav className="flex flex-col gap-2">
            <a href="#" className="px-200 py-100">
              Home
            </a>
            <a href="#" className="px-200 py-100">
              Products
            </a>
            <a href="#" className="px-200 py-100">
              Services
            </a>
            <a href="#" className="px-200 py-100">
              About
            </a>
            <a href="#" className="px-200 py-100">
              Contact
            </a>
            <hr className="my-2" />
            <a href="#" className="px-200 py-100">
              Settings
            </a>
            <a href="#" className="px-200 py-100">
              Sign Out
            </a>
          </nav>
        </Dialog>
      </>
    )
  },
}
