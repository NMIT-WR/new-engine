import { type FormEvent, type ReactNode } from "react";
import { tv } from "../utils";
import { Input, type InputProps } from "../atoms/input";
import { Button, type ButtonProps } from "../atoms/button";
import { Label } from "../atoms/label";
import { Icon } from "../atoms/icon";

const searchFormVariants = tv({
  base: ["grid relative"],
  variants: {
    size: {
      sm: "gap-search-form-sm",
      md: "gap-search-form-md",
      lg: "gap-search-form-lg",
    },
    layout: {
      inline: "flex flex-row items-center",
      stacked: "flex flex-col",
    },

    buttonPosition: {
      inside: "absolute right-sm",
      outside: "justify-self-end",
    },
  },
  defaultVariants: {
    layout: "inline",
    fullWidth: true,
  },
});

export interface SearchFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "size"> {
  inputProps?: Omit<InputProps, "size">;
  buttonProps?: Omit<ButtonProps, "size">;
  size?: "sm" | "md" | "lg";
  layout?: "inline" | "stacked";
  label?: ReactNode;
  labelProps?: {
    required?: boolean;
    disabled?: boolean;
  };
  buttonText?: ReactNode;
  buttonIcon?: ButtonProps["icon"];
  placeholder?: string;
  fullWidth?: boolean;
  buttonPosition?: "inside" | "outside";
  ref?: React.Ref<HTMLFormElement>;
  searchId?: string;
}

export function SearchForm({
  inputProps,
  buttonProps,
  size = "md",
  layout = "inline",
  label,
  labelProps,
  buttonPosition = "inside",
  buttonText = "Search",
  buttonIcon = "token-icon-search",
  placeholder = "Search...",
  className,
  ref,
  searchId,
  ...props
}: SearchFormProps) {
  // Generate unique ID for input if not provided
  const id = searchId || `search-${Math.random().toString(36).substring(2, 9)}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Default form handling - could be extended based on needs
    if (props.onSubmit) {
      props.onSubmit(event);
    }
  };

  return (
    <form
      ref={ref}
      className={searchFormVariants({ size, layout, className })}
      onSubmit={handleSubmit}
      role="search"
      {...props}
    >
      {label && (
        <Label
          htmlFor={id}
          size={size}
          required={labelProps?.required}
          disabled={labelProps?.disabled}
        >
          {label}
        </Label>
      )}

      <div className="grid relative">
        <Input
          id={id}
          type="search"
          withIconInside={buttonPosition === "inside" && "right"}
          placeholder={placeholder}
          size={size}
          aria-label={!label ? "Search" : undefined}
          {...inputProps}
        />

        <Button
          type="submit"
          theme="borderless"
          block={false}
          size={size}
          aria-label={buttonText ? undefined : "Search"}
          className={` ${searchFormVariants({
            buttonPosition,
          })} px-0 py-0 place-self-center`}
          {...buttonProps}
        >
          <Icon icon={buttonIcon} size={size} />
        </Button>
      </div>
    </form>
  );
}

SearchForm.displayName = "SearchForm";
