import { useState, type InputHTMLAttributes, type Ref } from "react";
import { type VariantProps } from "tailwind-variants";
import { tv } from "../utils";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { type IconType } from "../atoms/icon";

const numericInput = tv({
  slots: {
    base: [
      "inline-flex items-center relative",
      "bg-numeric-input-bg border-(length:--border-width-numeric-input) border-numeric-input-border",
      "rounded-input overflow-hidden",
      "has-[input:invalid]:border-danger",
    ],
    input: "text-center border-none w-numeric-input",
    button: "text-increment-btn focus:ring-increment-btn-ring",
  },
  variants: {
    size: {
      sm: {
        input: "",
        button: "text-button-sm",
      },
      md: {
        input: "",
        button: "text-button-md",
      },
      lg: {
        input: "",
        button: "text-button-md",
      },
    },
  },
});

export interface NumericInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "onChange"
    >,
    VariantProps<typeof numericInput> {
  ref?: Ref<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number;
  hideControls?: boolean;
  incrementIcon?: IconType;
  decrementIcon?: IconType;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
  onChange?: (value: number) => void;
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
}

export function NumericInput({
  size = "md",
  disabled,
  min = 0,
  max = 100,
  step = 1,
  hideControls = false,
  incrementIcon = "token-icon-plus",
  decrementIcon = "token-icon-minus",
  className,
  value,
  defaultValue,
  formatValue = String,
  parseValue = (val) => parseInt(val, 10),
  onChange,
  onIncrement,
  onDecrement,
  ref,
  ...props
}: NumericInputProps) {
  const [internalValue, setInternalValue] = useState(() => {
    if (value !== undefined) return Number(value);
    if (defaultValue !== undefined) return Number(defaultValue);
    return min;
  });

  const { base, input, button } = numericInput({
    size,
    className,
  });

  const currentValue = value !== undefined ? Number(value) : internalValue;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseValue(e.target.value);
    if (isNaN(newValue)) return;

    const clampedValue = Math.max(min, Math.min(max, newValue));

    if (value === undefined) {
      setInternalValue(clampedValue);
    }
    onChange?.(clampedValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, currentValue + step);

    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    onIncrement?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, currentValue - step);

    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    onDecrement?.(newValue);
  };

  return (
    <div
      className={base({
        size,
        className,
      })}
    >
      {!hideControls && (
        <Button
          size="sm"
          variant="danger"
          theme="borderless"
          icon={decrementIcon}
          disabled={disabled || currentValue <= min}
          onClick={handleDecrement}
          aria-label="Decrease value"
        />
      )}

      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]+"
        size="sm"
        disabled={disabled}
        defaultValue={defaultValue}
        value={formatValue(currentValue)}
        onChange={handleChange}
        // add className props to input to avoid absolute overwriting the Input styles
        className={input()}
        ref={ref}
        min={min}
        max={max}
        role="spinbutton"
        {...props}
      />

      {!hideControls && (
        <Button
          size="sm"
          variant="primary"
          theme="borderless"
          icon={incrementIcon}
          disabled={disabled || currentValue >= max}
          onClick={handleIncrement}
          aria-label="Increase value"
          className={button()}
        />
      )}
    </div>
  );
}
