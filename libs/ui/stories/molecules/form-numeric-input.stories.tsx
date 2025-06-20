import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { FormNumericInput } from '../../src/molecules/form-numeric-input'

const meta: Meta<typeof FormNumericInput> = {
  title: 'Molecules/FormNumericInput',
  component: FormNumericInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Velikost input fieldu',
    },
    min: {
      control: 'number',
      description: 'Minimální hodnota',
    },
    max: {
      control: 'number',
      description: 'Maximální hodnota',
    },
    step: {
      control: 'number',
      description: 'Krok změny hodnoty',
    },
    precision: {
      control: 'number',
      description: 'Počet desetinných míst',
    },
    hideControls: {
      control: 'boolean',
      description: 'Skrýt increment/decrement tlačítka',
    },
    allowScrubbing: {
      control: 'boolean',
      description: 'Povolit scrubbing interakci (táhnutí myší)',
    },
    allowMouseWheel: {
      control: 'boolean',
      description: 'Povolit změnu hodnoty pomocí kolečka myši',
    },
    label: {
      control: 'text',
      description: 'Text labelu',
    },
  },
}

export default meta
type Story = StoryObj<typeof FormNumericInput>

const baseArgs = {
  min: 0,
  max: 100,
  step: 1,
}

export const Default: Story = {
  args: {
    id: 'default-numeric',
    label: 'Quantity',
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    hideControls: false,
    defaultValue: 5,
    helpText: 'Enter a quantity between 0 and 100',
  },
}

export const Basic: Story = {
  render: () => {
    const [currentValue, setCurrentValue] = useState(10)
    return (
      <VariantContainer>
        <div className="grid gap-4">
          <FormNumericInput id="size-sm" label="Size sm" size="sm" hideControls={false} {...baseArgs} />
          <FormNumericInput id="size-md" label="Size md" size="md" hideControls={false} {...baseArgs} />
          <FormNumericInput id="size-lg" label="Size lg" size="lg" hideControls={false} {...baseArgs} />
        </div>
        <div className="grid gap-4">
          <FormNumericInput id="disabled" size="sm" label="Disabled" disabled hideControls={false} {...baseArgs} />
          <FormNumericInput
            id="invalid-demo"
            size="sm"
            label="Invalid when value = 10"
            defaultValue={10}
            value={currentValue}
            onChange={(value) => setCurrentValue(value)}
            hideControls={false}
            validateStatus={currentValue === 10 ? 'error' : 'default'}
            helpText={currentValue === 10 ? 'Value cannot be 10' : 'Enter a value other than 10'}
          />
        </div>
      </VariantContainer>
    )
  },
}

export const WithDefaultValues: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Default Values">
        <FormNumericInput
          id="boundaries"
          label="Min, Max Boundaries (10, 20)"
          defaultValue={15}
          min={10}
          max={20}
          hideControls={false}
          helpText="Value must be between 10 and 20"
        />
        <FormNumericInput 
          id="custom-step"
          label="Custom Step (5)" 
          defaultValue={25} 
          step={5} 
          hideControls={false}
          helpText="Increments by 5"
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const FormattingOptions: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Formatting & Precision">
        <FormNumericInput
          id="decimal"
          label="Decimal Precision (2)"
          defaultValue={12.34}
          precision={2}
          step={0.01}
          hideControls={false}
          helpText="Supports 2 decimal places"
        />
        <FormNumericInput
          id="currency"
          label="Currency Format (CZK)"
          defaultValue={1250}
          hideControls={false}
          formatOptions={{
            style: 'currency',
            currency: 'CZK',
          }}
          helpText="Formatted as Czech Koruna"
        />
        <FormNumericInput
          id="percentage"
          label="Percentage Format"
          defaultValue={0.25}
          min={0}
          max={1}
          step={0.01}
          hideControls={false}
          formatOptions={{
            style: 'percent',
          }}
          helpText="Enter value between 0 and 1"
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const WithScrubber: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Interaction Methods">
        <FormNumericInput
          id="scrubbing"
          label="With Scrubbing (try drag)"
          allowScrubbing={true}
          hideControls={false}
          defaultValue={50}
          helpText="Click and drag to change value"
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const ValidationStates: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Validation States">
        <FormNumericInput
          id="success"
          label="Success State"
          validateStatus="success"
          defaultValue={25}
          hideControls={false}
          helpText="Valid quantity"
        />
        <FormNumericInput
          id="warning"
          label="Warning State"
          validateStatus="warning"
          defaultValue={95}
          hideControls={false}
          helpText="Stock is running low"
        />
        <FormNumericInput
          id="error"
          label="Error State"
          validateStatus="error"
          defaultValue={150}
          hideControls={false}
          helpText="Value exceeds maximum allowed"
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const WithExtraText: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="With Extra Information">
        <FormNumericInput
          id="with-extra"
          label="Product Quantity"
          defaultValue={1}
          min={1}
          max={10}
          hideControls={false}
          helpText="Choose how many items to add"
          extraText="Limited to 10 items per order"
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const FormExample: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState(29.99)
    
    return (
      <VariantContainer>
        <form className="space-y-4 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Order Form</h3>
          
          <FormNumericInput
            id="order-quantity"
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={100}
            required
            hideControls={false}
            helpText="Minimum order quantity is 1"
          />
          
          <FormNumericInput
            id="unit-price"
            label="Unit Price"
            value={price}
            onChange={setPrice}
            min={0}
            step={0.01}
            precision={2}
            hideControls={false}
            formatOptions={{
              style: 'currency',
              currency: 'USD',
            }}
            helpText="Price per unit in USD"
          />
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Total: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(quantity * price)}
            </p>
          </div>
        </form>
      </VariantContainer>
    )
  },
}
