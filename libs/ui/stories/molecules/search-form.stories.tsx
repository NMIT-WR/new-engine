import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { VariantContainer, VariantGroup } from "../../.storybook/decorator"
import { SearchForm } from "../../src/molecules/search-form"

const meta: Meta<typeof SearchForm> = {
	title: "Molecules/SearchForm",
	component: SearchForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Search form component using compound pattern for flexible composition.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Controls the size of all search form elements",
		},
	},
}

export default meta
type Story = StoryObj<typeof SearchForm>

export const Default: Story = {
	render: () => (
		<div className="w-sm">
			<SearchForm onSubmit={() => console.log("submit")}>
				<SearchForm.Control>
					<SearchForm.Input placeholder="Search products..." />
					<SearchForm.Button>Search</SearchForm.Button>
				</SearchForm.Control>
			</SearchForm>
		</div>
	),
}

export const WithLabel: Story = {
	render: () => (
		<div className="w-sm">
			<SearchForm size="sm">
				<SearchForm.Label>What are you looking for?</SearchForm.Label>
				<SearchForm.Control>
					<SearchForm.Input placeholder="Search products, articles..." />
					<SearchForm.Button>Search</SearchForm.Button>
				</SearchForm.Control>
			</SearchForm>
		</div>
	),
}

export const IconButton: Story = {
	render: () => (
		<div className="w-sm">
			<SearchForm size="sm">
				<SearchForm.Control>
					<SearchForm.Input placeholder="Search..." />
					<SearchForm.Button showSearchIcon />
				</SearchForm.Control>
			</SearchForm>
		</div>
	),
}

export const WithoutButton: Story = {
	render: () => (
		<div className="w-sm">
			<SearchForm onValueChange={(v) => console.log("typing:", v)}>
				<SearchForm.Control>
					<SearchForm.Input placeholder="Type to search..." />
				</SearchForm.Control>
			</SearchForm>
		</div>
	),
}

function ControlledExample() {
	const [value, setValue] = useState("")

	return (
		<div className="w-sm flex flex-col gap-4">
			<SearchForm value={value} onValueChange={setValue}>
				<SearchForm.Control>
					<SearchForm.Input placeholder="Controlled input..." />
					<SearchForm.ClearButton />
					<SearchForm.Button showSearchIcon variant="primary" />
				</SearchForm.Control>
			</SearchForm>
			<p className="text-sm text-gray-500">Current value: "{value}"</p>
		</div>
	)
}

export const Controlled: Story = {
	render: () => <ControlledExample />,
}

export const WithClearButton: Story = {
	render: () => (
		<div className="w-sm">
			<SearchForm defaultValue="Initial search term" size="sm">
				<SearchForm.Control>
					<SearchForm.Input placeholder="Search..." />
					<SearchForm.ClearButton />
					<SearchForm.Button>Search</SearchForm.Button>
				</SearchForm.Control>
			</SearchForm>
		</div>
	),
}

export const Sizes: Story = {
	render: () => (
		<VariantContainer>
			<VariantGroup title="Small" fullWidth>
				<SearchForm size="sm">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Small search..." />
						<SearchForm.Button showSearchIcon />
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>

			<VariantGroup title="Medium (default)" fullWidth>
				<SearchForm size="md">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Medium search..." />
						<SearchForm.Button>Search</SearchForm.Button>
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>

			<VariantGroup title="Large" fullWidth>
				<SearchForm size="lg">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Large search..." />
						<SearchForm.Button>Search</SearchForm.Button>
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>
		</VariantContainer>
	),
}

export const ButtonThemes: Story = {
	render: () => (
		<VariantContainer>
			<VariantGroup title="Solid (default)" fullWidth>
				<SearchForm size="sm">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Search..." />
						<SearchForm.Button theme="solid">Search</SearchForm.Button>
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>

			<VariantGroup title="Borderless" fullWidth>
				<SearchForm size="sm">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Search..." />
						<SearchForm.Button theme="borderless" showSearchIcon />
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>

			<VariantGroup title="Outlined" fullWidth>
				<SearchForm size="sm">
					<SearchForm.Control>
						<SearchForm.Input placeholder="Search..." />
						<SearchForm.Button theme="outlined">Search</SearchForm.Button>
					</SearchForm.Control>
				</SearchForm>
			</VariantGroup>
		</VariantContainer>
	),
}


function SubmitExample() {
	const [submitted, setSubmitted] = useState<string | null>(null)

	return (
		<div className="w-sm flex flex-col gap-4">
			<SearchForm
				size="sm"
				onSubmit={(e) => {
					const formData = new FormData(e.currentTarget)
					// Note: we need to add name prop to input for this to work
					setSubmitted(`Form submitted!`)
				}}
				onValueChange={(v) => setSubmitted(null)}
			>
				<SearchForm.Control>
					<SearchForm.Input placeholder="Search and press Enter..." />
					<SearchForm.Button>Search</SearchForm.Button>
				</SearchForm.Control>
			</SearchForm>
			{submitted && (
				<p className="text-sm text-green-600">{submitted}</p>
			)}
		</div>
	)
}

export const FormSubmission: Story = {
	render: () => <SubmitExample />,
}