// form-input.stories.tsx
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormInput } from "../../src/molecules/form-input";
import { VariantGroup, VariantContainer } from "../../.storybook/decorator";

const meta: Meta<typeof FormInput> = {
  title: "Molecules/FormInput",
  component: FormInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "default", "large"],
      description: "Size of the form input and all its child elements",
    },
    label: {
      control: "text",
      description: "Input label",
    },
    extraText: {
      control: "text",
      description: "Additional text with configurable position",
    },
    extraTextPosition: {
      control: "radio",
      options: ["middle", "bottom"],
      description: "Position of the extra text relative to the input",
    },
    helpText: {
      control: "text",
      description: "Helper text (always displayed below the input)",
    },
    error: {
      control: "text",
      description: "Error message (empty = no error)",
    },
    success: {
      control: "boolean",
      description: "Success validation state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

// Basic usage
export const Basic: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    helpText: "Will be visible on your profile",
  },
};

// All variants and combinations
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Requirement States">
        <div className="w-64">
          <FormInput label="Default" placeholder="Enter value" />
        </div>
        <div className="w-64">
          <FormInput label="Required" placeholder="Enter value" required />
        </div>
        <div className="w-64">
          <FormInput label="Optional" placeholder="Enter value" optional />
        </div>
      </VariantGroup>

      <VariantGroup title="Validation States">
        <div className="w-64">
          <FormInput label="Success state" placeholder="johndoe" success />
        </div>
        <div className="w-64">
          <FormInput
            label="Error state"
            placeholder="Enter email"
            error="Invalid email format"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Error with help"
            placeholder="Enter password"
            error="Password too short"
            helpText="At least 8 characters"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Supporting Text">
        <div className="w-64">
          <FormInput
            label="With help text"
            placeholder="Enter value"
            helpText="This is helper text below input"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Extra text (middle)"
            placeholder="Enter value"
            extraText="Text between label and input"
            extraTextPosition="middle"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Extra text (bottom)"
            placeholder="Enter value"
            extraText="Text below input"
            extraTextPosition="bottom"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Sizes">
        <div className="w-64">
          <FormInput
            label="Small input"
            placeholder="Enter value"
            size="small"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Default input"
            placeholder="Enter value"
            size="default"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Large input"
            placeholder="Enter value"
            size="large"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Special States">
        <div className="w-64">
          <FormInput
            label="Disabled input"
            placeholder="Cannot edit"
            disabled
          />
        </div>
        <div className="w-64">
          <FormInput
            label="Read-only input"
            placeholder="Read only"
            readOnly
            value="Fixed value"
          />
        </div>
        <div className="w-64">
          <FormInput
            label="With default value"
            defaultValue="Prefilled value"
          />
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
};

// Interactive validation example
export const InteractiveValidation: Story = {
  render: () => {
    return <EmailValidationExample />;
  },
};

function EmailValidationExample() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email && !isValid;
  const showSuccess = touched && email && isValid;

  return (
    <div className="w-80">
      <h3 className="text-lg font-medium mb-4">Email Validation</h3>
      <FormInput
        label="Email"
        placeholder="your@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        error={showError ? "Please enter a valid email" : undefined}
        //success={showSuccess}
        helpText="Used for login and notifications"
      />
      <div className="mt-6 text-sm">
        <p>
          Status:{" "}
          {!touched ? "Untouched" : isValid ? "Valid email" : "Invalid email"}
        </p>
      </div>
    </div>
  );
}

// Form usage example
export const RegistrationForm: Story = {
  render: () => {
    return (
      <div className="w-96 p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Account Registration</h2>

        <div className="space-y-4">
          <FormInput label="Full name" placeholder="John Doe" required />

          <FormInput
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            helpText="We'll send confirmation to this email"
          />

          <FormInput
            label="Username"
            placeholder="johndoe"
            required
            extraText="Visible to other users"
            extraTextPosition="middle"
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            helpText="Min 8 characters, 1 number, 1 special character"
          />

          <FormInput
            label="Phone number"
            type="tel"
            placeholder="+1 (XXX) XXX-XXXX"
            optional
          />
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded font-medium">
            Create Account
          </button>
        </div>
      </div>
    );
  },
};
