import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { Select, type SelectItem } from '../../src/molecules/select'
import { Steps } from '../../src/molecules/steps'

const meta: Meta<typeof Steps> = {
  title: 'Molecules/Steps',
  component: Steps,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Steps orientation',
    },
    linear: {
      control: 'boolean',
      description: 'Enforce linear progression',
    },
    currentStep: {
      control: 'number',
      description: 'Current active step (0-indexed). If currentStep === steps.length finished screen shown',
    },
  },
}

export default meta
type Story = StoryObj<typeof Steps>

// Base items for examples
const basicSteps = [
  {
    value: 0,
    title: 'Account',
    content: <p>Create your account</p>,
  },
  {
    value: 1,
    title: 'Profile',
    content: <p>Complete your profile</p>,
  },
  {
    value: 2,
    title: 'Settings',
    content: <p>Configure settings</p>,
  },
  {
    value: 3,
    title: 'Review',
    content: <p>Review and confirm</p>,
  },
]

const completeText = 'Steps Complete - Thank you for filling out the form! You can now proceed, because you have finished.'

export const Default: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(args.currentStep)
    useEffect(() => {
      setCurrentStep(args.currentStep)
    }, [args.currentStep])

    return (
      <div className="w-[600px] space-y-8">
        <Steps
          {...args}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onStepComplete={() => alert("Finished!")}
        />
      </div>
    )
  },
  args: {
    items: basicSteps,
    completeText,
    orientation: 'horizontal',
  },
}

export const VerticalOrientation: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1)

    return (
      <div className="flex h-[600px] w-[600px]">
        <Steps
          items={basicSteps}
          currentStep={currentStep}
          orientation="vertical"
          onStepChange={setCurrentStep}
          completeText={completeText}
        />
      </div>
    )
  },
}

export const ResponsiveOrientation: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1)

    return (
      <div className="w-full">
        <div className="md:hidden">
          <Steps
            items={basicSteps}
            currentStep={currentStep}
            orientation="vertical"
            onStepChange={setCurrentStep}
            completeText={completeText}
          />
        </div>
        <div className="hidden md:block">
          <Steps
            items={basicSteps}
            currentStep={currentStep}
            orientation="horizontal"
            onStepChange={setCurrentStep}
            completeText={completeText}
          />
        </div>
      </div>
    )
  },
}

// Example with custom content
const stepsWithCustomContent = [
  {
    value: 0,
    title: 'Account',
    content: (
      <div className="rounded-lg p-4">
        <h3 className="mb-2 font-semibold text-lg">Create your account</h3>
        <p>This is custom content for the account step.</p>
        <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
          Custom Action
        </button>
      </div>
    ),
  },
  {
    value: 1,
    title: 'Profile',
    content: <p>Complete your profile information to continue</p>,
  },
  {
    value: 2,
    title: 'Settings',
    content: (
      <div className="rounded border border-gray-200 p-4">
        <h3 className="font-semibold">Custom Settings Form</h3>
        <Select items={[{ label: 'First', value: 'first' }, { label: 'Second', value: 'second' }]} size="xs">
          <Select.Label>Preference</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select option" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.Item item={{ label: 'First', value: 'first' }}>
                <Select.ItemText />
                <Select.ItemIndicator />
              </Select.Item>
              <Select.Item item={{ label: 'Second', value: 'second' }}>
                <Select.ItemText />
                <Select.ItemIndicator />
              </Select.Item>
            </Select.Content>
          </Select.Positioner>
        </Select>
      </div>
    ),
  },
]

export const WithCustomContent: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
      <div className="w-[700px]">
        <Steps
          items={stepsWithCustomContent}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          completeText="All steps completed!"
        />
      </div>
    )
  },
}
