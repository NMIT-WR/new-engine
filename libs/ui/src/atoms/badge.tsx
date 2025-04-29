import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const badgeVariants = tv({
	base: [
		"inline-flex items-center justify-center",
		"px-badge-x py-badge-y",
		"rounded-badge border-badge",
		"text-badge-size font-badge",
	],
	variants: {
		variant: {
			info: [
				"bg-badge-info-bg text-badge-info-fg border-(length:--border-width-badge-outline) border-badge-border-info",
			],
			outline: [
				"bg-badge-outline-bg text-badge-outline-fg border-(length:--border-width-badge-outline) border-badge-border-outline",
			],
			dynamic: [
				"border-(length:--border-width-badge-dynamic)",
			],
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

type BaseBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "color"> & {
	className?: string;
	children: string;
};

type DefaultBadgeProps = BaseBadgeProps & {
	variant?: Exclude<BadgeVariant, "dynamic">;
};

type DynamicBadgeProps = BaseBadgeProps & {
	variant: "dynamic";
	bgColor: string;
	fgColor: string;
	borderColor: string;
};

export type BadgeProps = DefaultBadgeProps | DynamicBadgeProps;

export function Badge({
	variant,
	className,
	children,
	style,
	...props
}: BadgeProps) {
	const isDynamic = variant === "dynamic";

	const { bgColor, fgColor, borderColor } = props as Partial<DynamicBadgeProps>;

	const dynamicStyles = isDynamic
		? {
				...style,
				'background-color': bgColor,
				'color': fgColor,
				'border-color': borderColor,
			}
		: style;

	return (
		<span
			className={badgeVariants({ variant, className })}
			style={dynamicStyles}
			{...props}
		>
			{children}
		</span>
	);
}
