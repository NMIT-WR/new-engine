import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { FormPhoneInput } from "../../src/molecules/form-phone-input"

const meta: Meta<typeof FormPhoneInput> = {
	title: "Molecules/FormPhoneInput",
	component: FormPhoneInput,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
A phone number input component with integrated country selector and real-time formatting.

## Features
- Country selector with flag icons
- Real-time phone number formatting based on selected country
- Value stored and emitted in E.164 format (+12133734253)
- Validation states (default, error, success, warning)
- Size variants (sm, md, lg)
- Full keyboard navigation and accessibility
        `,
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Size variant of the input",
		},
		validateStatus: {
			control: { type: "select" },
			options: ["default", "error", "success", "warning"],
			description: "Validation state of the input",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the input is required",
		},
		defaultCountry: {
			control: "text",
			description: "Default country code (ISO alpha-2)",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-80 p-4">
				<Story />
			</div>
		),
	],
}

export default meta
type Story = StoryObj<typeof FormPhoneInput>

// === Basic Examples ===

export const Default: Story = {
	args: {
		id: "phone-default",
		label: "Phone Number",
		placeholder: "Enter phone number",
		helpText: "Enter your phone number with country code",
	},
}

export const WithDefaultValue: Story = {
	args: {
		id: "phone-with-value",
		label: "Phone Number",
		defaultValue: "+420777888999",
		helpText: "Pre-filled with a Czech number",
	},
}

export const WithDefaultCountry: Story = {
	args: {
		id: "phone-default-country",
		label: "Phone Number",
		defaultCountry: "US",
		placeholder: "Enter US phone number",
		helpText: "Defaults to United States",
	},
}

// === Size Variants ===

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<FormPhoneInput
				id="phone-sm"
				label="Small"
				size="sm"
				placeholder="Phone number"
			/>
			<FormPhoneInput
				id="phone-md"
				label="Medium (default)"
				size="md"
				placeholder="Phone number"
			/>
			<FormPhoneInput
				id="phone-lg"
				label="Large"
				size="lg"
				placeholder="Phone number"
			/>
		</div>
	),
}

// === Validation States ===

export const ValidationStates: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<FormPhoneInput
				id="phone-default-state"
				label="Default State"
				placeholder="Phone number"
				helpText="Enter your contact number"
			/>
			<FormPhoneInput
				id="phone-error"
				label="Error State"
				placeholder="Phone number"
				validateStatus="error"
				errorText="Please enter a valid phone number"
				defaultValue="+1555"
			/>
			<FormPhoneInput
				id="phone-success"
				label="Success State"
				placeholder="Phone number"
				validateStatus="success"
				helpText="Phone number verified"
				defaultValue="+12133734253"
				defaultCountry="US"
			/>
			<FormPhoneInput
				id="phone-warning"
				label="Warning State"
				placeholder="Phone number"
				validateStatus="warning"
				helpText="This may be a landline number"
				defaultValue="+442071234567"
				defaultCountry="GB"
			/>
		</div>
	),
}

// === States ===

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<FormPhoneInput
				id="phone-disabled"
				label="Disabled"
				disabled
				defaultValue="+420777888999"
			/>
			<FormPhoneInput
				id="phone-readonly"
				label="Read Only"
				readOnly
				defaultValue="+420777888999"
			/>
			<FormPhoneInput
				id="phone-required"
				label="Required"
				required
				helpText="This field is required"
			/>
		</div>
	),
}

// === Priority Countries ===

export const PriorityCountries: Story = {
	args: {
		id: "phone-priority",
		label: "Phone Number",
		priorityCountries: ["US", "GB", "CA"],
		helpText: "US, UK, and Canada appear first in the dropdown",
	},
}

// === Controlled Component ===

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState<string>("+420777888999")
		const [country, setCountry] = useState<string>("CZ")

		return (
			<div className="space-y-4">
				<FormPhoneInput
					id="phone-controlled"
					label="Phone Number"
					value={value}
					onChange={setValue}
					onCountryChange={setCountry}
				/>

				<div className="text-sm space-y-1 p-3 bg-gray-100 rounded">
					<div>
						<strong>E.164 Value:</strong> {value || "(empty)"}
					</div>
					<div>
						<strong>Country:</strong> {country}
					</div>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
						onClick={() => {
							setValue("+442071234567")
							setCountry("GB")
						}}
					>
						Set UK Number
					</button>
					<button
						type="button"
						className="px-3 py-1 text-sm bg-gray-200 rounded"
						onClick={() => setValue("")}
					>
						Clear
					</button>
				</div>
			</div>
		)
	},
}

// === Form Integration ===

export const WithinForm: Story = {
	render: () => {
		const [formData, setFormData] = useState({
			phone: "",
		})
		const [submitted, setSubmitted] = useState<typeof formData | null>(null)
		const [error, setError] = useState<string | null>(null)

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault()

			if (!formData.phone) {
				setError("Phone number is required")
				return
			}

			if (formData.phone.length < 10) {
				setError("Phone number is too short")
				return
			}

			setError(null)
			setSubmitted(formData)
		}

		return (
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormPhoneInput
					id="form-phone"
					label="Contact Phone"
					name="phone"
					required
					value={formData.phone}
					onChange={(phone) => setFormData({ ...formData, phone })}
					validateStatus={error ? "error" : "default"}
					errorText={error || undefined}
					helpText="We'll use this to contact you about your order"
				/>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Submit
				</button>

				{submitted && (
					<div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4">
						<h4 className="mb-2 font-medium">Form Submitted:</h4>
						<p>
							<strong>Phone (E.164):</strong> {submitted.phone}
						</p>
					</div>
				)}
			</form>
		)
	},
}
