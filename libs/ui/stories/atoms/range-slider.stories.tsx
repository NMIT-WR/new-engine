import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer } from '../../.storybook/decorator'
import { Button } from '../../src/atoms/button'
import {
  RangeSlider,
  type RangeSliderProps,
} from '../../src/atoms/range-slider'

const meta: Meta<typeof RangeSlider> = {
  title: 'Atoms/RangeSlider',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description:
        'Current values of the slider (for controlled component). Example: [20, 80]',
    },
    defaultValue: {
      control: 'object',
      description:
        'Default values of the slider (for uncontrolled component). Example: [25, 75]',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the slider.',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the slider.',
    },
    step: {
      control: 'number',
      description: 'Step value for incrementing/decrementing.',
    },
    minStepsBetweenThumbs: {
      control: 'number',
      description: 'Minimum steps required between thumbs.',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the slider.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled.',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the slider is read-only.',
    },
    showValueText: {
      control: 'boolean',
      description: 'Show the current values alongside the slider.',
    },
    formatValue: {
      control: false,
      description: 'Function to format the displayed value text.',
    },
    showMarkers: {
      control: 'boolean',
      description: 'Show step markers on the track.',
    },
    markerCount: {
      control: 'number',
      description: 'Number of markers to display (if showMarkers is true).',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the slider.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the slider.',
    },
    errorText: {
      control: 'text',
      description:
        'Error message displayed below the slider (takes precedence over helper text).',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when the value changes.',
    },
    onChangeEnd: {
      action: 'changeEnded',
      description: 'Callback when the value change is committed.',
    },
  },
}

export default meta
type Story = StoryObj<typeof RangeSlider>

const baseSliderProps: Partial<RangeSliderProps> = {
  min: 0,
  max: 100,
  step: 1,
  showValueText: true,
}

export const Default: Story = {
  args: {
    ...baseSliderProps,
    id: 'default-slider',
    label: 'Price Range',
    defaultValue: [20, 80],
    helperText: 'Select your desired price range.',
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
}

export const WithHelperText: Story = {
  args: {
    ...Default.args,
    id: 'helper-slider',
    label: 'Age Range',
    helperText: 'Please select an age range between 18 and 65.',
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    ...Default.args,
    id: 'error-slider',
    label: 'Quantity',
    helperText: 'This helper text will be hidden by the error message.',
    errorText: 'The selected value must be bigger than 50.',
  },
  render: (args) => {
    const [value, setValue] = useState([30])

    return (
      <div className="min-w-96">
        <RangeSlider
          {...args}
          value={value}
          error={value[0] < 50}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-[28rem] gap-8">
        <RangeSlider
          {...baseSliderProps}
          id="sm-slider"
          size="sm"
          label="Small Slider"
          defaultValue={[25, 75]}
          helperText="This is a small slider."
        />
        <RangeSlider
          {...baseSliderProps}
          id="md-slider"
          size="md"
          label="Medium Slider (Default)"
          defaultValue={[30, 70]}
          helperText="This is a medium slider."
        />
        <RangeSlider
          {...baseSliderProps}
          id="lg-slider"
          size="lg"
          label="Large Slider"
          defaultValue={[35, 65]}
          helperText="This is a large slider."
        />
      </div>
    </VariantContainer>
  ),
}

export const Disabled: Story = {
  args: {
    ...baseSliderProps,
    id: 'disabled-slider',
    label: 'Disabled Slider',
    defaultValue: [40, 60],
    disabled: true,
    helperText: 'This slider is currently disabled.',
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
}

export const ReadOnly: Story = {
  args: {
    ...baseSliderProps,
    id: 'readonly-slider',
    label: 'Read-Only Slider',
    defaultValue: [33, 66],
    readOnly: true,
    helperText: 'This slider is for display purposes only.',
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
}

export const WithMarkers: Story = {
  args: {
    ...baseSliderProps,
    id: 'markers-slider',
    label: 'Temperature Range (°C)',
    defaultValue: [10, 30],
    min: -20,
    max: 50,
    step: 0.5,
    showMarkers: true,
    markerCount: 5,
    helperText: 'Adjust the temperature using the slider with markers.',
    formatValue: (value) => `${value}°C`,
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
}

export const VerticalOrientation: Story = {
  parameters: {
    layout: 'padded',
  },

  render: () => {
    const [values, setValues] = useState<number[]>([70])
    const handleChange = (newValues: number[]) => {
      setValues(newValues)
    }
    return (
      <VariantContainer>
        <div className="grid h-[20rem] w-10/12 grid-cols-3 gap-8">
          <RangeSlider
            {...baseSliderProps}
            id="vertical-sm"
            orientation="vertical"
            size="sm"
            label="Volume (Small)"
            defaultValue={[20, 80]}
            helperText="Adjust volume"
          />
          <RangeSlider
            {...baseSliderProps}
            id="vertical-md"
            orientation="vertical"
            size="md"
            label="Brightness (Medium)"
            defaultValue={[30, 70]}
            showMarkers
            markerCount={5}
            value={values}
            onChange={handleChange}
            error={values[0] > 50}
            errorText="Brightness too high!"
            helperText={values[0] <= 50 ? 'It is ok' : undefined}
          />
          <RangeSlider
            {...baseSliderProps}
            id="vertical-lg"
            orientation="vertical"
            size="lg"
            label="Contrast (Large)"
            defaultValue={[40, 60]}
            helperText="Set contrast level"
          />
        </div>
      </VariantContainer>
    )
  },
}

export const Controlled: Story = {
  args: {
    ...baseSliderProps,
    id: 'controlled-slider',
    label: 'Controlled Slider',
    helperText: 'Values are managed by component state.',
  },
  render: (args) => {
    const [values, setValues] = useState<number[]>([30, 70])

    const handleChange = (newValues: number[]) => {
      setValues(newValues)
    }

    const handleRandom = () => {
      const firstRandom = Math.floor(Math.random() * 100)
      const secondRandomNumber = Math.floor(Math.random() * 100)
      const minValue = Math.min(firstRandom, secondRandomNumber)
      const maxValue = Math.max(firstRandom, secondRandomNumber)

      const values = [minValue, maxValue]
      setValues(values)
    }

    return (
      <div className="min-w-96">
        <RangeSlider {...args} value={values} onChange={handleChange} />
        <div className="mt-4 rounded border bg-gray-100 p-2 dark:bg-gray-800">
          <p className="text-gray-600 text-sm dark:text-gray-400">
            Component State:
          </p>
          <p className="font-mono text-lg">[{values.join(', ')}]</p>
          <div>
            <Button size="sm" onClick={handleRandom}>
              Random
            </Button>
          </div>
        </div>
      </div>
    )
  },
}
