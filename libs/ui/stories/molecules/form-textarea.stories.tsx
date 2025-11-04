import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { FormTextarea } from '../../src/molecules/form-textarea'
import { Button } from '../../src/atoms/button'

const meta: Meta<typeof FormTextarea> = {
  title: 'Molecules/FormTextarea',
  component: FormTextarea,
  parameters: {
    layout: 'centered',
  },
  args: {
    id: 'storybook-form-textarea',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the form textarea and all its child elements',
    },
    label: {
      control: 'text',
      description: 'Textarea label',
    },
    helpText: {
      control: 'text',
      description:
        'Helper text, validation message, or other supporting text shown below the textarea',
    },
    validateStatus: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation state that affects textarea style and helper text',
    },
    resize: {
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
      description: 'Resize behavior of the textarea',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
  },
}

export default meta
type Story = StoryObj<typeof FormTextarea>

// Basic usage
export const Basic: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    helpText: 'Provide a detailed description',
    rows: 4,
  },
}

// All variants and combinations
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Requirement States">
        <div className="w-80">
          <FormTextarea 
            id="default-textarea" 
            label="Default" 
            placeholder="Enter text..." 
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="required-textarea"
            label="Required"
            placeholder="Enter text..."
            required
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea 
            id="optional-textarea" 
            label="Optional" 
            placeholder="Enter text..." 
            rows={3}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Validation States">
        <div className="w-80">
          <FormTextarea
            id="success-textarea"
            label="Success state"
            placeholder="Enter message..."
            validateStatus="success"
            helpText="Message saved successfully"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="error-textarea"
            label="Error state"
            placeholder="Enter feedback..."
            validateStatus="error"
            helpText="Message is too short (min 10 characters)"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="warning-textarea"
            label="Warning state"
            placeholder="Enter comment..."
            validateStatus="warning"
            helpText="Message contains sensitive information"
            rows={3}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Supporting Text">
        <div className="w-80">
          <FormTextarea
            id="helper-textarea"
            label="With helper text"
            placeholder="Enter message..."
            helpText="This field supports markdown formatting"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="extra-textarea"
            label="With helper and extra text"
            placeholder="Enter comment..."
            helpText="Please be respectful"
            extraText="Maximum 500 characters"
            validateStatus="default"
            rows={3}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Sizes">
        <div className="w-80">
          <FormTextarea
            id="sm-textarea"
            label="Small textarea"
            placeholder="Enter text..."
            helpText="Helper text for small size"
            size="sm"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="md-textarea"
            label="Default textarea"
            placeholder="Enter text..."
            helpText="Helper text for default size"
            size="md"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="lg-textarea"
            label="Large textarea"
            placeholder="Enter text..."
            helpText="Helper text for large size"
            size="lg"
            rows={3}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Special States">
        <div className="w-80">
          <FormTextarea
            id="disabled-textarea"
            label="Disabled textarea"
            placeholder="Cannot edit"
            disabled
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="readonly-textarea"
            label="Read-only textarea"
            value="This content is read-only and cannot be modified by the user."
            readOnly
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="prefilled-textarea"
            label="With default value"
            defaultValue="This textarea comes with pre-filled content that can be edited."
            rows={3}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Resize Behaviors" fullWidth>
        <div className="w-80">
          <FormTextarea
            id="resize-none"
            label="No resize"
            placeholder="Cannot resize this textarea..."
            resize="none"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="resize-vertical"
            label="Vertical resize only"
            placeholder="Can only resize vertically..."
            resize="y"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="resize-horizontal"
            label="Horizontal resize only"
            placeholder="Can only resize horizontally..."
           resize="x"
            rows={3}
          />
        </div>
        <div className="w-80">
          <FormTextarea
            id="resize-both"
            label="Resize both directions"
            placeholder="Can resize in any direction..."
            resize="both"
            rows={3}
          />
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

// Interactive character count example
export const InteractiveCharacterCount: Story = {
  render: () => {
    return <CharacterCountExample />
  },
}

function CharacterCountExample() {
  const [text, setText] = useState('')
  const maxLength = 280
  const remaining = maxLength - text.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 20 && remaining >= 0

  const validateStatus = isOverLimit 
    ? 'error' 
    : isNearLimit 
      ? 'warning' 
      : 'default'

  const helpText = isOverLimit
    ? `${Math.abs(remaining)} characters over the limit`
    : isNearLimit
      ? `${remaining} characters remaining`
      : `${remaining}/${maxLength} characters`

  return (
    <div className="w-96">
      <h3 className="mb-4 font-medium text-lg">Character Count Validation</h3>
      <FormTextarea
        id="character-count"
        label="Tweet"
        placeholder="What's happening?"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        validateStatus={validateStatus}
        helpText={helpText}
        rows={4}
      />
      <div className="mt-4 text-sm">
        <div className="flex gap-4">
          <span>Characters: {text.length}</span>
          <span className={isOverLimit ? 'text-red-500' : ''}>
            Remaining: {remaining}
          </span>
        </div>
      </div>
    </div>
  )
}

// Contact form example
export const ContactForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    return (
      <div className="w-[480px] rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="mb-6 font-semibold text-xl">Contact Us</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-medium text-sm">Name</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-sm">Email</label>
              <input
                type="email"
                className="w-full rounded border px-3 py-2"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-sm">Subject</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <FormTextarea
            id="contact-message"
            label="Message"
            placeholder="Tell us more about your inquiry..."
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            helpText="Please provide as much detail as possible"
            extraText="We typically respond within 24 hours"
          />

          <FormTextarea
            id="additional-info"
            label="Additional Information (Optional)"
            placeholder="Any other details you'd like to share..."
            rows={3}
            helpText="Include any relevant links, references, or context"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button
          size='sm'
          type="submit"
          >
            Send Message
          </Button>
          <Button
          size='sm'
          variant='danger'
          type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  },
}