import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "../../src/atoms/range-slider";
import { useState } from "react";
import { VariantContainer } from "../../.storybook/decorator";

const meta: Meta<typeof RangeSlider> = {
  title: "Atoms/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: "number",
      description: "Minimum value of the slider",
    },
    max: {
      control: "number",
      description: "Maximum value of the slider",
    },
    step: {
      control: "number",
      description: "Step value for incrementing/decrementing",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Orientation of the slider",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the slider is read-only",
    },
    minStepsBetweenThumbs: {
      control: "number",
      description: "Minimum steps required between thumbs",
    },
    showValueText: {
      control: "boolean",
      description: "Show the current values below the slider",
    },
    showMarkers: {
      control: "boolean",
      description: "Show step markers on the track",
    },
    markerCount: {
      control: "number",
      description: "Number of markers to display",
    },
    label: {
      control: "text",
      description: "Label text displayed above the slider",
    },
    helper: {
      control: "text",
      description: "Helper text displayed below the slider",
    },
    error: {
      control: "text",
      description: "Error message",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

// Base props shared across stories
const baseProps = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: [25, 75],
};

export const Default: Story = () => {
  return (
    <div className="grid gap-4 min-w-96">
      <RangeSlider
        {...baseProps}
        id="1"
        name="Quantity"
        showValueText
        label="Default Range Slider"
        helper="Select a range between 0 and 100"
      />
      <RangeSlider
        {...baseProps}
        id="2"
        name="Quantity"
        size="sm"
        showValueText
        label="Small Disabled Slider"
        helper="Select a range between 0 and 100"
        disabled
      />
      <RangeSlider
        {...baseProps}
        showValueText
        showMarkers
        markerCount={11}
        label="Range Slider with Markers"
        helper="Markers show the steps of 10"
      />
    </div>
  );
};

export const VerticalOrientation: Story = () => {
  return (
    <div className="grid grid-cols-3 gap-4 min-h-48 w-[40rem]">
      <RangeSlider
        {...baseProps}
        orientation="vertical"
        showValueText
        defaultValue={[1.5, 53.8]}
        step={0.1}
        size="sm"
        label="Vertical Slider"
        helper="Dragging works vertically"
      />
      <RangeSlider
        {...baseProps}
        orientation="vertical"
        showValueText
        size="md"
        label="Vertical Slider"
        helper="Dragging works vertically"
      />
      <RangeSlider
        {...baseProps}
        orientation="vertical"
        showValueText
        size="lg"
        label="Vertical Slider"
        helper="Dragging works vertically"
      />
    </div>
  );
};

export const CustomRange: Story = {
  args: {
    ...baseProps,
    min: -50,
    max: 50,
    defaultValue: [-20, 30],
    showValueText: true,
    label: "Temperature Range",
    helper: "Select a temperature range from -50°C to 50°C",
    formatValue: (value: number) => `${value}°C`,
  },
};
