import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  toast,
  Text,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { sdk } from "../../../lib/sdk"

type PplConfigResponse = {
  id: string
  environment: string
  is_enabled: boolean
  client_id: string | null
  client_secret_set: boolean
  default_label_format: string
  cod_bank_account_set: boolean
  cod_bank_code_set: boolean
  cod_iban_set: boolean
  cod_swift_set: boolean
  sender_name: string | null
  sender_street: string | null
  sender_city: string | null
  sender_zip_code: string | null
  sender_country: string | null
  sender_phone: string | null
  sender_email: string | null
}

type PplConfigInput = {
  is_enabled?: boolean
  client_id?: string
  client_secret?: string | null
  default_label_format?: string
  cod_bank_account?: string | null
  cod_bank_code?: string | null
  cod_iban?: string | null
  cod_swift?: string | null
  sender_name?: string
  sender_street?: string
  sender_city?: string
  sender_zip_code?: string
  sender_country?: string
  sender_phone?: string
  sender_email?: string
}

/** Fields that can be cleared (encrypted in DB) */
const CLEARABLE_FIELDS = new Set([
  "client_secret",
  "cod_bank_account",
  "cod_bank_code",
  "cod_iban",
  "cod_swift",
])

const LABEL_FORMATS = [
  { value: "Png", label: "PNG" },
  { value: "Pdf", label: "PDF" },
  { value: "Zpl", label: "ZPL" },
]

type FieldConfig = {
  field: keyof PplConfigInput
  label: string
  placeholder: string
  type?: "text" | "password" | "email"
  isSet?: boolean
  colSpan?: 1 | 2
}

