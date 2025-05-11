import { useId, type ReactNode } from "react";
import { tv } from "../utils";
import { Input, type InputProps } from "../atoms/input";
import { Button, type ButtonProps } from "../atoms/button";
import { Label } from "../atoms/label";
import { Icon } from "../atoms/icon";
import type { VariantProps } from "tailwind-variants";

// icon size looks too small if it is the same as the text
const iconSizeMap = {
	sm: "lg",
	md: "xl",
	lg: "2xl",
} as const;

const formVariants = tv({
	base: ["grid relative"],
	variants: {
		size: {
			sm: "gap-search-form-sm",
			md: "gap-search-form-md",
			lg: "gap-search-form-lg",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const inputWrapperVariants = tv({
	base: ["grid relative overflow-hidden rounded-md"],
	variants: {
		size: {
			sm: "gap-search-form-sm",
			md: "gap-search-form-md",
			lg: "gap-search-form-lg",
		},
	},
});

// make option to style button
const buttonVariants = tv({
	base: [
		"absolute",
		"justify-self-end place-self-center",
		"h-full rounded-none px-xs py-xs",
	],
});

export interface SearchFormProps
	extends VariantProps<typeof formVariants>,
		Omit<React.FormHTMLAttributes<HTMLFormElement>, "size"> {
	inputProps?: Omit<InputProps, "size">;
	buttonProps?: Omit<ButtonProps, "size">;
	label?: ReactNode;
	buttonText?: ReactNode;
	buttonIcon?: boolean;
	placeholder?: string;
	ref?: React.Ref<HTMLFormElement>;
	searchId?: string;
}

export function SearchForm({
	inputProps,
	buttonProps,
	size = "md",
	buttonText,
	buttonIcon = false,
	placeholder = "Search...",
	label,
	className,
	ref,
	searchId,
	...props
}: SearchFormProps) {
	// Generate unique ID for input if not provided
	const fallbackId = useId();
	const id = searchId || `search-${fallbackId}`;

	const withButton = !!buttonText || buttonIcon;
	const iconSize = iconSizeMap[size] || "lg";

	return (
		<search>
			<form
				ref={ref}
				className={formVariants({ size, className })}
				onSubmit={props.onSubmit}
				{...props}
			>
				{label && (
					<Label htmlFor={id} size={size}>
						{label}
					</Label>
				)}
				<div className={inputWrapperVariants({ size })}>
					<Input
						id={id}
						type="search"
						withButtonInside={withButton && "right"}
						placeholder={placeholder}
						size={size}
						aria-label={!label ? "Search" : undefined}
						{...inputProps}
					/>
					{withButton && (
						<Button
							type="submit"
							theme={buttonProps?.theme || "borderless"}
							block={false}
							size={size}
							aria-label={buttonText ? undefined : "Search"}
							className={buttonVariants({
								className: !buttonText ? "aspect-square" : "",
							})}
							{...buttonProps}
						>
							{buttonText}
							{buttonIcon && (
								<Icon icon={"token-icon-search"} size={iconSize} />
							)}
						</Button>
					)}
				</div>
			</form>
		</search>
	);
}

SearchForm.displayName = "SearchForm";
