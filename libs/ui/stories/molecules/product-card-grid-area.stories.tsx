import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

const ProductCardGridArea = () => {
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold">Product Card Grid Area</h2>
      <p className="text-gray-500">Placeholder - komponenta ve vývoji</p>
    </div>
  );
};

const meta: Meta<typeof ProductCardGridArea> = {
  title: "Molecules/ProductCardGridArea",
  component: ProductCardGridArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductCardGridArea>;

export const Basic: Story = {
  args: {},
};

/*import type { Meta, StoryObj } from "@storybook/react";
import { ProductCardGridArea } from "../../src/molecules/product-card-grid-area";
import { fn } from "@storybook/test";

const meta: Meta<typeof ProductCardGridArea> = {
  title: "Molecules/ProductCardGridArea",
  component: ProductCardGridArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    imageUrl: "https://picsum.photos/200",
    name: "Pánská kšiltovka Fox Level Up Strapback Hat",
    price: "999 Kč",
    stockStatus: "Skladem více než 10 ks",
    badges: [
      { children: "Novinka", variant: "info" },
      { children: "OS", variant: "outline" },
      {
        children: "Dynamic",
        variant: "dynamic",
        bgColor: "#0000ff",
        fgColor: "#eef",
        borderColor: "pink",
      },
    ],
    addToCartText: "DO KOŠÍKU",
    onAddToCart: fn(),
  },
  argTypes: {
    imageUrl: { control: "text" },
    name: { control: "text" },
    price: { control: "text" },
    stockStatus: { control: "text" },
    badges: { control: "object" },
    addToCartText: { control: "text" },
    onAddToCart: { action: "clicked" },
    layout: {
      control: "select",
      options: ["basic", "horizontal", "custom"],
    },
    titleArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
    imageArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
    badgesArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
    stockArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
    priceArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
    actionsArea: {
      control: "select",
      options: [
        "grid-area-title",
        "grid-area-image",
        "grid-area-badges",
        "grid-area-stock",
        "grid-area-price",
        "grid-area-actions",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicLayout: Story = {
  args: {
    layout: "basic",
    titleArea: "grid-area-title",
    imageArea: "grid-area-image",
    badgesArea: "grid-area-badges",
    stockArea: "grid-area-stock",
    priceArea: "grid-area-price",
    actionsArea: "grid-area-actions",
  },
};

export const HorizontalLayout: Story = {
  args: {
    layout: "horizontal",
    titleArea: "grid-area-title",
    imageArea: "grid-area-image",
    badgesArea: "grid-area-badges",
    stockArea: "grid-area-stock",
    priceArea: "grid-area-price",
    actionsArea: "grid-area-actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Horizontální layout karty produktu. Pro správné zobrazení je potřeba definovat `horizontal-grid` v CSS.",
      },
    },
  },
};


export const CustomLayout: Story = {
  args: {
    layout: "custom",
    customGridTemplate:
      '"image title" "image price" "badges stock" "actions actions"',
    titleArea: "grid-area-title",
    imageArea: "grid-area-image",
    badgesArea: "grid-area-badges",
    stockArea: "grid-area-stock",
    priceArea: "grid-area-price",
    actionsArea: "grid-area-actions",
  },
  parameters: {
    docs: {
      description: {
        story: "Vlastní layout s definovanými oblastmi gridu.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
};

export const ReorganizedContent: Story = {
  args: {
    titleArea: "grid-area-price",
    priceArea: "grid-area-actions",
    imageArea: "grid-area-badges",
    badgesArea: "grid-area-images",
    stockArea: "grid-area-stock",
    actionsArea: "grid-area-title",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ukázka přehození pozice ceny a názvu produktu v základním layoutu.",
      },
    },
  },
};

export const WithoutBadges: Story = {
  args: {
    badges: [],
  },
};

export const CustomButtonText: Story = {
  args: {
    addToCartText: "Add Now",
  },
};
*/
