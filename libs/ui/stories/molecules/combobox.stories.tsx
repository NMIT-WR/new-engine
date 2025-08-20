import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer } from '../../.storybook/decorator'
import { Combobox, type ComboboxItem } from '../../src/molecules/combobox'

const countries: ComboboxItem[] = [
  { id: 1, label: 'Czech Republic', value: 'cz' },
  { id: 2, label: 'Slovakia', value: 'sk' },
  { id: 3, label: 'Germany', value: 'de' },
  { id: 4, label: 'Austria', value: 'at', disabled: true },
  { id: 5, label: 'Poland', value: 'pl' },
  { id: 6, label: 'France', value: 'fr', disabled: true },
  { id: 7, label: 'Italy', value: 'it' },
  { id: 8, label: 'Spain', value: 'es' },
  { id: 9, label: 'Great Britain', value: 'gb' },
  { id: 10, label: 'USA', value: 'us' },
]

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    validationState: {
      control: 'select',
      options: ['normal', 'error', 'success', 'warning'],
      description: 'Validation state of the combobox',
    },
    multiple: {
      control: 'boolean',
      description: 'Allows selection of multiple values',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the combobox',
    },
    clearable: {
      control: 'boolean',
      description: 'Allows clearing the selection',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Closes the dropdown when an option is selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  args: {
    label: 'Select Country',
    placeholder: 'Choose a country...',
    items: countries,
    helper: 'Select your country of residence',
  },
}

export const ValidationStates: Story = {
  render: () => (
    <VariantContainer>
      <Combobox
        label="Normal State"
        placeholder="Select country"
        items={countries}
        helper="Default state without validation"
        validationState="normal"
      />
      <Combobox
        label="Error State"
        placeholder="Select country"
        items={countries}
        error="Please select a valid country"
        validationState="error"
      />
      <Combobox
        label="Success State"
        placeholder="Select country"
        items={countries}
        helper="Your choice is valid"
        validationState="success"
      />
      <Combobox
        label="Warning State"
        placeholder="Select country"
        items={countries}
        helper="This country may require additional verification"
        validationState="warning"
      />
    </VariantContainer>
  ),
}

export const MultipleSelection: Story = {
  args: {
    label: 'Select Countries',
    placeholder: 'Choose countries...',
    items: countries,
    helper: 'Select the countries you have visited',
    multiple: true,
    closeOnSelect: false,
  },
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <Combobox
        label="Small Size"
        placeholder="Select country"
        items={countries}
        helper="Small combobox variant"
        size="sm"
      />
      <Combobox
        label="Medium Size"
        placeholder="Select country"
        items={countries}
        helper="Medium combobox variant (default)"
        size="md"
      />
      <Combobox
        label="Large Size"
        placeholder="Select country"
        items={countries}
        helper="Large combobox variant"
        size="lg"
      />
    </VariantContainer>
  ),
}

export const ComplexStory: Story = {
  render: () => {
    const [selectedCountryValue, setSelectedCountryValue] = useState<
      string | null
    >(null)

    const validationState =
      selectedCountryValue === 'us'
        ? 'error'
        : selectedCountryValue === 'sk'
          ? 'warning'
          : selectedCountryValue === 'cz'
            ? 'success'
            : 'normal'

    const dynamicHelperMessage =
      validationState === 'error'
        ? 'USA is currently unavailable'
        : validationState === 'warning'
          ? 'Slovakia requires additional identity verification'
          : validationState === 'success'
            ? 'Country successfully selected'
            : 'Select your country of residence'

    const dynamicErrorMessage =
      validationState === 'error' ? dynamicHelperMessage : undefined

    return (
      <div className="w-72 space-y-8">
        {' '}
        <Combobox
          label="Select Country (Dynamic Validation)"
          placeholder="Choose a country..."
          items={countries}
          onChange={(value) => {
            const singleValue = Array.isArray(value) ? value[0] : value
            setSelectedCountryValue(singleValue ?? null)
          }}
          validationState={validationState}
          error={dynamicErrorMessage}
          helper={
            validationState !== 'error' ? dynamicHelperMessage : undefined
          }
        />
        <div className="text-sm ">
          Try selecting different countries to see validation states change:
          <ul className="mt-2 ml-5 list-disc">
            <li>USA - error</li>
            <li>Slovakia - warning</li>
            <li>Czech Republic - success</li>
          </ul>
        </div>
      </div>
    )
  },
}
