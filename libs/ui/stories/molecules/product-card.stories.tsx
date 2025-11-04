import type { Meta, StoryObj } from '@storybook/react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Button } from '../../src/atoms/button'
import { ProductCard } from '../../src/molecules/product-card'

// Mock function for onClick handlers (replacement for deprecated @storybook/test fn)
const fn = () => () => {}

// Sample product images for different scenarios
const productImages = {
  tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  camera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
}

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ProductCard provides a flexible e-commerce product display component with support for images, pricing, stock status, badges, ratings, and multiple action buttons in various layouts.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    imageSrc: productImages.tshirt,
    name: 'Premium Cotton T-Shirt',
    price: '999 Kč',
    stockStatus: 'Skladem více než 10 ks',
    badges: [
      { children: 'Novinka', variant: 'info' },
      { children: 'M', variant: 'outline' },
    ],
    hasCartButton: true,
    cartButtonText: 'DO KOŠÍKU',
    onCartClick: fn(),
  },
  argTypes: {
    // Image props
    imageSrc: { 
      control: 'text',
      description: 'URL of the product image',
    },
    // Core product info
    name: { 
      control: 'text',
      description: 'Product name/title',
    },
    price: { 
      control: 'text',
      description: 'Product price with currency',
    },
    stockStatus: { 
      control: 'text',
      description: 'Stock availability text',
    },
    // Layout variants
    layout: {
      control: { type: 'select' },
      options: ['column', 'row'],
      description: 'Card layout orientation',
    },
    buttonLayout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Button arrangement within the card',
    },
    // Badges
    badges: { 
      control: 'object',
      description: 'Array of badge objects with variant and text',
    },
    // Rating
    rating: {
      control: 'object',
      description: 'Rating component props',
    },
    // Button controls
    hasCartButton: { 
      control: 'boolean',
      description: 'Show add to cart button',
    },
    hasDetailButton: { 
      control: 'boolean',
      description: 'Show product detail button',
    },
    hasWishlistButton: { 
      control: 'boolean',
      description: 'Show wishlist button',
    },
    cartButtonText: { 
      control: 'text',
      description: 'Text for cart button',
    },
    detailButtonText: { 
      control: 'text',
      description: 'Text for detail button',
    },
    wishlistButtonText: { 
      control: 'text',
      description: 'Text for wishlist button',
    },
    numericInput: {
      control: 'boolean',
      description: 'Show quantity input with cart button',
    },
    // Event handlers
    onCartClick: { action: 'cart-clicked' },
    onDetailClick: { action: 'detail-clicked' },
    onWishlistClick: { action: 'wishlist-clicked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Layout Variants">
        <ProductCard
          imageSrc={productImages.tshirt}
          name="Column Layout Product"
          price="1 299 Kč"
          stockStatus="Skladem 5 ks"
          layout="column"
          badges={[{ children: 'Novinka', variant: 'success' }]}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.shoes}
          name="Row Layout Product with Longer Name for Testing"
          price="2 499 Kč"
          stockStatus="Skladem více než 10 ks"
          layout="row"
          badges={[{ children: 'Sleva', variant: 'danger' }]}
          hasCartButton
        />
      </VariantGroup>

      <VariantGroup title="Button Configurations" fullWidth>
        <ProductCard
          imageSrc={productImages.watch}
          name="All Buttons Horizontal"
          price="4 999 Kč"
          stockStatus="Skladem 3 ks"
          buttonLayout="horizontal"
          hasCartButton
          hasDetailButton
          hasWishlistButton
          badges={[{ children: 'Premium', variant: 'warning' }]}
        />
        <ProductCard
          imageSrc={productImages.headphones}
          name="All Buttons Vertical"
          price="3 499 Kč"
          stockStatus="Skladem 7 ks"
          buttonLayout="vertical"
          hasCartButton
          hasDetailButton
          hasWishlistButton
          badges={[{ children: 'Bestseller', variant: 'info' }]}
        />
        <ProductCard
          imageSrc={productImages.camera}
          name="With Numeric Input"
          price="12 999 Kč"
          stockStatus="Skladem 2 ks"
          hasCartButton
          numericInput
          badges={[{ children: 'Limited', variant: 'outline' }]}
        />
      </VariantGroup>

      <VariantGroup title="Badge Variations">
        <ProductCard
          imageSrc={productImages.backpack}
          name="Multiple Badges"
          price="1 799 Kč"
          stockStatus="Skladem více než 20 ks"
          badges={[
            { children: 'Novinka', variant: 'info' },
            { children: '-25%', variant: 'danger' },
            { children: 'Eco', variant: 'success' },
            { children: 'XL', variant: 'outline' },
          ]}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.tshirt}
          name="Dynamic Badge"
          price="899 Kč"
          stockStatus="Skladem 15 ks"
          badges={[
            {
              children: 'Custom',
              variant: 'dynamic',
              bgColor: '#7c3aed',
              fgColor: '#ffffff',
              borderColor: '#6d28d9',
            },
          ]}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.shoes}
          name="No Badges"
          price="2 199 Kč"
          stockStatus="Skladem 8 ks"
          badges={[]}
          hasCartButton
        />
      </VariantGroup>

      <VariantGroup title="With Ratings">
        <ProductCard
          imageSrc={productImages.watch}
          name="High Rating Product"
          price="5 999 Kč"
          stockStatus="Skladem 4 ks"
          rating={{ value: 4.5, count: 5 }}
          badges={[{ children: 'Top Rated', variant: 'success' }]}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.headphones}
          name="Low Rating Product"
          price="1 499 Kč"
          stockStatus="Skladem více než 50 ks"
          rating={{ value: 2.5, count: 5 }}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.camera}
          name="New Product No Reviews"
          price="8 999 Kč"
          stockStatus="Předobjednávka"
          rating={{ value: 0, count: 5, readOnly: true }}
          badges={[{ children: 'Coming Soon', variant: 'info' }]}
          hasCartButton
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const LayoutComparison: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Column Layout (Default)" fullWidth>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(productImages).slice(0, 3).map(([key, src], i) => (
            <ProductCard
              key={key}
              imageSrc={src}
              name={`Product ${i + 1}`}
              price={`${1000 + i * 500} Kč`}
              stockStatus="Skladem"
              layout="column"
              hasCartButton
              badges={i === 0 ? [{ children: 'New', variant: 'info' }] : []}
              rating={i === 1 ? { value: 4, count: 5, readOnly: true } : undefined}
            />
          ))}
        </div>
      </VariantGroup>

      <VariantGroup title="Row Layout (List View)" fullWidth>
        <div className="w-full max-w-[50rem] space-y-4">
          {Object.entries(productImages).slice(3, 6).map(([key, src], i) => (
            <ProductCard
              key={key}
              imageSrc={src}
              name={`Product with longer description text ${i + 4}`}
              price={`${2000 + i * 750} Kč`}
              stockStatus={`Skladem ${10 - i} ks`}
              layout="row"
              hasCartButton
              hasDetailButton
              badges={[{ children: `Size ${i + 1}`, variant: 'outline' }]}
              rating={{ value: 3.5 + i * 0.5, count: 5, readOnly: true }}
            />
          ))}
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const EdgeCases: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Content Edge Cases">
        <ProductCard
          imageSrc={productImages.tshirt}
          name="Very Long Product Name That Should Be Truncated After Multiple Lines To Maintain Card Layout Consistency"
          price="999 999 999 Kč"
          stockStatus="Extremely long stock status message that explains everything about availability"
          badges={[
            { children: 'VeryLongBadgeText', variant: 'info' },
            { children: 'AnotherLongBadge', variant: 'success' },
          ]}
          hasCartButton
        />
        <ProductCard
          imageSrc=""
          name="Product Without Image"
          price="1 Kč"
          stockStatus="?"
          badges={[]}
          hasCartButton
        />
        <ProductCard
          imageSrc={productImages.camera}
          name="M"
          price="1"
          stockStatus="1"
          badges={[{ children: '1', variant: 'outline' }]}
          hasCartButton
          cartButtonText="+"
        />
      </VariantGroup>

      <VariantGroup title="Layout Edge Cases" fullWidth>
        <div className="w-48">
          <ProductCard
            imageSrc={productImages.watch}
            name="Narrow Container Test"
            price="999 Kč"
            stockStatus="Limited width"
            layout="column"
            hasCartButton
            hasDetailButton
          />
        </div>
        <div className="w-full max-w-container-xl">
          <ProductCard
            imageSrc={productImages.backpack}
            name="Wide Container Row Layout Test"
            price="1 599 Kč"
            stockStatus="Wide layout test"
            layout="row"
            hasCartButton
            hasDetailButton
            hasWishlistButton
            badges={[
              { children: 'Wide', variant: 'info' },
              { children: 'Layout', variant: 'success' },
              { children: 'Test', variant: 'warning' },
            ]}
            rating={{ value: 4, count: 5, readOnly: true }}
          />
        </div>
      </VariantGroup>

      <VariantGroup title="Many Badges Overflow">
        <ProductCard
          imageSrc={productImages.shoes}
          name="Product with Many Badges"
          price="2 999 Kč"
          stockStatus="Testing badge overflow"
          badges={[
            { children: 'New', variant: 'info' },
            { children: '-50%', variant: 'danger' },
            { children: 'Eco', variant: 'success' },
            { children: 'Premium', variant: 'warning' },
            { children: 'XS', variant: 'outline' },
            { children: 'S', variant: 'outline' },
            { children: 'M', variant: 'outline' },
            { children: 'L', variant: 'outline' },
            { children: 'XL', variant: 'outline' },
            { children: 'XXL', variant: 'outline' },
            { children: 'Limited', variant: 'info' },
            { children: 'Exclusive', variant: 'success' },
          ]}
          hasCartButton
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const RealWorldEcommerce: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sale Section" fullWidth>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard
            imageSrc={productImages.tshirt}
            name="Summer Collection T-Shirt"
            price="799 Kč"
            stockStatus="Skladem více než 20 ks"
            badges={[
              { children: '-30%', variant: 'danger' },
              { children: 'Summer Sale', variant: 'warning' },
            ]}
            rating={{ value: 4.2, count: 5, readOnly: true }}
            hasCartButton
            hasWishlistButton
          />
          <ProductCard
            imageSrc={productImages.shoes}
            name="Running Shoes Pro Max"
            price="3 999 Kč"
            stockStatus="Posledních 5 ks"
            badges={[
              { children: '-15%', variant: 'danger' },
              { children: 'Bestseller', variant: 'success' },
            ]}
            rating={{ value: 4.8, count: 5, readOnly: true }}
            hasCartButton
            hasWishlistButton
          />
          <ProductCard
            imageSrc={productImages.backpack}
            name="Urban Backpack 25L"
            price="1 299 Kč"
            stockStatus="Skladem"
            badges={[
              { children: '-40%', variant: 'danger' },
              { children: 'Last Chance', variant: 'warning' },
            ]}
            rating={{ value: 3.9, count: 5, readOnly: true }}
            hasCartButton
            hasWishlistButton
          />
        </div>
      </VariantGroup>

      <VariantGroup title="New Arrivals" fullWidth>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard
            imageSrc={productImages.headphones}
            name="Wireless ANC Headphones"
            price="4 499 Kč"
            stockStatus="Novinka - skladem"
            badges={[
              { children: 'New', variant: 'info' },
              { children: 'Premium', variant: 'success' },
            ]}
            hasCartButton
            hasDetailButton
          />
          <ProductCard
            imageSrc={productImages.camera}
            name="Professional Camera 4K"
            price="24 999 Kč"
            stockStatus="Předobjednávka"
            badges={[
              { children: 'Coming Soon', variant: 'info' },
              { children: 'Pro', variant: 'outline' },
            ]}
            hasDetailButton
            hasWishlistButton
            cartButtonText="Notify Me"
          />
          <ProductCard
            imageSrc={productImages.watch}
            name="Smart Watch Series 7"
            price="8 999 Kč"
            stockStatus="Skladem 3 ks"
            badges={[
              { children: 'New', variant: 'info' },
              { children: 'Smart', variant: 'success' },
            ]}
            hasCartButton
            hasDetailButton
            hasWishlistButton
          />
        </div>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const CustomButtons: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Custom Button Integration">
        <ProductCard
          imageSrc={productImages.camera}
          name="Product with Custom Actions"
          price="15 999 Kč"
          stockStatus="Skladem"
          badges={[{ children: 'Customizable', variant: 'info' }]}
          customButtons={
            <div className="flex gap-100">
              <Button size="sm" variant="secondary">Compare</Button>
              <Button size="sm" theme='light' variant="warning" >Quick View</Button>
              <Button size="sm" variant="danger">Share</Button>
            </div>
          }
        />
        <ProductCard
          imageSrc={productImages.watch}
          name="Mixed Standard and Custom"
          price="6 999 Kč"
          stockStatus="Skladem"
          hasCartButton
          customButtons={
            <Button size="sm" variant="primary" className="w-full">Configure</Button>
          }
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

