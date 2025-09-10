import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Button } from '../../src/atoms/button'
import {
  Slider,
  type SliderProps,
} from '../../src/molecules/slider'

const meta: Meta<typeof Slider> = {
  title: 'Molecules/Slider',
  component: Slider,
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
    error: {
      control: 'boolean',
      description: 'Whether the slider is in an error state.',
    },
    origin: {
      control: 'radio',
      options: ['start', 'center', 'end'],
      description: 'Origin point for the slider range.',
    },
    thumbAlignment: {
      control: 'radio',
      options: ['center', 'contain'],
      description: 'Alignment of slider thumbs relative to the track.',
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description: 'Text direction of the slider.',
    },
    formatRangeText: {
      control: false,
      description: 'Function to format the range text display.',
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
type Story = StoryObj<typeof Slider>

const baseSliderProps: Partial<SliderProps> = {
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
    <div className="min-w-sm">
      <Slider {...args} />
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
      <div className="max-w-96">
        <Slider
          {...args}
          value={value}
          error={value[0] < 50}
          onChange={setValue}
        />
      </div>
    )
  },
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
    <div className="min-w-sm">
      <Slider {...args} />
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
        <div className="grid h-96 w-4xl grid-cols-3 gap-600">
          <Slider
            {...baseSliderProps}
            id="vertical-sm"
            orientation="vertical"
            size="sm"
            label="Volume (Small)"
            defaultValue={[20, 80]}
            helperText="Adjust volume"
          />
          <Slider
            {...baseSliderProps}
            id="vertical-md"
            orientation="vertical"
            size="md"
            label="Brightness (Medium)"
            showMarkers
            markerCount={5}
            value={values}
            onChange={handleChange}
            error={values[0] > 50}
            errorText="Brightness too high!"
            helperText={values[0] <= 50 ? 'It is ok' : undefined}
          />
          <Slider
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
      <div className="min-w-sm">
        <Slider {...args} value={values} onChange={handleChange} />
        <div className="mt-400 rounded border bg-surface-secondary p-200">
          <p className="text-fg-secondary text-sm">
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

export const SingleVsMultiThumb: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-xs gap-600">
        <Slider
          {...baseSliderProps}
          id="single-thumb"
          label="Single Thumb (Volume)"
          defaultValue={[50]}
          helperText="One thumb for single value selection"
        />
        <Slider
          {...baseSliderProps}
          id="double-thumb"
          label="Double Thumb (Range)"
          defaultValue={[25, 75]}
          helperText="Two thumbs for range selection"
        />
        <Slider
          {...baseSliderProps}
          id="triple-thumb"
          label="Triple Thumb (Multi-range)"
          defaultValue={[20, 50, 80]}
          helperText="Three thumbs for complex range selection"
        />
      </div>
    </VariantContainer>
  ),
}

export const Origin: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-xs gap-600">
        <Slider
          {...baseSliderProps}
          id="origin-start"
          origin="start"
          label="Origin: Start"
          defaultValue={[50]}
          helperText="Range starts from the beginning"
        />
        <Slider
          {...baseSliderProps}
          id="origin-center"
          origin="center"
          label="Origin: Center"
          defaultValue={[50]}
          helperText="Range starts from the center"
        />
        <Slider
          {...baseSliderProps}
          id="origin-end"
          origin="end"
          label="Origin: End"
          defaultValue={[50]}
          helperText="Range starts from the end"
        />
      </div>
    </VariantContainer>
  ),
}

export const ThumbAlignment: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-xs gap-600">
        <Slider
          {...baseSliderProps}
          id="alignment-center"
          thumbAlignment="center"
          showMarkers
          markerCount={5}
          label="Thumb Alignment: Center (default)"
          defaultValue={[25, 75]}
          helperText="Thumbs can go to track edges"
        />
        <Slider
          {...baseSliderProps}
          id="alignment-contain"
          thumbAlignment="contain"
          showMarkers
          markerCount={5}
          label="Thumb Alignment: Contain"
          defaultValue={[25, 75]}
          helperText="Thumbs stay within track bounds"
        />
      </div>
    </VariantContainer>
  ),
}

