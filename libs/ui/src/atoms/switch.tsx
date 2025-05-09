import * as zagSwitch from "@zag-js/switch";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";

const switchVariants = tv({
  slots: {
    root: [
      "inline-flex items-center gap-root",
      "cursor-pointer",
      "data-[disabled]:cursor-not-allowed",
    ],
    control: [
      "relative inline-flex shrink-0 items-center justify-start p-control-padding",
      "bg-switch-bg hover:bg-switch-hover",
      "w-track-width h-track-height",
      "rounded-switch",
      "transition-colors duration-200",
      "border-(length:--border-width-switch) border-switch-border",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-switch-ring focus-visible:ring-offset-2",
      "data-[state=checked]:bg-switch-checked",
      "data-[state=checked]:hover:bg-switch-checked-hover",
      "data-[disabled]:bg-switch-disabled",
      "data-[disabled]:border-switch-border-disabled",
      "data-[disabled]:bg-switch-checked-disabled",
    ],
    thumb: [
      "block rounded-full h-thumb-height aspect-square bg-switch-thumb",
      "transform transition-transform duration-200",
      "data-[disabled]:bg-switch-thumb-disabled",
      "data-[state=checked]:translate-x-translate-track",
    ],
    label: [
      "select-none",
      "text-switch-label",
      "data-[disabled]:text-switch-label-disabled",
    ],
    hiddenInput: "sr-only",
  },
});

export interface SwitchProps extends VariantProps<typeof switchVariants> {
  id?: string;
  name?: string;
  value?: string | number;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  children?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({
  id,
  name,
  value,
  checked,
  defaultChecked,
  disabled = false,
  readOnly = false,
  required = false,
  children,
  className,
  onCheckedChange,
}: SwitchProps) {
  const generatedId = useId();
  const uniqueId = id || generatedId;

  const service = useMachine(zagSwitch.machine, {
    id: uniqueId,
    name,
    value,
    checked,
    defaultChecked,
    disabled,
    readOnly,
    required,
    onCheckedChange: ({ checked }) => onCheckedChange?.(checked),
  });

  const api = zagSwitch.connect(service, normalizeProps);

  const { root, control, thumb, label, hiddenInput } = switchVariants({
    className,
  });

  return (
    <label className={root()} {...api.getRootProps()}>
      <input className={hiddenInput()} {...api.getHiddenInputProps()} />
      <span className={control()} {...api.getControlProps()}>
        <span className={thumb()} {...api.getThumbProps()} />
      </span>
      {children && (
        <span className={label()} {...api.getLabelProps()}>
          {children}
        </span>
      )}
    </label>
  );
}
