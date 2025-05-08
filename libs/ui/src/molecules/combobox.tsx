import * as combobox from "@zag-js/combobox";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Error } from "../atoms/error";
import { ExtraText } from "../atoms/extra-text";

const comboboxVariants = tv({
  slots: {
    root: ["flex flex-col relative w-full gap-combobox-root"],
    label: ["block text-label-md font-label mb-1"],
    control: [
      "flex items-center w-full relative",
      "bg-combobox border-(length:--border-width-input) border-combobox-border rounded-combobox",
      "transition-colors duration-200 ease-in-out",
      "data-[highlighted]:bg-combobox-hover data-[highlighted]:border-combobox-border-hover",
      "data-[focus]:bg-combobox-focus data-[focus]:border-combobox-border-focus",
      "data-[disabled]:bg-combobox-disabled data-[disabled]:border-combobox-border-disabled",
      "data-[invalid]:border-combobox-danger",
    ],
    input: [
      "w-full relative border-none bg-transparent",
      "focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-combobox-input-bg-hover",
      "focus:bg-combobox-input-bg-focused",
      "py-input-md px-input-md",
      "placeholder:text-combobox-placeholder",
      "data-[disabled]:text-combobox-fg-disabled",
      "data-[disabled]:bg-combobox-disabled",
    ],
    clearTrigger: [
      // set styles for button in combobox
      "absolute right-combobox-trigger-right",
    ],
    trigger: [
      "flex items-center justify-center",
      "px-0",
      "transition-transform duration-200",
      "data-[state=open]:rotate-180",
    ],
    positioner: ["z-10 w-full"],
    content: [
      "flex flex-col overflow-clip",
      "rounded-combobox shadow-md",
      "bg-combobox-content-bg",
      "border border-combobox-border",
    ],
    item: [
      "flex items-center px-combobox-item-lg py-combobox-item",
      "first:pt-combobox-item-lg last:pb-combobox-item-lg",
      "text-combobox-item-fg",
      "cursor-pointer",
      "data-[highlighted]:bg-combobox-item-hover",
      "data-[state=checked]:bg-combobox-item-selected",
      "data-[disabled]:text-combobox-fg-disabled data-[disabled]:cursor-not-allowed",
    ],
  },
  compoundSlots: [
    {
      slots: ["clearTrigger", "trigger"],
      class: [
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "text-combobox-trigger text-combobox-trigger-size",
        "hover:text-combobox-trigger-hover",
        "px-combobox-trigger",
        "hover:bg-combobox-trigger-bg-hover",
        "focus-visible:outline-none",
        "active:bg-combobox-trigger-bg-active",
      ],
    },
  ],
  variants: {
    state: {
      normal: {},
      error: {
        control:
          "border-combobox-danger focus-within:ring-combobox-ring-danger",
      },
      success: {
        control:
          "border-combobox-success focus-within:ring-combobox-ring-success",
      },
      warning: {
        control:
          "border-combobox-warning focus-within:ring-combobox-ring-warning",
      },
    },
  },
  defaultVariants: {
    size: "md",
    state: "normal",
  },
});

export type ComboboxItem<T = any> = {
  id: number;
  label: string;
  value: string;
  disabled?: boolean;
  data?: T;
};

export interface ComboboxProps<T = any>
  extends VariantProps<typeof comboboxVariants> {
  //basic props
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  //data and selection
  items: ComboboxItem<T>[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;

  //validation and helper text
  error?: string;
  helper?: string;

  size?: "sm" | "md" | "lg";

  //customization
  clearable?: boolean;
  searchable?: boolean;
  selectionBehavior?: "replace" | "clear" | "preserve";
  closeOnSelect?: boolean;
  allowCustomValue?: boolean;

  // icons
  triggerIcon?: string;
  clearIcon?: string;

  // callbacks
  onChange?: (value: string | string[]) => void;
  onInputValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export function Combobox<T = any>({
  id,
  name,
  label,
  placeholder = "Select option",
  disabled = false,
  readOnly = false,
  required = false,
  items = [],
  value,
  defaultValue,
  multiple = false,
  error,
  helper,
  state = "normal",
  // machine settings
  clearable = true,
  searchable = true,
  selectionBehavior = "replace",
  closeOnSelect = false,
  allowCustomValue = false,
  onChange,
  onInputValueChange,
  onOpenChange,
}: ComboboxProps<T>) {
  const generatedId = useId();
  const uniqueId = id || generatedId;

  const collection = combobox.collection({
    items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => !!item.disabled,
  });

  const service = useMachine(combobox.machine, {
    id: uniqueId,
    name,
    collection,
    disabled,
    readOnly,
    closeOnSelect,
    selectionBehavior,
    allowCustomValue,
    ids: {
      label: `${uniqueId}-label`,
      input: `${uniqueId}-input`,
      control: `${uniqueId}-control`,
    },
    value: value as string[],
    defaultValue: defaultValue as string[],
    multiple,
    onValueChange: ({ value }) => {
      onChange?.(value);
    },
    onInputValueChange: ({ inputValue }) => {
      onInputValueChange?.(inputValue);
    },
    onOpenChange: ({ open }) => {
      onOpenChange?.(open);
    },
  });

  const api = combobox.connect(service, normalizeProps);

  const inputProps = api.getInputProps();
  const { size: _inputSize, ...restInputProps } = inputProps;

  const {
    root,
    label: labelStyles,
    control,
    input,
    trigger,
    positioner,
    content,
    clearTrigger,
    item: itemSlot,
  } = comboboxVariants({ state });

  return (
    <div className={root()}>
      {label && (
        <Label className={labelStyles()} {...api.getLabelProps()}>
          {label}
        </Label>
      )}
      <div className={control()} {...api.getControlProps()}>
        <Input
          className={input()}
          {...restInputProps}
          placeholder={placeholder}
          name={name}
          required={required}
        />

        {clearable && api.value && (
          <Button
            className={clearTrigger()}
            theme="borderless"
            size="sm"
            {...api.getClearTriggerProps()}
          >
            <Icon icon={"token-icon-combobox-clear"} size="current" />
          </Button>
        )}

        <Button
          {...api.getTriggerProps()}
          theme="borderless"
          className={trigger()}
        >
          <Icon icon="token-icon-combobox-chevron" />
        </Button>
      </div>

      {/* Dropdown content */}
      <div {...api.getPositionerProps()} className={positioner()}>
        {api.open && items.length > 0 && (
          <ul {...api.getContentProps()} className={content()}>
            {items.map((item) => (
              <li
                key={item.value}
                {...api.getItemProps({ item })}
                className={itemSlot()}
              >
                <span className="flex-1">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {helper && !error && <ExtraText>{helper}</ExtraText>}
      {error && <Error>{error}</Error>}
    </div>
  );
}
