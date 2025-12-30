import type { Meta, StoryObj } from "@storybook/react"
import { VariantContainer, VariantGroup } from "../../.storybook/decorator"
import { StatusText } from "../../src/atoms/status-text"

const meta: Meta<typeof StatusText> = {
  title: "Atoms/StatusText",
  component: StatusText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "StatusText component for displaying validation and status messages with appropriate icons and colors. Supports error, success, warning, and default states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description: "Status type that determines color and icon",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Text size",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to display status icon",
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusText>

export const Default: Story = {
  args: {
    children: "This is default status text",
    status: "default",
    showIcon: false,
  },
}

export const Error: Story = {
  args: {
    children: "Invalid email format",
    status: "error",
    showIcon: true,
  },
}

export const Success: Story = {
  args: {
    children: "Username is available",
    status: "success",
    showIcon: true,
  },
}

export const Warning: Story = {
  args: {
    children: "Password is weak",
    status: "warning",
    showIcon: true,
  },
}

export const AllStatuses: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Status Variants - With Icons">
        <div className="flex flex-col gap-4">
          <StatusText status="error" showIcon>
            Invalid email format
          </StatusText>
          <StatusText status="success" showIcon>
            Username is available
          </StatusText>
          <StatusText status="warning" showIcon>
            Password is weak
          </StatusText>
          <StatusText status="default" showIcon={false}>
            This is helper text
          </StatusText>
        </div>
      </VariantGroup>

      <VariantGroup title="Status Variants - Without Icons">
        <div className="flex flex-col gap-4">
          <StatusText status="error" showIcon={false}>
            Invalid email format
          </StatusText>
          <StatusText status="success" showIcon={false}>
            Username is available
          </StatusText>
          <StatusText status="warning" showIcon={false}>
            Password is weak
          </StatusText>
          <StatusText status="default" showIcon={false}>
            This is helper text
          </StatusText>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Small">
        <div className="flex flex-col gap-4">
          <StatusText status="error" showIcon size="sm">
            Small error message
          </StatusText>
          <StatusText status="success" showIcon size="sm">
            Small success message
          </StatusText>
          <StatusText status="warning" showIcon size="sm">
            Small warning message
          </StatusText>
        </div>
      </VariantGroup>

      <VariantGroup title="Medium (Default)">
        <div className="flex flex-col gap-4">
          <StatusText status="error" showIcon size="md">
            Medium error message
          </StatusText>
          <StatusText status="success" showIcon size="md">
            Medium success message
          </StatusText>
          <StatusText status="warning" showIcon size="md">
            Medium warning message
          </StatusText>
        </div>
      </VariantGroup>

      <VariantGroup title="Large">
        <div className="flex flex-col gap-4">
          <StatusText status="error" showIcon size="lg">
            Large error message
          </StatusText>
          <StatusText status="success" showIcon size="lg">
            Large success message
          </StatusText>
          <StatusText status="warning" showIcon size="lg">
            Large warning message
          </StatusText>
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const FormValidationContext: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          className="rounded border border-red-500 px-3 py-2"
          id="email"
          placeholder="your@email.com"
          type="email"
        />
        <StatusText status="error" showIcon>
          Please enter a valid email address
        </StatusText>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm" htmlFor="username">
          Username
        </label>
        <input
          className="rounded border border-green-500 px-3 py-2"
          id="username"
          placeholder="johndoe"
          type="text"
        />
        <StatusText status="success" showIcon>
          Username is available
        </StatusText>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm" htmlFor="password">
          Password
        </label>
        <input
          className="rounded border border-yellow-500 px-3 py-2"
          id="password"
          placeholder="••••••••"
          type="password"
        />
        <StatusText status="warning" showIcon>
          Consider using a stronger password
        </StatusText>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm" htmlFor="phone">
          Phone (Optional)
        </label>
        <input
          className="rounded border border-gray-300 px-3 py-2"
          id="phone"
          placeholder="+1 (555) 123-4567"
          type="tel"
        />
        <StatusText status="default" showIcon={false}>
          We'll use this for account recovery
        </StatusText>
      </div>
    </div>
  ),
}

export const LongText: Story = {
  render: () => (
    <div className="w-80">
      <VariantContainer>
        <VariantGroup title="Long Error Message">
          <StatusText status="error" showIcon>
            Your password must contain at least 8 characters, including one
            uppercase letter, one lowercase letter, one number, and one special
            character (!@#$%^&*).
          </StatusText>
        </VariantGroup>

        <VariantGroup title="Long Success Message">
          <StatusText status="success" showIcon>
            Your account has been successfully created! We've sent a
            confirmation email to your address. Please check your inbox and
            click the verification link.
          </StatusText>
        </VariantGroup>

        <VariantGroup title="Long Warning Message">
          <StatusText status="warning" showIcon>
            This action cannot be undone. Please make sure you have backed up
            your data before proceeding. We recommend downloading a copy of your
            information first.
          </StatusText>
        </VariantGroup>
      </VariantContainer>
    </div>
  ),
}
