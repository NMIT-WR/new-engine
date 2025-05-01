// product-card-slot.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCardSlot } from "../../src/molecules/product-card-slot";

const meta: Meta<typeof ProductCardSlot> = {
  title: "Molecules/ProductCard/ProductCardSlot",
  component: ProductCardSlot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "select",
      options: ["column", "row"],
      description: "Rozvržení karty produktu",
    },
    onAddToCart: { action: "onAddToCart" },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCardSlot>;

const defaultArgs = {
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
  rating: {
    value: 4,
    maxValue: 5,
    readOnly: true,
  },
  addToCartText: "DO KOŠÍKU",
  onAddToCart: () => alert("Produkt přidán do košíku"),
};

export const ColumnLayout: Story = {
  args: {
    ...defaultArgs,
    layout: "column",
  },
};

export const RowLayout: Story = {
  args: {
    ...defaultArgs,
    layout: "row",
  },
};

export const SimpleColumn: Story = {
  args: {
    ...defaultArgs,
    layout: "column",
    rating: undefined,
    badges: [{ children: "Novinka", variant: "info" }],
    stockStatus: "Skladem",
  },
};

export const SimpleRow: Story = {
  args: {
    ...defaultArgs,
    layout: "row",
    badges: [],
    price: "599 Kč - 999 Kč",
    stockStatus: "Různé varianty skladem",
    addToCartText: "ZOBRAZIT VARIANTY",
  },
};
