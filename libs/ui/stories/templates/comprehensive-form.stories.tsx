import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { FormInput } from '../../src/molecules/form-input'
import { FormCheckbox } from '../../src/molecules/form-checkbox'
import { Select } from '../../src/molecules/select'
import { Combobox } from '../../src/molecules/combobox'
import { NumericInput } from '../../src/molecules/numeric-input'
import { Textarea } from '../../src/atoms/textarea'
import { Switch } from '../../src/atoms/switch'
import { RangeSlider } from '../../src/atoms/range-slider'
import { Label } from '../../src/atoms/label'
import { Error } from '../../src/atoms/error'
import { ExtraText } from '../../src/atoms/extra-text'

const meta: Meta = {
  title: 'Templates/Comprehensive Form',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size that propagates to all form components',
    },
    validateStatus: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation state that affects all form inputs',
    },
  },
  args: {
    size: 'md',
    validateStatus: 'default',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const selectOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]

const comboboxOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
]

/**
 * Comprehensive form showcasing all form input types with consistent sizing and validation states.
 * This template helps verify that all form components have consistent visual appearance and spacing.
 */
export const AllFormInputs: Story = {
  render: ({ size, validateStatus }) => {
    const [formData, setFormData] = useState({
      textInput: '',
      email: '',
      password: '',
      textarea: '',
      select: '',
      combobox: '',
      number: 0,
      checkbox: false,
      switch: false,
      range: [25],
    })

    const helpText = validateStatus === 'error'
      ? 'This field has an error'
      : validateStatus === 'success'
      ? 'This field is valid'
      : validateStatus === 'warning'
      ? 'This field has a warning'
      : 'Helper text for this field'

    return (
      <div className="w-full space-y-6 p-6">
        <h2 className="text-2xl font-bold mb-8">Comprehensive Form - Size: {size}</h2>

        <VariantContainer>
          <VariantGroup title="Text Inputs" fullWidth>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <FormInput
                id="text-input"
                label="Text Input"
                placeholder="Enter text"
                size={size}
                validateStatus={validateStatus}
                helpText={helpText}
                value={formData.textInput}
                onChange={(e) => setFormData(prev => ({ ...prev, textInput: e.target.value }))}
              />

              <FormInput
                id="email-input"
                label="Email"
                type="email"
                placeholder="Enter email"
                size={size}
                validateStatus={validateStatus}
                helpText={helpText}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />

              <FormInput
                id="password-input"
                label="Password"
                type="password"
                placeholder="Enter password"
                size={size}
                validateStatus={validateStatus}
                helpText={helpText}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />

              <div className="flex flex-col gap-1">
                <Label htmlFor="textarea" size={size}>Textarea</Label>
                <Textarea
                  id="textarea"
                  placeholder="Enter long text"
                  size={size}
                  variant={validateStatus === 'default' ? 'default' : validateStatus}
                  value={formData.textarea}
                  onChange={(e) => setFormData(prev => ({ ...prev, textarea: e.target.value }))}
                />
                {validateStatus === 'error' ? (
                  <Error size={size}>{helpText}</Error>
                ) : (
                  <ExtraText size={size}>{helpText}</ExtraText>
                )}
              </div>
            </div>
          </VariantGroup>

          <VariantGroup title="Selection Inputs" fullWidth>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1">
                <Label size={size}>Select</Label>
                <Select
                  placeholder="Choose an option"
                  options={selectOptions}
                  size={size}
                />
                {validateStatus === 'error' ? (
                  <Error size={size}>{helpText}</Error>
                ) : (
                  <ExtraText size={size}>{helpText}</ExtraText>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label size={size}>Combobox</Label>
                <Combobox
                  placeholder="Search and select"
                  size={size}
									items={comboboxOptions}
                />
                {validateStatus === 'error' ? (
                  <Error size={size}>{helpText}</Error>
                ) : (
                  <ExtraText size={size}>{helpText}</ExtraText>
                )}
              </div>
            </div>
          </VariantGroup>

          <VariantGroup title="Numeric & Boolean Inputs" fullWidth>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1">
                <Label size={size}>Numeric Input</Label>
                <NumericInput
                  placeholder="Enter number"
                  size={size}
                />
                {validateStatus === 'error' ? (
                  <Error size={size}>{helpText}</Error>
                ) : (
                  <ExtraText size={size}>{helpText}</ExtraText>
                )}
              </div>

              <div className="space-y-4">
                <FormCheckbox
                  id="checkbox"
                  label="Checkbox Option"
                  size={size}
                  validateStatus={validateStatus}
                  helpText={helpText}
                  checked={formData.checkbox}
                />

                <div className="flex flex-col gap-1">
                  <Switch
                    checked={formData.switch}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, switch: checked }))}
                  >
                    Switch Option
                  </Switch>
                  {validateStatus === 'error' ? (
                    <Error size={size}>{helpText}</Error>
                  ) : (
                    <ExtraText size={size}>{helpText}</ExtraText>
                  )}
                </div>
              </div>
            </div>
          </VariantGroup>

          <VariantGroup title="Range Input" fullWidth>
            <div className="w-full">
              <RangeSlider
                label="Range Slider"
                size={size}
                min={0}
                max={100}
                value={formData.range}
                helperText={helpText}
              />
            </div>
          </VariantGroup>
        </VariantContainer>
      </div>
    )
  },
}

/**
 * Shows all form inputs in small size for compact layouts.
 */
export const SmallSize: Story = {
  ...AllFormInputs,
  args: {
    size: 'sm',
    validateStatus: 'default',
  },
}

/**
 * Shows all form inputs in large size for accessibility or desktop layouts.
 */
export const LargeSize: Story = {
  ...AllFormInputs,
  args: {
    size: 'lg',
    validateStatus: 'default',
  },
}

/**
 * Shows all form inputs in error state to verify consistent error styling.
 */
export const ErrorState: Story = {
  ...AllFormInputs,
  args: {
    size: 'md',
    validateStatus: 'error',
  },
}

/**
 * Shows all form inputs in success state to verify consistent success styling.
 */
export const SuccessState: Story = {
  ...AllFormInputs,
  args: {
    size: 'md',
    validateStatus: 'success',
  },
}
