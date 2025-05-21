import type { Meta, StoryObj } from "@storybook/react";
import {
  Breadcrumb,
  type BreadcrumbItemType,
} from "../../src/molecules/breadcrumb";

const simplePath: BreadcrumbItemType[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Smartphones", href: "/products/electronics/smartphones" },
];

const withIcons: BreadcrumbItemType[] = [
  { label: "Home", href: "/", icon: "token-icon-home" },
  {
    label: "Products",
    href: "/products",
    icon: "token-icon-shopping-bag",
  },
  {
    label: "Electronics",
    href: "/products/electronics",
    icon: "token-icon-cpu",
  },
  {
    label: "Smartphones",
    href: "/products/electronics/smartphones",
    icon: "token-icon-smartphone",
  },
];

const longPath: BreadcrumbItemType[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Smartphones", href: "/products/electronics/smartphones" },
  { label: "Apple", href: "/products/electronics/smartphones/apple" },
  { label: "iPhone", href: "/products/electronics/smartphones/apple/iphone" },
  {
    label: "iPhone 14",
    href: "/products/electronics/smartphones/apple/iphone/iphone-14",
  },
  {
    label: "Pro Max",
    href: "/products/electronics/smartphones/apple/iphone/iphone-14/pro-max",
  },
];

const meta: Meta<typeof Breadcrumb> = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A breadcrumb navigation component that shows the hierarchical path within a website.
Provides users with links to previous levels in the hierarchy and their current location.

## Features
- Simple breadcrumb trail with links
- Support for icons, custom separators and truncation
- Accessible by default (aria-* attributes)
- Responsive design
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-screen-lg p-4 bg-surface">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items to display",
    },
    maxItems: {
      control: { type: "number", min: 0 },
      description:
        "Maximum number of items to display before truncating (0 = show all)",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the breadcrumbs",
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label for the breadcrumb navigation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: simplePath,
    currentLink: "/products",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Small</h3>
        <Breadcrumb items={simplePath} size="sm" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Medium (Default)</h3>
        <Breadcrumb items={simplePath} size="md" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Large</h3>
        <Breadcrumb items={simplePath} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Story with different sizes of breadcrumbs.",
      },
    },
  },
};

export const CustomIconsAndSeparator: Story = {
  args: {
    items: [
      {
        label: "Home",
        href: "/",
        icon: "icon-[mdi--home]",
        separator: "icon-[mdi--chevron-right]",
      },
      {
        label: "Products",
        href: "/products",
        icon: "icon-[mdi--shopping]",
        separator: "icon-[mdi--chevron-double-right]",
      },
      {
        label: "Electronics",
        href: "/products/electronics",
        icon: "icon-[mdi--computer-classic]",
        separator: "icon-[mdi--chevron-triple-right]",
      },
      {
        label: "Smartphones",
        href: "/products/electronics/smartphones",
        icon: "icon-[mdi--smartphone]",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Breadcrumbs with custom icons for each item and different separators between items.",
      },
    },
  },
};

export const Truncated: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Full Path (8 items)</h3>
        <Breadcrumb items={longPath} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Truncated to 3 items</h3>
        <Breadcrumb items={longPath} maxItems={3} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Truncated to 4 items</h3>
        <Breadcrumb items={longPath} maxItems={4} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Truncated to 5 items</h3>
        <Breadcrumb items={longPath} maxItems={5} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows how breadcrumbs can be truncated for long paths using an ellipsis (...).",
      },
    },
  },
};

export const DynamicFromURL: Story = {
  render: () => {
    const currentPath = "/products/electronics/smartphones/apple";

    const segments = currentPath.split("/").filter(Boolean);

    const dynamicItems: BreadcrumbItemType[] = [
      { label: "Home", href: "/" },
      ...segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        return {
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href,
        };
      }),
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">
            Current URL: {currentPath}
          </h3>
          <Breadcrumb items={dynamicItems} />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Story with dynamic breadcrumbs generated from URL path.",
      },
    },
  },
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">
          Responsive Container (change size to see effect)
        </h3>
        <div className="border border-gray-300 p-4 resize-x overflow-auto min-w-80 max-w-full">
          <Breadcrumb items={longPath} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">
          Auto-truncating (change size to see effect)
        </h3>
        <div className="border border-gray-300 p-4 resize-x overflow-auto min-w-80 max-w-full">
          <Breadcrumb items={longPath} maxItems={4} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Story with responsive breadcrumbs. Change size to see effect.",
      },
    },
  },
};
