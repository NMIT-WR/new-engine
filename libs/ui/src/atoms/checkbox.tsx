import { type Ref, type InputHTMLAttributes, useId, useEffect } from "react";
import * as checkbox from "@zag-js/checkbox";
import { tv } from "../utils";
import { normalizeProps, useMachine } from "@zag-js/react";

const checkboxVariants = tv({
  base: [
    "appearance-none relative cursor-pointer",
    "h-checkbox w-checkbox",
    "border border-checkbox-border rounded-checkbox",
    "bg-checkbox data-[state=checked]:bg-checkbox-checked border-checkbox",
    /* center icon, grid and place items do not work e.g. flex */
    "after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
    "data-[state=checked]:after:token-icon-checkbox text-icon-text data-[state=checked]:text-checkbox-icon-md",
    "data-[disabled]:opacity-checkbox-disabled data-[disabled]:cursor-not-allowed data-[disabled]:grayscale",
    "transition-all duration-200",
    "data-[focus]:outline-none data-[focus]:ring-2 data-[focus]:ring-checkbox-ring data-[focus]:ring-offset-checkbox-offset data-[focus]:ring-offset-2",
    "data-[invalid=true]:ring-checkbox-error ",
    "data-[invalid=true]:border-checkbox-border-error",
    "data-[state=indeterminate]:bg-checkbox-indeterminate",
    "data-[state=indeterminate]:after:w-indeterminate data-[state=indeterminate]:after:h-indeterminate",
    "data-[state=indeterminate]:after:bg-icon-text ",
  ],
});

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  readonly?: boolean;

  defaultChecked?: boolean;
  indeterminate?: boolean;
  "aria-invalid"?: boolean;
}

export function Checkbox({
  id,
  name,
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  onChange,
  className,
  "aria-invalid": ariaInvalid,
  readonly,
}: CheckboxProps) {
  const service = useMachine(checkbox.machine as any, {
    id: id || useId(),
    name,
    disabled,
    defaultChecked,
    readonly,
    checked: indeterminate ? "indeterminate" : checked,
    "aria-invalid": ariaInvalid,
    onCheckedChange: (details: any) => {
      onChange?.(details.checked);
    },
  });

  const api = checkbox.connect(service as any, normalizeProps);

  useEffect(() => {
    if (indeterminate) {
      console.log(
        "Control element data attributes:",
        document.querySelector('[data-part="control"]')?.attributes
      );
    }
  }, [indeterminate]);

  return (
    <label {...api.getRootProps()}>
      <div
        {...api.getControlProps()}
        className={checkboxVariants({
          className,
        })}
        data-invalid={ariaInvalid}
      />
      <input {...api.getHiddenInputProps()} />
    </label>
  );
}

Checkbox.displayName = "Checkbox";
