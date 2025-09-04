import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select } from '../../src/molecules/select'
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
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Steps orientation',
    },
    linear: {
      control: 'boolean',
      description: 'Enforce linear progression',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress indicator',
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

const completeText = 'Steps Complete - Thank you for filling out the form!'

export const Default: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
      <div className="w-[600px] space-y-8">
        <Steps
          items={basicSteps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onStepComplete={() => undefined}
          completeText={completeText}
        />
      </div>
    )
  },
  args: {
    items: basicSteps,
    currentStep: 1,
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
        {/* Horizontální na velkých obrazovkách, vertikální na malých */}
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
        <label className="mt-2 block">
          <span className="text-gray-700">Preference</span>
          <Select
            label="options"
            options={[
              { label: 'first', value: 'first' },
              { label: 'second', value: 'second' },
            ]}
            size="xs"
          />
        </label>
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