const FormField = ({
  config,
  value,
  onChange,
  onClear,
  isCleared,
}: {
  config: FieldConfig
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  isCleared?: boolean
}) => {
  const inputId = `ppl-${config.field}`
  const canClear = CLEARABLE_FIELDS.has(config.field) && config.isSet && !isCleared

  return (
    <div className={`flex flex-col gap-2 ${config.colSpan === 2 ? "col-span-2" : ""}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId}>
          {config.label}{" "}
          {isCleared ? (
            <span className="text-ui-fg-error">(will be cleared)</span>
          ) : (
            config.isSet && <span className="text-ui-fg-subtle">(set)</span>
          )}
        </Label>
        {canClear && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-ui-fg-subtle hover:text-ui-fg-error text-sm"
          >
            Clear
          </button>
        )}
      </div>
      <Input
        id={inputId}
        type={config.type || "text"}
        value={isCleared ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isCleared ? "Value will be cleared" : (config.isSet ? "Leave empty to keep" : config.placeholder)}
        disabled={isCleared}
      />
    </div>
  )
}

const PplSettingsPage = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<PplConfigInput>({})
  const [clearedFields, setClearedFields] = useState<Set<string>>(new Set())

  const { data, isLoading, error } = useQuery({
    queryFn: () =>
      sdk.client.fetch<{ config: PplConfigResponse }>("/admin/ppl-config"),
    queryKey: ["ppl-config"],
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PplConfigInput) =>
      sdk.client.fetch("/admin/ppl-config", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ppl-config"] })
      toast.success("PPL configuration saved")
    },
    onError: (err) => {
      toast.error(`Failed to save configuration: ${err.message}`)
    },
  })

  const config = data?.config

  useEffect(() => {
    if (config) {
      setFormData({
        is_enabled: config.is_enabled,
        client_id: config.client_id || "",
        default_label_format: config.default_label_format,
        sender_name: config.sender_name || "",
        sender_street: config.sender_street || "",
        sender_city: config.sender_city || "",
        sender_zip_code: config.sender_zip_code || "",
        sender_country: config.sender_country || "",
        sender_phone: config.sender_phone || "",
        sender_email: config.sender_email || "",
      })
      setClearedFields(new Set())
    }
  }, [config])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Set cleared fields to null in the payload
    const payload = { ...formData }
    for (const field of clearedFields) {
      payload[field as keyof PplConfigInput] = null as never
    }
    mutate(payload)
  }

  const updateField = (field: keyof PplConfigInput, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // If user types in a cleared field, unmark it
    if (clearedFields.has(field)) {
      setClearedFields((prev) => {
        const next = new Set(prev)
        next.delete(field)
        return next
      })
    }
  }

  const clearField = (field: string) => {
    setClearedFields((prev) => new Set(prev).add(field))
  }

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">PPL Configuration</Heading>
        </div>
        <div className="px-6 py-4">
          <Text>Loading...</Text>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h1">PPL Configuration</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-error">
            Error loading configuration. Make sure the PPL module is enabled.
          </Text>
        </div>
      </Container>
    )
  }

  const credentialFields: FieldConfig[] = [
    { field: "client_id", label: "Client ID", placeholder: "Your PPL Client ID" },
    {
      field: "client_secret",
      label: "Client Secret",
      placeholder: "Your PPL Client Secret",
      type: "password",
      isSet: config?.client_secret_set,
    },
  ]

  const codFields: FieldConfig[] = [
    { field: "cod_bank_account", label: "Bank Account", placeholder: "Bank account", isSet: config?.cod_bank_account_set },
    { field: "cod_bank_code", label: "Bank Code", placeholder: "Bank code", isSet: config?.cod_bank_code_set },
    { field: "cod_iban", label: "IBAN", placeholder: "IBAN (alternative)", isSet: config?.cod_iban_set },
    { field: "cod_swift", label: "SWIFT", placeholder: "SWIFT (with IBAN)", isSet: config?.cod_swift_set },
  ]

  const senderFields: FieldConfig[] = [
    { field: "sender_name", label: "Name", placeholder: "Company name" },
    { field: "sender_street", label: "Street", placeholder: "Street address" },
    { field: "sender_city", label: "City", placeholder: "City" },
    { field: "sender_zip_code", label: "ZIP Code", placeholder: "Postal code" },
    { field: "sender_country", label: "Country", placeholder: "Country code (e.g., CZ)" },
    { field: "sender_phone", label: "Phone", placeholder: "Phone number" },
    { field: "sender_email", label: "Email", placeholder: "Email address", type: "email", colSpan: 2 },
  ]

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">PPL Configuration</Heading>
        <Text className="text-ui-fg-subtle">Environment: {config?.environment}</Text>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General */}
        <div className="px-6 py-4">
          <Heading level="h2" className="mb-4">General</Heading>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ppl-is-enabled" id="ppl-is-enabled-label">Enable PPL</Label>
                <Text className="text-ui-fg-subtle text-sm">
                  Enable or disable PPL shipping integration
                </Text>
              </div>
              <Switch
                id="ppl-is-enabled"
                aria-labelledby="ppl-is-enabled-label"
                checked={formData.is_enabled ?? false}
                onCheckedChange={(checked) => updateField("is_enabled", checked)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ppl-label-format">Label Format</Label>
              <Select
                value={formData.default_label_format}
                onValueChange={(value) => updateField("default_label_format", value)}
              >
                <Select.Trigger id="ppl-label-format">
                  <Select.Value placeholder="Select format" />
                </Select.Trigger>
                <Select.Content>
                  {LABEL_FORMATS.map((f) => (
                    <Select.Item key={f.value} value={f.value}>{f.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="px-6 py-4 border-t">
          <Heading level="h2" className="mb-4">API Credentials</Heading>
          <div className="grid grid-cols-2 gap-4">
            {credentialFields.map((f) => (
              <FormField
                key={f.field}
                config={f}
                value={(formData[f.field] as string) ?? ""}
                onChange={(v) => updateField(f.field, v)}
                onClear={() => clearField(f.field)}
                isCleared={clearedFields.has(f.field)}
              />
            ))}
          </div>
        </div>

        {/* COD Banking */}
        <div className="px-6 py-4 border-t">
          <Heading level="h2" className="mb-2">COD Banking</Heading>
          <Text className="text-ui-fg-subtle text-sm mb-4">
            Bank details for cash on delivery payments
          </Text>
          <div className="grid grid-cols-2 gap-4">
            {codFields.map((f) => (
              <FormField
                key={f.field}
                config={f}
                value={(formData[f.field] as string) ?? ""}
                onChange={(v) => updateField(f.field, v)}
                onClear={() => clearField(f.field)}
                isCleared={clearedFields.has(f.field)}
              />
            ))}
          </div>
        </div>

        {/* Fallback Sender Address */}
        <div className="px-6 py-4 border-t">
          <Heading level="h2" className="mb-2">Fallback Sender Address</Heading>
          <Text className="text-ui-fg-subtle text-sm mb-4">
            Used when PPL customer has no address configured
          </Text>
          <div className="grid grid-cols-2 gap-4">
            {senderFields.map((f) => (
              <FormField
                key={f.field}
                config={f}
                value={(formData[f.field] as string) ?? ""}
                onChange={(v) => updateField(f.field, v)}
              />
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="px-6 py-4 border-t flex justify-end">
          <Button type="submit" isLoading={isPending}>Save Changes</Button>
        </div>
      </form>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "PPL",
})

export default PplSettingsPage
