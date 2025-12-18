import { normalizeProps, Portal, useMachine } from "@zag-js/react"
import * as select from "@zag-js/select"
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  type Ref,
  useContext,
  useId,
} from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { Button } from "../atoms/button"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Icon } from "../atoms/icon"
import { Label } from "../atoms/label"

// === TYPES ===
export type SelectSize = "xs" | "sm" | "md" | "lg"

export type SelectItem = {
  label: ReactNode
  value: string
  disabled?: boolean
  displayValue?: string
  [key: string]: unknown
}

// === COMPONENT VARIANTS ===
const selectVariants = tv({
  slots: {
    root: ["relative", "flex flex-col gap-select-root", "w-full"],
    control: ["relative flex items-center justify-between", "w-full"],
    positioner: ["w-(--reference-width)", "isolate z-(--z-index)"],
    trigger: [
      "w-full",
      "p-select-trigger",
      "rounded-select border border-select-trigger-border",
      "text-left",
      "hover:bg-select-trigger-bg-hover",
      "focus:border-select-trigger-border-focus focus:outline-none",
      "data-[disabled]:cursor-not-allowed",
      "data-[disabled]:bg-select-bg-disabled",
      "data-[disabled]:text-select-fg-disabled",
      "data-[disabled]:border-select-border-disabled",
      "data-[invalid]:border-select-danger data-[invalid]:ring-select-danger",
    ],
    clearTrigger: [
      "absolute right-select-right h-full",
      "p-select-clear-trigger",
      "hover:bg-select-clear-trigger-bg",
      "text-select-clear-trigger-fg hover:text-select-danger",
      "focus:text-select-danger",
      "focus:outline-none focus:ring-transparent focus:ring-offset-transparent",
    ],
    content: [
      "border border-select-content-border bg-select-content-bg",
      "max-h-fit rounded-select shadow-select-content",
      "h-[calc(var(--available-height)-var(--spacing-content))]",
      "z-(--z-content) overflow-auto",
    ],
    item: [
      "flex items-center justify-between",
      "cursor-pointer bg-select-item-bg",
      "p-select-item",
      "text-select-item-fg",
      "hover:bg-select-item-bg-hover",
      "data-[highlighted]:bg-select-item-bg-hover",
      "data-[state=checked]:bg-select-item-bg-selected",
      "data-[state=checked]:text-select-item-selected-fg",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-select-fg-disabled",
    ],
    itemIndicator: ["text-select-indicator"],
    itemText: ["flex-grow"],
    itemGroup: [""],
    itemGroupLabel: [
      "px-select-item py-select-item",
      "font-medium text-select-fg-disabled text-sm",
    ],
    valueText: [
      "flex-grow truncate data-[placeholder]:text-select-placeholder",
    ],
  },
  variants: {
    size: {
      xs: {
        trigger: "text-select-trigger-xs",
        item: "text-select-item-xs",
        valueText: "text-select-value-xs",
      },
      sm: {
        trigger: "text-select-trigger-sm",
        item: "text-select-item-sm",
        valueText: "text-select-value-sm",
      },
      md: {
        trigger: "text-select-trigger-md",
        item: "text-select-item-md",
        valueText: "text-select-value-md",
      },
      lg: {
        trigger: "text-select-trigger-lg",
        item: "text-select-item-lg",
        valueText: "text-select-value-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// === CONTEXTS ===
type SelectContextValue = {
  api: ReturnType<typeof select.connect>
  size: SelectSize
  items: SelectItem[]
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within Select.Root")
  }
  return context
}

// Item context for sharing item-specific state
type SelectItemContextValue = {
  item: SelectItem
}

const SelectItemContext = createContext<SelectItemContextValue | null>(null)

function useSelectItemContext() {
  const context = useContext(SelectItemContext)
  if (!context) {
    throw new Error("Select.Item components must be used within Select.Item")
  }
  return context
}

// === ROOT COMPONENT ===
export interface SelectProps
  extends VariantProps<typeof selectVariants>,
    Omit<select.Props, "collection" | "id"> {
  items: SelectItem[]
  id?: string
  className?: string
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

export function Select({
  // Data
  items,
  id: providedId,
  // Variants
  size = "md",
  // Zag.js props
  value,
  defaultValue,
  multiple = false,
  disabled = false,
  invalid = false,
  required = false,
  readOnly = false,
  closeOnSelect = true,
  loopFocus = true,
  name,
  form,
  onValueChange,
  onOpenChange,
  onHighlightChange,
  // Component props
  className,
  children,
  ref,
}: SelectProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const collection = select.collection({
    items,
    itemToString: (item) => item.displayValue || item.value,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => !!item.disabled,
  })

  const service = useMachine(select.machine, {
    id,
    collection,
    name,
    form,
    multiple,
    disabled,
    invalid,
    required,
    readOnly,
    closeOnSelect,
    loopFocus,
    defaultValue,
    value,
    onValueChange,
    onOpenChange,
    onHighlightChange,
  })

  const api = select.connect(service as select.Service, normalizeProps)
  const styles = selectVariants({ size })

  return (
    <SelectContext.Provider value={{ api, size, items }}>
      {/* Hidden form select for native form submission */}
      <select {...api.getHiddenSelectProps()}>
        {items.map((item) => (
          <option disabled={item.disabled} key={item.value} value={item.value}>
            {item.displayValue || item.value}
          </option>
        ))}
      </select>

      <div
        className={styles.root({ className })}
        ref={ref}
        {...api.getRootProps()}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// === LABEL COMPONENT ===
interface SelectLabelProps extends ComponentPropsWithoutRef<"label"> {
  ref?: Ref<HTMLLabelElement>
}

Select.Label = function SelectLabel({
  children,
  className,
  ref,
  ...props
}: SelectLabelProps) {
  const { api } = useSelectContext()

  return (
    <Label {...api.getLabelProps()} {...props}>
      {children}
    </Label>
  )
}

// === CONTROL COMPONENT ===
interface SelectControlProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

Select.Control = function SelectControl({
  children,
  className,
  ref,
  ...props
}: SelectControlProps) {
  const { api, size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <div
      className={styles.control({ className })}
      ref={ref}
      {...api.getControlProps()}
      {...props}
    >
      {children}
    </div>
  )
}

// === TRIGGER COMPONENT ===
interface SelectTriggerProps extends ComponentPropsWithoutRef<"button"> {
  size?: SelectSize
  ref?: Ref<HTMLButtonElement>
}

Select.Trigger = function SelectTrigger({
  children,
  className,
  size: sizeProp,
  ref,
  ...props
}: SelectTriggerProps) {
  const { api, size: contextSize } = useSelectContext()
  const effectiveSize = sizeProp ?? contextSize
  const styles = selectVariants({ size: effectiveSize })

  return (
    <Button
      className={styles.trigger({ className })}
      ref={ref}
      size="current"
      theme="unstyled"
      {...api.getTriggerProps()}
      icon={
        api.open
          ? "token-icon-select-indicator-open"
          : "token-icon-select-indicator"
      }
      iconPosition="right"
      {...props}
    >
      {children}
    </Button>
  )
}

// === VALUE TEXT COMPONENT ===
interface SelectValueTextProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  placeholder?: string
  size?: SelectSize
  ref?: Ref<HTMLSpanElement>
  children?: ReactNode | ((items: SelectItem[]) => ReactNode)
}

Select.ValueText = function SelectValueText({
  placeholder = "Select an option",
  className,
  size: sizeProp,
  ref,
  children,
  ...props
}: SelectValueTextProps) {
  const { api, size: contextSize, items } = useSelectContext()
  const effectiveSize = sizeProp ?? contextSize
  const styles = selectVariants({ size: effectiveSize })

  const hasValue = api.value.length > 0
  const selectedItems = api.value
    .map((v) => items.find((item) => item.value === v))
    .filter(Boolean) as SelectItem[]

  // Render function pattern for custom display
  const renderContent = () => {
    if (!hasValue) {
      return placeholder
    }

    if (typeof children === "function") {
      return children(selectedItems)
    }

    return selectedItems[0]?.label
  }

  return (
    <span
      className={styles.valueText({ className })}
      data-placeholder={!hasValue || undefined}
      ref={ref}
      {...props}
    >
      {renderContent()}
    </span>
  )
}

// === CLEAR TRIGGER COMPONENT ===
interface SelectClearTriggerProps extends ComponentPropsWithoutRef<"button"> {
  ref?: Ref<HTMLButtonElement>
}

Select.ClearTrigger = function SelectClearTrigger({
  className,
  ref,
  ...props
}: SelectClearTriggerProps) {
  const { api, size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <Button
      className={styles.clearTrigger({ className })}
      ref={ref}
      size="current"
      theme="unstyled"
      {...api.getClearTriggerProps()}
      aria-label="Clear selection"
      icon="token-icon-select-clear"
      {...props}
    />
  )
}

// === POSITIONER COMPONENT ===
interface SelectPositionerProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

Select.Positioner = function SelectPositioner({
  children,
  className,
  ref,
  ...props
}: SelectPositionerProps) {
  const { api, size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <Portal>
      <div
        className={styles.positioner({ className })}
        ref={ref}
        {...api.getPositionerProps()}
        {...props}
      >
        {children}
      </div>
    </Portal>
  )
}

// === CONTENT COMPONENT ===
interface SelectContentProps extends ComponentPropsWithoutRef<"ul"> {
  ref?: Ref<HTMLUListElement>
}

Select.Content = function SelectContent({
  children,
  className,
  ref,
  ...props
}: SelectContentProps) {
  const { api, size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <ul
      className={styles.content({ className })}
      ref={ref}
      {...api.getContentProps()}
      {...props}
    >
      {children}
    </ul>
  )
}

// === ITEM GROUP COMPONENT ===
interface SelectItemGroupProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

Select.ItemGroup = function SelectItemGroup({
  children,
  className,
  ref,
  ...props
}: SelectItemGroupProps) {
  const { size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <div className={styles.itemGroup({ className })} ref={ref} {...props}>
      {children}
    </div>
  )
}

// === ITEM GROUP LABEL COMPONENT ===
interface SelectItemGroupLabelProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

Select.ItemGroupLabel = function SelectItemGroupLabel({
  children,
  className,
  ref,
  ...props
}: SelectItemGroupLabelProps) {
  const { size } = useSelectContext()
  const styles = selectVariants({ size })

  return (
    <div className={styles.itemGroupLabel({ className })} ref={ref} {...props}>
      {children}
    </div>
  )
}

// === ITEM COMPONENT ===
interface SelectItemProps extends ComponentPropsWithoutRef<"li"> {
  item: SelectItem
  size?: SelectSize
  ref?: Ref<HTMLLIElement>
}

Select.Item = function SelectItem({
  item,
  children,
  className,
  size: sizeProp,
  ref,
  ...props
}: SelectItemProps) {
  const { api, size: contextSize } = useSelectContext()
  const effectiveSize = sizeProp ?? contextSize
  const styles = selectVariants({ size: effectiveSize })

  return (
    <SelectItemContext.Provider value={{ item }}>
      <li
        className={styles.item({ className })}
        ref={ref}
        {...api.getItemProps({ item })}
        {...props}
      >
        {children}
      </li>
    </SelectItemContext.Provider>
  )
}

// === ITEM TEXT COMPONENT ===
interface SelectItemTextProps extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>
}

Select.ItemText = function SelectItemText({
  children,
  className,
  ref,
  ...props
}: SelectItemTextProps) {
  const { api, size } = useSelectContext()
  const { item } = useSelectItemContext()
  const styles = selectVariants({ size })

  return (
    <span
      className={styles.itemText({ className })}
      ref={ref}
      {...api.getItemTextProps({ item })}
      {...props}
    >
      {children || item.label}
    </span>
  )
}

// === ITEM INDICATOR COMPONENT ===
interface SelectItemIndicatorProps extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>
}

Select.ItemIndicator = function SelectItemIndicator({
  className,
  ref,
  ...props
}: SelectItemIndicatorProps) {
  const { api, size } = useSelectContext()
  const { item } = useSelectItemContext()
  const styles = selectVariants({ size })

  return (
    <span
      className={styles.itemIndicator({ className })}
      ref={ref}
      {...api.getItemIndicatorProps({ item })}
      {...props}
    >
      <Icon icon="token-icon-select-check" />
    </span>
  )
}

// === HELPER TEXT COMPONENTS ===
interface SelectErrorTextProps extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>
}

Select.ErrorText = function SelectErrorText({
  children,
  ref,
  ...props
}: SelectErrorTextProps) {
  return <ErrorText {...props}>{children}</ErrorText>
}

interface SelectHelperTextProps extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>
}

Select.HelperText = function SelectHelperText({
  children,
  ref,
  ...props
}: SelectHelperTextProps) {
  return <ExtraText {...props}>{children}</ExtraText>
}

// === CONTEXT HOOK EXPORT ===
export { useSelectContext, selectVariants }

// === DISPLAY NAME ===
Select.displayName = "Select"
