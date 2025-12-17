import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { FormCheckbox } from "../../src/molecules/form-checkbox"

const meta: Meta<typeof FormCheckbox> = {
	title: "Molecules/FormCheckbox",
	component: FormCheckbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormCheckbox>

export const Default: Story = {
	args: {
		id: "default-checkbox",
		label: "Accept terms and conditions",
	},
}

export const Checked: Story = {
	args: {
		...Default.args,
		id: "checked-checkbox",
		defaultChecked: true,
	},
}

export const Indeterminate: Story = {
	args: {
		id: "indeterminate-checkbox",
		label: "Indeterminate state",
		indeterminate: true,
	},
}

export const WithValidationError: Story = {
	args: {
		...Default.args,
		id: "error-checkbox",
		validateStatus: "error",
		helpText: "You must accept the terms to continue",
	},
}

export const WithInvalidProp: Story = {
	args: {
		...Default.args,
		id: "invalid-checkbox",
		invalid: true,
		errorText: "This field is required",
	},
}

export const WithHelperText: Story = {
	args: {
		...Default.args,
		id: "helper-checkbox",
		helperText: "By checking this box, you agree to our terms of service",
	},
}

export const WithHelpText: Story = {
	args: {
		...Default.args,
		id: "helptext-checkbox",
		helpText: "This text shows as helper or error depending on state",
	},
}

export const WithExtraText: Story = {
	args: {
		...Default.args,
		id: "extra-checkbox",
		extraText: "This option is recommended for new users",
	},
}

export const Disabled: Story = {
	args: {
		...Default.args,
		id: "disabled-checkbox",
		disabled: true,
	},
}

export const DisabledChecked: Story = {
	args: {
		...Default.args,
		id: "disabled-checked-checkbox",
		disabled: true,
		defaultChecked: true,
	},
}

export const Required: Story = {
	args: {
		...Default.args,
		id: "required-checkbox",
		required: true,
	},
}

export const AllStates: Story = {
	render: function Render() {
		return (
			<div className="flex flex-col gap-4">
				<FormCheckbox label="Default" />
				<FormCheckbox label="Checked" defaultChecked />
				<FormCheckbox label="Indeterminate" indeterminate />
				<FormCheckbox label="Disabled" disabled />
				<FormCheckbox label="Disabled Checked" disabled defaultChecked />
				<FormCheckbox
					label="Invalid with errorText"
					invalid
					errorText="Error message"
				/>
				<FormCheckbox
					label="Invalid with helpText"
					validateStatus="error"
					helpText="Error via helpText"
				/>
				<FormCheckbox label="Required" required />
				<FormCheckbox label="With Helper" helperText="Helper text" />
				<FormCheckbox label="With Extra" extraText="Extra contextual text" />
			</div>
		)
	},
}

export const Sizes: Story = {
	render: function Render() {
		return (
			<div className="flex flex-col gap-4">
				<FormCheckbox label="Small checkbox" size="sm" />
				<FormCheckbox label="Medium checkbox (default)" size="md" />
				<FormCheckbox label="Large checkbox" size="lg" />
			</div>
		)
	},
}

export const IndeterminateExample: Story = {
	render: function Render() {
		const [items, setItems] = useState([
			{ id: 1, name: "Item A", checked: false },
			{ id: 2, name: "Item B", checked: true },
			{ id: 3, name: "Item C", checked: true },
		])

		const checkedCount = items.filter((item) => item.checked).length
		const allChecked = checkedCount === items.length
		const noneChecked = checkedCount === 0
		const isIndeterminate = !allChecked && !noneChecked

		const handleParentChange = (checked: boolean) => {
			setItems((prevItems) => prevItems.map((item) => ({ ...item, checked })))
		}

		const handleChildChange = (id: number, checked: boolean) => {
			setItems((prevItems) =>
				prevItems.map((item) =>
					item.id === id ? { ...item, checked } : item
				)
			)
		}

		return (
			<div className="w-64 rounded border p-4">
				<FormCheckbox
					checked={allChecked}
					indeterminate={isIndeterminate}
					label={`Select All (${checkedCount}/${items.length})`}
					onCheckedChange={handleParentChange}
				/>

				<div className="mt-4 space-y-2 pl-6">
					{items.map((item) => (
						<FormCheckbox
							key={item.id}
							checked={item.checked}
							label={item.name}
							onCheckedChange={(checked) => handleChildChange(item.id, checked)}
						/>
					))}
				</div>
			</div>
		)
	},
}

export const Controlled: Story = {
	render: function Render() {
		const [checked, setChecked] = useState(false)

		return (
			<div className="flex flex-col gap-4">
				<FormCheckbox
					checked={checked}
					label={`Checkbox is ${checked ? "checked" : "unchecked"}`}
					onCheckedChange={setChecked}
				/>
				<button
					type="button"
					className="rounded bg-blue-500 px-4 py-2 text-white"
					onClick={() => setChecked(!checked)}
				>
					Toggle from outside
				</button>
			</div>
		)
	},
}
