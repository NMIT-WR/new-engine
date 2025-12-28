import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { FormInput } from '../../src/molecules/form-input'

const meta: Meta<typeof FormInput> = {
  title: 'Molecules/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    id: 'storybook-form-input',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the form input and all its child elements',
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    helpText: {
      control: 'text',
      description:
        'Helper text, validation message, or other supporting text shown below the input',
    },
    validateStatus: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation state that affects input style and helper text',
    },
    showHelpTextIcon: {
      control: 'boolean',
      description: 'Whether to show an icon with the help text',
    },
  },
}

export default meta
type Story = StoryObj<typeof FormInput>

// Basic usage
export const Basic: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helpText: 'Will be visible on your profile',
  },
}

// All variants and combinations
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Requirement States">
        <div className="w-64">
          <FormInput id="" label="Default" placeholder="Enter value" />
        </div>
        <div className="w-64">
          <FormInput
            id=""
            label="Required"
            placeholder="Enter value"
            required
          />
        </div>
        <div className="w-64">
          <FormInput id="" label="Optional" placeholder="Enter value" />
        </div>
      </VariantGroup>

      <VariantGroup title="Validation States">
        <div className="w-64">
          <FormInput
            id="default-input"
            label="Default state"
            placeholder="Enter value"
            validateStatus="default"
            helpText="This is default help text"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Success state"
            placeholder="johndoe"
            validateStatus="success"
            helpText="Username is available"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="error-input"
            label="Error state"
            placeholder="Enter email"
            validateStatus="error"
            helpText="Invalid email format"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="warning-input"
            label="Warning state"
            placeholder="Enter password"
            validateStatus="warning"
            helpText="Password is weak"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Supporting Text">
        <div className="w-64">
          <FormInput
            id="success-input"
            label="With helper text"
            placeholder="Enter value"
            helpText="This is help text below input"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="error-input"
            label="With error message"
            placeholder="Enter value"
            helpText="This is error text!"
            validateStatus="error"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Sizes">
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Small input"
            placeholder="Enter value"
            helpText="This is error text below input"
            validateStatus="error"
            size="sm"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Default input"
            placeholder="Enter value"
            helpText="This is error text below input"
            validateStatus="error"
            size="md"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Large input"
            placeholder="Enter value"
            helpText="This is error text below input"
            validateStatus="error"
            size="lg"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Special States">
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Disabled input"
            placeholder="Cannot edit"
            disabled
          />
        </div>
        <div className="w-64">
          <FormInput
            id="success-input"
            label="Read-only input"
            placeholder="Read only"
            readOnly
            value="Fixed value"
          />
        </div>
        <div className="w-64">
          <FormInput
            id="success-input"
            label="With default value"
            defaultValue="Prefilled value"
          />
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

// Validation States - Dedicated story showing all 4 validation states
export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <FormInput
        id="default-validation"
        label="Default State"
        placeholder="Enter username"
        validateStatus="default"
        helpText="This is default help text"
      />
      <FormInput
        id="error-validation"
        label="Error State"
        placeholder="Enter username"
        validateStatus="error"
        helpText="Username is already taken"
      />
      <FormInput
        id="success-validation"
        label="Success State"
        placeholder="Enter username"
        validateStatus="success"
        helpText="Username is available"
      />
      <FormInput
        id="warning-validation"
        label="Warning State"
        placeholder="Enter username"
        validateStatus="warning"
        helpText="Username contains special characters"
      />
    </div>
  ),
}

// Sizes - Dedicated story showing all size variants
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <FormInput
        id="small-size"
        label="Small Size"
        placeholder="Enter value"
        size="sm"
        helpText="Small input variant"
      />
      <FormInput
        id="medium-size"
        label="Medium Size (Default)"
        placeholder="Enter value"
        size="md"
        helpText="Medium input variant"
      />
      <FormInput
        id="large-size"
        label="Large Size"
        placeholder="Enter value"
        size="lg"
        helpText="Large input variant"
      />
    </div>
  ),
}

// Interactive validation example
export const InteractiveValidation: Story = {
  render: () => {
    return <EmailValidationExample />
  },
}

function EmailValidationExample() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = /^[^\sm@]+@[^\sm@]+\.[^\sm@]+$/.test(email)
  const showError = touched && email && !isValid
  const showSuccess = touched && email && isValid

  // Determine validation status
  const validateStatus = showError
    ? 'error'
    : showSuccess
      ? 'success'
      : 'default'

  return (
    <div className="w-80">
      <h3 className="mb-4 font-medium text-lg">Email Validation</h3>
      <FormInput
        id="success-input"
        label="Email"
        placeholder="your@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        validateStatus={validateStatus}
        helpText={
          showError
            ? 'Please enter a valid email'
            : 'Used for login and notifications'
        }
      />
      <div className="mt-6 text-sm">
        <p>
          Status:{' '}
          {touched ? (isValid ? 'Valid email' : 'Invalid email') : 'Untouched'}
        </p>
      </div>
    </div>
  )
}

// Form usage example
export const RegistrationForm: Story = {
  render: () => {
    return (
      <div className="w-96 rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 font-semibold text-xl">Account Registration</h2>

        <div className="space-y-4">
          <FormInput
            id="success-input"
            label="Full name"
            placeholder="John Doe"
            required
          />

          <FormInput
            id="success-input"
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            helpText="We'll send confirmation to this email"
          />

          <FormInput
            id="success-input"
            label="Username"
            placeholder="johndoe"
            required
            helpText="Visible to other users"
          />

          <FormInput
            id="success-input"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            helpText="Min 8 characters, 1 number, 1 special character"
          />

          <FormInput
            id="success-input"
            label="Phone number"
            type="tel"
            placeholder="+1 (XXX) XXX-XXXX"
          />
        </div>

        <div className="mt-6">
          <button
            className="rounded bg-blue-500 px-4 py-2 font-medium text-white"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </div>
    )
  },
}