export const MinStepsBetweenThumbs: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([30, 70])

    return (
      <VariantContainer>
        <div className="grid w-full min-w-xs gap-600">
          <Slider
            {...baseSliderProps}
            id="no-min-steps"
            label="No Minimum Steps"
            defaultValue={[45, 55]}
            minStepsBetweenThumbs={0}
            helperText="Thumbs can touch each other"
          />
          <Slider
            {...baseSliderProps}
            id="min-steps-10"
            label="Minimum 10 Steps Between Thumbs"
            value={values}
            onChange={setValues}
            minStepsBetweenThumbs={10}
            helperText={`Current gap: ${values[1] - values[0]} units (min: 10)`}
          />
          <Slider
            {...baseSliderProps}
            id="min-steps-20"
            label="Minimum 20 Steps Between Thumbs"
            defaultValue={[20, 80]}
            minStepsBetweenThumbs={20}
            helperText="Enforces 20 unit minimum gap"
          />
        </div>
      </VariantContainer>
    )
  },
}

export const RTLSupport: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-xs gap-600">
        <Slider
          {...baseSliderProps}
          id="ltr-slider"
          dir="ltr"
          label="LTR Direction (English)"
          defaultValue={[20, 80]}
          helperText="Left to right direction"
        />
        <Slider
          {...baseSliderProps}
          id="rtl-slider"
          dir="rtl"
          label="RTL Direction (العربية)"
          defaultValue={[20, 80]}
          helperText="Right to left direction"
        />
      </div>
    </VariantContainer>
  ),
}

export const CustomFormatting: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid w-full min-w-xs gap-600">
        <Slider
          {...baseSliderProps}
          id="currency-slider"
          label="Price Range"
          min={0}
          max={1000}
          step={50}
          defaultValue={[200, 800]}
          formatValue={(v) => `$${v}`}
          formatRangeText={(values) => `Budget: $${values[0]} - $${values[1]}`}
          helperText="Select your price range"
        />
        <Slider
          {...baseSliderProps}
          id="time-slider"
          label="Working Hours"
          min={0}
          max={24}
          step={1}
          defaultValue={[9, 17]}
          formatValue={(v) => `${v}:00`}
          formatRangeText={(values) => `${values[0]}:00 - ${values[1]}:00`}
          helperText="Select working hours"
        />
        <Slider
          {...baseSliderProps}
          id="percentage-slider"
          label="Discount Range"
          min={0}
          max={100}
          step={5}
          defaultValue={[10, 50]}
          formatValue={(v) => `${v}%`}
          formatRangeText={(values) => `${values[0]}% to ${values[1]}% off`}
          helperText="Set discount percentage range"
        />
      </div>
    </VariantContainer>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes">
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            size="sm"
            label="Small"
            defaultValue={[25, 75]}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            size="md"
            label="Medium (default)"
            defaultValue={[30, 70]}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            size="lg"
            label="Large"
            defaultValue={[35, 65]}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="States">
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Normal"
            defaultValue={[20, 80]}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Disabled"
            defaultValue={[20, 80]}
            disabled
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Read-only"
            defaultValue={[20, 80]}
            readOnly
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Error"
            defaultValue={[20, 80]}
            error
            errorText="Invalid range selected"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Features">
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="With Markers"
            defaultValue={[25, 75]}
            showMarkers
            markerCount={5}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="With Value Text"
            defaultValue={[30, 70]}
            showValueText
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="With Helper Text"
            defaultValue={[35, 65]}
            helperText="Adjust the range"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Thumb Variations">
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Single Thumb"
            defaultValue={[50]}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Double Thumb"
            defaultValue={[25, 75]}
          />
        </div>
        <div className="w-full min-w-xs">
          <Slider
            {...baseSliderProps}
            label="Triple Thumb"
            defaultValue={[20, 50, 80]}
          />
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}
