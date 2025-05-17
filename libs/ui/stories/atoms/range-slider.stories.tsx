import type { Meta, StoryObj } from "@storybook/react";
import {
  RangeSlider,
  type RangeSliderProps,
} from "../../src/atoms/range-slider"; // Assuming RangeSliderProps is exported
import { useState } from "react";
import { Button } from "../../src/atoms/button";
import { VariantContainer } from "../../.storybook/decorator"; // Assuming this is a wrapper for visual grouping

const meta: Meta<typeof RangeSlider> = {
  title: "Atoms/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered", // Consider 'padded' or 'fullscreen' for wider components or vertical sliders
  },
  tags: ["autodocs"],
  argTypes: {
    // ArgTypes from your original file are good, keeping them.
    // Adding descriptions or controls where they might be missing or can be improved.
    value: {
      control: "object",
      description:
        "Current values of the slider (for controlled component). Example: [20, 80]",
    },
    defaultValue: {
      control: "object",
      description:
        "Default values of the slider (for uncontrolled component). Example: [25, 75]",
    },
    min: {
      control: "number",
      description: "Minimum value of the slider.",
    },
    max: {
      control: "number",
      description: "Maximum value of the slider.",
    },
    step: {
      control: "number",
      description: "Step value for incrementing/decrementing.",
    },
    minStepsBetweenThumbs: {
      control: "number",
      description: "Minimum steps required between thumbs.",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Orientation of the slider.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Size of the slider.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled.",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the slider is read-only.",
    },
    showValueText: {
      control: "boolean",
      description: "Show the current values alongside the slider.",
    },
    formatValue: {
      control: false, // Function, not easily controllable via UI
      description: "Function to format the displayed value text.",
    },
    showMarkers: {
      control: "boolean",
      description: "Show step markers on the track.",
    },
    markerCount: {
      control: "number",
      description: "Number of markers to display (if showMarkers is true).",
    },
    label: {
      control: "text",
      description: "Label text displayed above the slider.",
    },
    helper: {
      control: "text",
      description: "Helper text displayed below the slider.",
    },
    error: {
      control: "text",
      description:
        "Error message displayed below the slider (takes precedence over helper text).",
    },
    onChange: {
      action: "changed",
      description: "Callback when the value changes.",
    },
    onChangeEnd: {
      action: "changeEnded",
      description: "Callback when the value change is committed.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

// Base props shared across stories for consistency
const baseSliderProps: Partial<RangeSliderProps> = {
  min: 0,
  max: 100,
  step: 1,
  showValueText: true,
};

export const Default: Story = {
  args: {
    ...baseSliderProps,
    id: "default-slider",
    label: "Price Range",
    defaultValue: [20, 80],
    helper: "Select your desired price range.",
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    ...Default.args, // Inherit from Default and override
    id: "helper-slider",
    label: "Age Range",
    helper: "Please select an age range between 18 and 65.",
    error: undefined, // Ensure no error
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    ...Default.args,
    id: "error-slider",
    label: "Quantity",
    defaultValue: [10, 30],
    helper: "This helper text will be hidden by the error message.",
    error: "The selected range is not valid. Please adjust.",
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <div className="grid gap-8 min-w-[28rem] w-full">
        <RangeSlider
          {...baseSliderProps}
          id="sm-slider"
          size="sm"
          label="Small Slider"
          defaultValue={[25, 75]}
          helper="This is a small slider."
        />
        <RangeSlider
          {...baseSliderProps}
          id="md-slider"
          size="md"
          label="Medium Slider (Default)"
          defaultValue={[30, 70]}
          helper="This is a medium slider."
        />
        <RangeSlider
          {...baseSliderProps}
          id="lg-slider"
          size="lg"
          label="Large Slider"
          defaultValue={[35, 65]}
          helper="This is a large slider."
        />
      </div>
    </VariantContainer>
  ),
};

export const Disabled: Story = {
  args: {
    ...baseSliderProps,
    id: "disabled-slider",
    label: "Disabled Slider",
    defaultValue: [40, 60],
    disabled: true,
    helper: "This slider is currently disabled.",
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: {
    ...baseSliderProps,
    id: "readonly-slider",
    label: "Read-Only Slider",
    defaultValue: [33, 66],
    readOnly: true,
    helper: "This slider is for display purposes only.",
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const WithMarkers: Story = {
  args: {
    ...baseSliderProps,
    id: "markers-slider",
    label: "Temperature Range (°C)",
    defaultValue: [10, 30],
    min: -20,
    max: 50,
    step: 0.5,
    showMarkers: true,
    markerCount: 5, // (-20, -15, ..., 50)
    helper: "Adjust the temperature using the slider with markers.",
    formatValue: (value) => `${value}°C`,
  },
  render: (args) => (
    <div className="min-w-96">
      <RangeSlider {...args} />
    </div>
  ),
};

export const VerticalOrientation: Story = {
  parameters: {
    layout: "padded", // Give more space for vertical sliders
  },
  render: () => (
    <VariantContainer>
      <div className="flex h-[20rem] w-max gap-8">
        <RangeSlider
          {...baseSliderProps}
          id="vertical-sm"
          orientation="vertical"
          size="sm"
          label="Volume (Small)"
          defaultValue={[20, 80]}
          helper="Adjust volume"
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
          error="Brightness too high!"
        />
        <RangeSlider
          {...baseSliderProps}
          id="vertical-lg"
          orientation="vertical"
          size="lg"
          label="Contrast (Large)"
          defaultValue={[40, 60]}
          helper="Set contrast level"
        />
      </div>
    </VariantContainer>
  ),
};

export const Controlled: Story = {
  args: {
    // Args for the story, not directly for the component if they are managed by state
    ...baseSliderProps,
    id: "controlled-slider",
    label: "Controlled Slider",
    helper: "Values are managed by component state.",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setValues] = useState<number[]>([30, 70]);

    const handleChange = (newValues: number[]) => {
      setValues(newValues);
    };

    const handleRandom = () => {
      const firstRandom = Math.floor(Math.random() * 100);
      const secondRandomNumber = Math.floor(Math.random() * 100);
      const minValue = Math.min(firstRandom, secondRandomNumber);
      const maxValue = Math.max(firstRandom, secondRandomNumber);

      const values = [minValue, maxValue];
      setValues(values);
    };

    return (
      <div className="min-w-96">
        <RangeSlider
          {...args} // Spread other args like label, helper, etc.
          value={values}
          onChange={handleChange}
        />
        <div className="mt-4 p-2 border rounded bg-gray-100 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Component State:
          </p>
          <p className="font-mono text-lg">[{values.join(", ")}]</p>
          <div>
            <Button size="sm" onClick={handleRandom}>
              Random
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
