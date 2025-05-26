import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
          onStepComplete={() => console.log('All steps completed!')}
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
          />
        </div>
      </div>
    )
  },
}
