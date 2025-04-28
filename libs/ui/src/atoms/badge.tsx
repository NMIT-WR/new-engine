import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const badgeVariants = tv({
	base: [
		"inline-flex items-center justify-center",
		"px-badge-x py-badge-y",
		"rounded-badge border-badge",
		"text-badge font-badge",
	],
	variants: {
		// TODO: add backend defined variant
		variant: {
			info: [
				"bg-badge-info-bg text-badge-info-fg border-(length:--border-width-badge-outline) border-badge-border-info",
			],
			outline: [
				"bg-badge-outline-bg text-badge-outline-fg border-(length:--border-width-badge-outline) border-badge-border-outline",
			],
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
	return (
		<span className={badgeVariants({ variant, className })} {...props}>
			{children}
		</span>
	);
}
