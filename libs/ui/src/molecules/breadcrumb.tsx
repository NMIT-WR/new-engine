import { tv, type VariantProps } from "tailwind-variants";
import { Icon, type IconType } from "../atoms/icon";
import { Link } from "../atoms/link";

// === VARIANTS ===
const breadcrumbsVariants = tv({
  slots: {
    root: [
      "flex flex-wrap items-center",
      "text-breadcrumb-fg",
      "py-breadcrumb-root-y",
    ],
    list: ["flex flex-wrap items-center gap-2", "list-none p-0 m-0"],
    item: ["flex items-center", "text-breadcrumb-item-fg"],
    link: [
      "hover:text-breadcrumb-link-hover",
      "focus:outline-none focus:ring-2 focus:ring-breadcrumb-link-ring focus:ring-offset-2",
      "transition-colors duration-200",
    ],
    currentLink: [
      "text-breadcrumb-current-fg",
      "cursor-default",
      "aria-current-page",
    ],
    separator: [
      "mx-breadcrumb-separator-x",
      "text-breadcrumb-separator-fg",
      "flex items-center justify-center",
    ],
    ellipsis: [
      "mx-breadcrumb-ellipsis-x",
      "text-breadcrumb-ellipsis-fg",
      "flex items-center justify-center",
    ],
  },
  compoundSlots: [
    {
      slots: ["link", "currentLink"],
      class: "font-medium",
    },
  ],
  variants: {
    size: {
      sm: {
        root: "text-breadcrumb-sm",
        item: "gap-breadcrumb-sm",
        separator: "gap-breadcrumb-sm",
      },
      md: {
        root: "text-breadcrumb-md",
        item: "gap-breadcrumb-md",
        separator: "gap-breadcrumb-md",
      },
      lg: {
        root: "text-breadcrumb-lg",
        item: "gap-breadcrumb-lg",
        separator: "gap-breadcrumb-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// === TYPES ===
export type BreadcrumbItemType = {
  label: string;
  href?: string;
  icon?: IconType;
  separator?: IconType;
};

function BreadcrumbItem({
  label,
  href,
  icon,
  separator = "token-icon-breadcrumb-separator",
  isCurrentPage,
  lastItem,
}: {
  label: string;
  href?: string;
  icon?: IconType;
  separator?: IconType;
  lastItem: boolean;
  isCurrentPage?: boolean;
}) {
  const { item, currentLink, link } = breadcrumbsVariants({ size: "md" });
  return (
    <li className={item()}>
      {icon && <Icon icon={icon} />}
      <Link
        className={isCurrentPage ? currentLink() : link()}
        href={href || "#"}
      >
        {label}
      </Link>
      {!lastItem && (
        <Icon icon={separator ?? "token-icon-breadcrumb-separator"} />
      )}
    </li>
  );
}
/*
function BreadcrumbSeparator() {
  return (
    <li className={breadcrumbsVariants({ size: "md" }).separator()}>
      <Icon icon="token-icon-chevron-right" />
    </li>
  );
}*/

interface BreadcrumbProps extends VariantProps<typeof breadcrumbsVariants> {
  items: BreadcrumbItemType[];
  maxItems?: number;
  className?: string;
  currentLink?: string;
  "aria-label"?: string;
}

// === COMPONENT ===
export function Breadcrumb({
  items,
  maxItems = 0, // 0 means show all
  size = "md",
  className,
  currentLink,
  "aria-label": ariaLabel = "breadcrumb",
  ...props
}: BreadcrumbProps) {
  const { root, list } = breadcrumbsVariants({ size });

  return (
    <nav className={root({ className })} aria-label={ariaLabel} {...props}>
      <ol className={list()}>
        {items.map((breadcrumb, index) => (
          <BreadcrumbItem
            key={index}
            label={breadcrumb.label}
            href={breadcrumb.href}
            icon={breadcrumb.icon}
            separator={breadcrumb.separator}
            lastItem={index === items.length - 1}
            isCurrentPage={breadcrumb.href === currentLink}
          />
        ))}
      </ol>
    </nav>
  );
}
