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
  args:{
  id: "storybook-form-input"},
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
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
    helperText: {
      control: "text",
      description: "Helper text or validation message (shown below the input)",
    },
    validateStatus: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description: "Validation state that affects input style and helper text",
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
    helperText: "Will be visible on your profile",
  },
};

// All variants and combinations
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Requirement States">
        <div className="w-64">
          <FormInput id="" label="Default" placeholder="Enter value" />
        </div>
        <div className="w-64">
          <FormInput id="" label="Required" placeholder="Enter value" required />
        </div>
        <div className="w-64">
          <FormInput id="" label="Optional" placeholder="Enter value" />
        </div>
      </VariantGroup>

      <VariantGroup title="Validation States">
        <div className="w-64">
          <FormInput 
           id="success-input"
            label="Success state" 
            placeholder="johndoe" 
            validateStatus="success"
            helperText="Username is available" 
          />
        </div>
        <div className="w-64">
          <FormInput
           id="success-input"
            label="Error state"
            placeholder="Enter email"
            validateStatus="error"
            helperText="Invalid email format"
          />
        </div>
        <div className="w-64">
          <FormInput
           id="success-input"
            label="Warning state"
            placeholder="Enter password"
            validateStatus="warning"
            helperText="Password is weak"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Supporting Text">
        <div className="w-64">
          <FormInput
           id="success-input"
            label="With helper text"
            placeholder="Enter value"
            helperText="This is helper text below input"
          />
        </div>
        <div className="w-64">
          <FormInput
           id="extra-text-input"
            label="Extra text (middle)"
            placeholder="Enter value"
            extraText="Text between label and input"
            extraTextPosition="middle"
          />
        </div>
        <div className="w-64">
          <FormInput
           id="extra-text-input"
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
             id="success-input"
            label="Small input"
            placeholder="Enter value"
            size="sm"
          />
        </div>
        <div className="w-64">
          <FormInput
             id="success-input"
            label="Default input"
            placeholder="Enter value"
            size="md"
          />
        </div>
        <div className="w-64">
          <FormInput
             id="success-input"
            label="Large input"
            placeholder="Enter value"
            size="lg"
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Special States">
        <div className="w-64">
          <FormInput
             id="success-input"
            label="Disabled input"
            placeholder="Cannot edit"
            disabled
          />
        </div>
        <div className="w-64">
          <FormInput
           id="success-input"
            label="Read-only input"
            placeholder="Read only"
            readOnly
            value="Fixed value"
          />
        </div>
        <div className="w-64">
          <FormInput
           id="success-input"
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

  // Determine validation status
  const validateStatus = showError ? "error" : showSuccess ? "success" : "default";

  return (
    <div className="w-80">
      <h3 className="text-lg font-medium mb-4">Email Validation</h3>
      <FormInput  id="success-input"
        label="Email"
        placeholder="your@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        validateStatus={validateStatus}
        helperText={showError ? "Please enter a valid email" : "Used for login and notifications"}
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
          <FormInput  id="success-input" label="Full name" placeholder="John Doe" required />

          <FormInput  id="success-input"
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            helperText="We'll send confirmation to this email"
          />

          <FormInput
           id="success-input"
            label="Username"
            placeholder="johndoe"
            required
            extraText="Visible to other users"
            extraTextPosition="middle"
          />

          <FormInput
           id="success-input"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            helperText="Min 8 characters, 1 number, 1 special character"
          />

          <FormInput
           id="success-input"
            label="Phone number"
            type="tel"
            placeholder="+1 (XXX) XXX-XXXX"
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