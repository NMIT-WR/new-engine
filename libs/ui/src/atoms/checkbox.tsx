import { type Ref, type InputHTMLAttributes } from "react";
import { tv } from "../utils";

const checkboxVariants = tv({
  base: [
    "appearance-none relative cursor-pointer",
    "h-checkbox w-checkbox",
    "border border-checkbox-border rounded-checkbox",
    "bg-checkbox checked:bg-checkbox-checked checked:border-checkbox",
    /* center icon, grid and place items do not work e.g. flex */
    "after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
    "checked:after:token-icon-checkbox text-icon-text text-checkbox-icon-md",
    "disabled:bg-checkbox-disabled disabled:border-checkbox-border-disabled disabled:cursor-not-allowed",
    "transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-checkbox-ring focus-visible:ring-offset-2",
  ],
});

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ className, ref, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={checkboxVariants({ className })}
      ref={ref}
      {...props}
    />
  );
}

Checkbox.displayName = "Checkbox";
