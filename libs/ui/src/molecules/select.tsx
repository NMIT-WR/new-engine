import * as select from "@zag-js/select";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { useId } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { Label } from "../atoms/label";
import { Error } from "../atoms/error";
import { ExtraText } from "../atoms/extra-text";

// === TYPES ===
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  [key: string]: any;
}

// === COMPONENT VARIANTS ===
const selectVariants = tv({
  slots: {
    root: [
      "relative bg-select-root-bg",
      "flex flex-col gap-select-root",
      "w-full",
    ],
    control: ["flex relative items-center justify-between", "w-full"],
    positioner: ["w-(--reference-width)", "isolate z-(--z-index)"],
    trigger: [
      "w-full",
      "p-select-trigger",
      "bg-select-trigger-bg",
      "border border-select-trigger-border rounded-select",
      "text-select-trigger text-left",
      "hover:bg-select-trigger-hover",
      "focus:outline-none focus:ring-2 focus:ring-select-trigger-focus focus:ring-offset-2",
      "data-[disabled]:cursor-not-allowed",
      "data-[invalid]:border-select-danger data-[invalid]:ring-select-danger",
    ],
    clearTrigger: [
      "absolute right-10 h-full",
      "p-select-clear-trigger",
      "hover:bg-select-clear-trigger-bg",
      "text-select-clear-trigger-fg hover:text-select-danger",
      "focus:text-select-danger",
      "focus:outline-none focus:ring-offset-transparent focus:ring-transparent",
    ],
    content: [
      "bg-select-content-bg border border-select-content-border",
      "rounded-select shadow-select-content-shadow",
      "h-[calc(var(--available-height)-var(--spacing-lg))]",
      "overflow-auto",
    ],
    item: [
      "flex items-center justify-between",
      "bg-select-item-bg cursor-pointer",
      "p-select-item",
      "text-select-item-fg",
      "hover:bg-select-item-hover",
      "data-[state=checked]:bg-select-item-selected-bg",
      "data-[state=checked]:text-select-item-selected-fg",
      "data-[disabled]:opacity-select-disabled data-[disabled]:cursor-not-allowed",
    ],
    itemIndicator: ["text-select-indicator"],
  },
  variants: {
    size: {
      sm: {
        trigger: "text-sm",
        item: "text-sm",
      },
      md: {
        trigger: "text-md",
        item: "text-md",
      },
      lg: {
        trigger: "text-lg",
        item: "text-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// === COMPONENT PROPS ===
export interface SelectProps
  extends VariantProps<typeof selectVariants>,
    Omit<select.Props, "collection"> {
  // Data
  options: SelectOption[];
  // Labels
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  // Classes
  className?: string;
}

export function Select({
  // Core props
  options,
  label,
  placeholder = "Select an option",
  // Variants
  size = "md",
  value,
  defaultValue,
  multiple = false,
  disabled = false,
  invalid = false,
  required = false,
  readOnly = false,
  errorText,
  helperText,
  closeOnSelect = true,
  loopFocus = true,
  // Form
  name,
  form,
  // Event handlers
  onValueChange,
  onOpenChange,
  onHighlightChange,
  // HTML props
  className,
  id: providedId,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  // Create collection
  const collection = select.collection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    // some conditional for examble item.quantity === 0 etc.
    isItemDisabled: (item) => !!item.disabled,
  });

  const service = useMachine(select.machine as any, {
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
  });

  const api = select.connect(service as select.Service, normalizeProps);

  const {
    root,
    control,
    trigger,
    clearTrigger,
    content,
    positioner,
    item,
    itemIndicator,
  } = selectVariants({ size });

  return (
    <form>
      {/* Hidden form select for native form submission */}
      <select {...api.getHiddenSelectProps()}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <div className={root({ className })} {...api.getRootProps()}>
        {label && (
          <Label size={size} {...api.getLabelProps()}>
            {label}
          </Label>
        )}
        <div className={control()} {...api.getControlProps()}>
          <Button
            theme="borderless"
            className={trigger()}
            {...api.getTriggerProps()}
            icon={
              api.open
                ? "token-icon-select-indicator-open"
                : "token-icon-select-indicator"
            }
            iconPosition="right"
          >
            <span
              className="data-[placeholder]:text-select-placeholdr flex-grow truncate"
              data-placeholder={api.valueAsString === ""}
            >
              {api.valueAsString || placeholder}
            </span>
          </Button>
          <Button
            theme="borderless"
            {...api.getClearTriggerProps()}
            className={clearTrigger()}
            aria-label="Clear selection"
            icon="token-icon-select-clear"
          />
        </div>
        {/* Dropdown content portal */}
        <Portal>
          <div className={positioner()} {...api.getPositionerProps()}>
            <ul className={content()} {...api.getContentProps()}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={item()}
                  {...api.getItemProps({ item: option })}
                >
                  <span {...api.getItemTextProps({ item: option })}>
                    {option.label}
                  </span>
                  <span
                    className={itemIndicator()}
                    {...api.getItemIndicatorProps({ item: option })}
                  >
                    <Icon icon="token-icon-select-check" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Portal>

        {invalid && <Error>{errorText}</Error>}
        {!invalid && helperText && <ExtraText>{helperText}</ExtraText>}
      </div>
    </form>
  );
}

Select.displayName = "Select";
