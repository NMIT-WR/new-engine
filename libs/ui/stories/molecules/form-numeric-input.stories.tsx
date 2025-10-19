import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { NumericInput } from '../../src/atoms/numeric-input'
import { FormNumericInput } from '../../src/molecules/form-numeric-input'

const meta: Meta<typeof FormNumericInput> = {
  title: 'Molecules/FormNumericInput',
  component: FormNumericInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Form wrapper for NumericInput. Provides Label, validation state, and help text while maintaining full compound pattern flexibility.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormNumericInput>

// Default - Basic usage with vertical triggers
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(0)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// With Error - Shows validation error state
export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState(150)
    const isInvalid = value < 0 || value > 100

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-error"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          validateStatus={isInvalid ? 'error' : 'default'}
          helpText={isInvalid ? 'Value must be between 0 and 100' : undefined}
          allowOverflow
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// With Help Text - Shows help text without error
export const WithHelpText: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-help"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          helpText="Enter a value between 0 and 100"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// With Extra Text - Shows additional helper text
export const WithExtraText: Story = {
  render: () => {
    const [value, setValue] = useState(25)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-extra"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          helpText="Enter a value between 0 and 100"
          extraText="This value will be used in your order"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// Required Field
export const Required: Story = {
  render: () => {
    const [value, setValue] = useState(0)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-required"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          required
          helpText="This field is required"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// Disabled State
export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-disabled"
          label="Quantity"
          defaultValue={42}
          disabled
          helpText="This field is disabled"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// Horizontal Layout - Triggers beside input
export const HorizontalLayout: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-horizontal"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          helpText="Horizontal layout example"
        >
          <div className="flex gap-xs">
            <NumericInput.DecrementTrigger
              className="bg-overlay"
              icon="icon-[mdi--minus]"
            />
            <NumericInput.Control className="flex-1">
              <NumericInput.Input />
            </NumericInput.Control>
            <NumericInput.IncrementTrigger
              className="bg-overlay"
              icon="icon-[mdi--plus]"
            />
          </div>
        </FormNumericInput>
      </div>
    )
  },
}

// Without Triggers - Keyboard and wheel control only
export const WithoutTriggers: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-no-triggers"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          allowMouseWheel
          helpText="Use arrow keys or mouse wheel to change value"
        >
          <NumericInput.Control>
            <NumericInput.Input />
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// With Scrubber - Drag to change value
export const WithScrubber: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-scrubber"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={5}
          helpText="Drag left/right on the input to change value"
        >
          <NumericInput.Control>
            <NumericInput.Scrubber />
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// Custom Button Props - Shows Button customization
export const CustomButtonProps: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-custom"
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          helpText="Custom styled increment/decrement buttons"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger
                variant="secondary"
                theme="solid"
              />
              <NumericInput.DecrementTrigger
                variant="danger"
                theme="outlined"
              />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// All Sizes - Shows all size variants
export const AllSizes: Story = {
  render: () => {
    const [value1, setValue1] = useState(10)
    const [value2, setValue2] = useState(20)
    const [value3, setValue3] = useState(30)

    return (
      <div className="flex flex-col gap-lg">
        <div className="w-md">
          <FormNumericInput
            id="quantity-sm"
            label="Small Size"
            size="sm"
            value={value1}
            onChange={setValue1}
            min={0}
            max={100}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </FormNumericInput>
        </div>

        <div className="w-md">
          <FormNumericInput
            id="quantity-md"
            label="Medium Size"
            size="md"
            value={value2}
            onChange={setValue2}
            min={0}
            max={100}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </FormNumericInput>
        </div>

        <div className="w-md">
          <FormNumericInput
            id="quantity-lg"
            label="Large Size"
            size="lg"
            value={value3}
            onChange={setValue3}
            min={0}
            max={100}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </FormNumericInput>
        </div>
      </div>
    )
  },
}

// With Precision - Decimal values
export const WithPrecision: Story = {
  render: () => {
    const [value, setValue] = useState(3.14)

    return (
      <div className="w-md">
        <FormNumericInput
          id="quantity-precision"
          label="Pi Approximation"
          value={value}
          onChange={setValue}
          min={0}
          max={10}
          step={0.1}
          precision={2}
          helpText="Supports 2 decimal places"
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </FormNumericInput>
      </div>
    )
  },
}

// Complex Demo - Full featured
export const ComplexDemo: Story = {
  render: () => {
    const [value, setValue] = useState(50)
    const isInvalid = value < 0 || value > 100

    return (
      <div className="flex flex-col gap-md w-lg">
        <div className="w-md">
          <FormNumericInput
            id="quantity-complex"
            label="Product Quantity"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            step={5}
            required
            validateStatus={isInvalid ? 'error' : 'default'}
            helpText={
              isInvalid
                ? 'Value must be between 0 and 100'
                : 'Adjust quantity using buttons, arrow keys, or mouse wheel'
            }
            extraText="Minimum order quantity is 5 units"
            allowMouseWheel
            clampValueOnBlur
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </FormNumericInput>
        </div>

        <div className="bg-surface-secondary p-md rounded-md">
          <h3 className="text-fg-primary font-semibold mb-sm">Current State</h3>
          <ul className="text-fg-muted text-sm space-y-xs">
            <li>
              Value: <strong>{value}</strong>
            </li>
            <li>
              Status:{' '}
              <strong className={isInvalid ? 'text-fg-danger' : 'text-fg-success'}>
                {isInvalid ? 'Invalid' : 'Valid'}
              </strong>
            </li>
            <li>Step: 5</li>
            <li>Min: 0, Max: 100</li>
          </ul>
        </div>
      </div>
    )
  },
}
