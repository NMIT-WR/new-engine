import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { Button } from '../../src/atoms/button'
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
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Steps orientation',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    linear: {
      control: 'boolean',
      description: 'Enforce linear progression (must complete steps in order)',
      table: { defaultValue: { summary: 'false' } },
    },
    currentStep: {
      control: { type: 'number', min: 0 },
      description: 'Current active step (0-indexed). If currentStep === steps.length, completion screen is shown',
      table: { defaultValue: { summary: '0' } },
    },
    showControls: {
      control: 'boolean',
      description: 'Show navigation buttons (Back/Next)',
      table: { defaultValue: { summary: 'true' } },
    },
    completeText: {
      control: 'text',
      description: 'Text or content shown when all steps are completed',
    },
  },
  args: {
    orientation: 'horizontal',
    linear: false,
    currentStep: 0,
    showControls: true,
  },
}

export default meta
type Story = StoryObj<typeof Steps>

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

export const Playground: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(args.currentStep ?? 0)
    useEffect(() => {
      setCurrentStep(args.currentStep ?? 0)
    }, [args.currentStep])

    return (
      <div className="w-xl space-y-400">
        <Steps
          {...args}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onStepComplete={() => alert('Finished!')}
        />
      </div>
    )
  },
  args: {
    items: basicSteps,
    completeText,
  },
}

export const VerticalOrientation: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1)

    return (
      <div className="flex h-[600px] w-xl">
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

const selectItems = [
  { label: 'First option', value: 'first' },
  { label: 'Second option', value: 'second' },
]

const stepsWithCustomContent = [
  {
    value: 0,
    title: 'Account',
    content: (
      <div className="rounded-lg p-200">
        <h3 className="mb-100 font-semibold text-lg">Create your account</h3>
        <p>This is custom content for the account step.</p>
        <Button className="mt-200" size="sm">
          Custom Action
        </Button>
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
      <div className="rounded border border-border p-200">
        <h3 className="font-semibold">Custom Settings Form</h3>
        <div className="mt-100">
          <Select items={selectItems} size="xs">
            <Select.Label>Preference</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select option..." />
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {selectItems.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText />
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select>
        </div>
      </div>
    ),
  },
]

export const WithCustomContent: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
      <div className="w-2xl">
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
