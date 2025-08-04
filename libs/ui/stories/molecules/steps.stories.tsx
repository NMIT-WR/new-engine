import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Steps } from '../../src/molecules/steps'
import { Select } from '../../src/molecules/select'
import { Button } from '../../src/atoms/button'

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
    description: 'Create your account',
  },
  {
    value: 1,
    title: 'Profile',
    description: 'Complete your profile',
  },
  {
    value: 2,
    title: 'Settings',
    description: 'Configure settings',
  },
  {
    value: 3,
    title: 'Review',
    description: 'Review and confirm',
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
      <div className="p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Create your account</h3>
        <p>This is custom content for the account step.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Custom Action
        </button>
      </div>
    ),
  },
  {
    value: 1,
    title: 'Profile',
    description: 'Complete your profile',
    // No custom content, will use default rendering
  },
  {
    value: 2,
    title: 'Settings',
    content: (
      <div className="p-4 border border-gray-200 rounded">
        <h3 className="font-semibold">Custom Settings Form</h3>
        <label className="block mt-2">
          <span className="text-gray-700">Preference</span>
          <Select label="options" options={[{label: "first", value:"first"}, {label: "second", value: "second"}]} size='xs' />
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
