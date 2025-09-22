import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Badge } from '../../src/atoms/badge'
import { Button } from '../../src/atoms/button'
import { NumericInput } from '../../src/atoms/numeric-input'
import { Rating } from '../../src/atoms/rating'
import { ProductCard } from '../../src/molecules/product-card'

// Sample product images for different scenarios
const productImages = {
  tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  headphones:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
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
        component:
          'A flexible e-commerce product display component using compound component pattern. Supports custom composition with images, pricing, badges, ratings, and actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['column', 'row'],
      description: 'Card layout orientation',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProductCard>

// Basic usage with minimal configuration
export const Default: Story = {
  render: () => (
    <ProductCard>
      <ProductCard.Image
        src={productImages.tshirt}
        alt="Premium Cotton T-Shirt"
      />
      <ProductCard.Name>Premium Cotton T-Shirt</ProductCard.Name>
      <ProductCard.Price>$29.99</ProductCard.Price>
      <ProductCard.Actions>
        <ProductCard.Button buttonVariant="cart" icon="token-icon-cart-button">
          Add to Cart
        </ProductCard.Button>
      </ProductCard.Actions>
    </ProductCard>
  ),
}

// Showcase all button variants
export const AllButtonVariants: Story = {
  name: 'Button Variants',
  render: () => (
    <VariantContainer>
      <VariantGroup title="Cart Button">
        <ProductCard>
          <ProductCard.Image src={productImages.shoes} alt="Running Shoes" />
          <ProductCard.Name>Running Shoes</ProductCard.Name>
          <ProductCard.Price>$89.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="cart"
              icon="token-icon-cart-button"
              onClick={fn()}
            >
              Add to Cart
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Detail Button">
        <ProductCard>
          <ProductCard.Image src={productImages.watch} alt="Luxury Watch" />
          <ProductCard.Name>Luxury Watch</ProductCard.Name>
          <ProductCard.Price>$499.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="detail"
              icon="token-icon-detail-button"
              onClick={fn()}
            >
              View Details
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Wishlist Button">
        <ProductCard>
          <ProductCard.Image src={productImages.headphones} alt="Headphones" />
          <ProductCard.Name>Wireless Headphones</ProductCard.Name>
          <ProductCard.Price>$199.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="wishlist"
              icon="token-icon-wishlist-button"
              onClick={fn()}
            >
              Save to Wishlist
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Custom Button">
        <ProductCard>
          <ProductCard.Image src={productImages.camera} alt="Camera" />
          <ProductCard.Name>Professional Camera</ProductCard.Name>
          <ProductCard.Price>$1,299.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="custom"
              icon="token-icon-share"
              onClick={fn()}
              className="bg-accent text-accent-fg hover:bg-accent-hover"
            >
              Share Product
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>
    </VariantContainer>
  ),
}

// Column vs Row layouts
export const LayoutVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Column Layout (Default)">
        <ProductCard layout="column">
          <ProductCard.Image src={productImages.tshirt} alt="T-Shirt" />
          <ProductCard.Name>Cotton T-Shirt</ProductCard.Name>
          <Rating value={4} />
          <ProductCard.Stock>In Stock</ProductCard.Stock>
          <ProductCard.Price>$24.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="cart"
              icon="token-icon-cart-button"
            >
              Add to Cart
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Row Layout">
        <ProductCard layout="row" className="w-lg">
          <ProductCard.Image
            src={productImages.shoes}
            alt="Shoes"
            className="row-span-6"
          />
          <ProductCard.Name>Running Shoes</ProductCard.Name>
          <Rating value={5} />
          <ProductCard.Stock>Limited Stock</ProductCard.Stock>
          <ProductCard.Price>$89.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="cart"
              icon="token-icon-cart-button"
            >
              Add to Cart
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>
    </VariantContainer>
  ),
}

// Custom composition example
export const CustomComposition: Story = {
  render: () => (
    <ProductCard>
      <ProductCard.Image src={productImages.camera} alt="DSLR Camera" />

      {/* Custom badge placement */}
      <div className="mb-100 flex gap-100">
        <Badge variant="info">-30%</Badge>
        <Badge variant="success">Free Shipping</Badge>
      </div>

      <ProductCard.Name>Professional DSLR Camera</ProductCard.Name>

      {/* Custom price display with original price */}
      <div className="flex items-baseline gap-100">
        <span className="text-100 text-fg-primary line-through">$1,899</span>
        <ProductCard.Price>$1,329</ProductCard.Price>
      </div>

      {/* Custom rating with review count */}
      <div className="flex items-center gap-100">
        <Rating value={4.8} />
        <span className="text-100 text-fg-muted">(245 reviews)</span>
      </div>

      <ProductCard.Stock>Only 3 left in stock</ProductCard.Stock>

      {/* Custom actions layout */}
      <ProductCard.Actions>
        <div className="flex w-full gap-200">
          <ProductCard.Button
            buttonVariant="cart"
            icon="token-icon-cart-button"
            className="flex-1"
          >
            Buy Now
          </ProductCard.Button>
          <ProductCard.Button
            buttonVariant="detail"
            icon="token-icon-detail-button"
          >
            Details
          </ProductCard.Button>
        </div>
      </ProductCard.Actions>
    </ProductCard>
  ),
}

// With quantity input
export const WithQuantityInput: Story = {
  render: () => (
    <ProductCard className="max-w-sm">
      <div>
        <ProductCard.Image
          src={productImages.watch}
          alt="Luxury Watch"
          className="h-auto w-full"
        />
        <ProductCard.Name>Swiss Luxury Watch</ProductCard.Name>
        <ProductCard.Price>$2,499</ProductCard.Price>
        <ProductCard.Stock status="limited-stock">
          Limited Edition - 5 Available
        </ProductCard.Stock>
      </div>
      <ProductCard.Actions>
        <NumericInput defaultValue={1} hideControls={false} />
        <ProductCard.Button
          buttonVariant="cart"
          icon="token-icon-cart-button"
          onClick={fn()}
          className="flex-1"
        >
          Add to Cart
        </ProductCard.Button>
        <ProductCard.Button
          buttonVariant="wishlist"
          icon="token-icon-wishlist-button"
          onClick={fn()}
          className="w-full"
        >
          Save for Later
        </ProductCard.Button>
      </ProductCard.Actions>
    </ProductCard>
  ),
}

// Minimal card - only essential elements
export const MinimalCard: Story = {
  render: () => (
    <ProductCard>
      <ProductCard.Name className="text-center">
        Travel Backpack
      </ProductCard.Name>
      <ProductCard.Image src={productImages.backpack} alt="Travel Backpack" />
      <ProductCard.Price>$79.99</ProductCard.Price>
    </ProductCard>
  ),
}

// Complex card with everything
export const ComplexCard: Story = {
  render: () => (
    <ProductCard className="w-md">
      {/* Image with overlay badge */}
      <div className="relative">
        <ProductCard.Image src={productImages.camera} alt="Camera Kit" />
        <Badge variant="error" className="absolute top-100 right-100">
          HOT DEAL
        </Badge>
      </div>

      {/* Multiple badge types */}
      <ProductCard.Badges>
        <Badge variant="info">New Arrival</Badge>
        <Badge variant="success">Eco-Friendly</Badge>
        <Badge variant="warning">Limited Stock</Badge>
      </ProductCard.Badges>

      <ProductCard.Name>
        Professional Camera Kit with Accessories
      </ProductCard.Name>

      {/* Rating with reviews */}
      <div className="mb-100 flex items-center gap-100">
        <ProductCard.Rating rating={{ value: 4.9 }} />
        <span className="text-50 text-fg-muted">(512 reviews)</span>
      </div>

      {/* Price with savings */}
      <div className="mb-200 flex flex-col gap-100">
        <div className="flex items-baseline gap-100">
          <span className="text-fg-muted line-through">$3,499</span>
          <ProductCard.Price>$2,449</ProductCard.Price>
          <Badge variant="error" size="sm">
            Save $1,050
          </Badge>
        </div>
        <span className="text-50 text-success-fg">Free shipping included</span>
      </div>

      <ProductCard.Stock>Only 2 units left - Order soon!</ProductCard.Stock>

      {/* Complex actions */}
      <ProductCard.Actions>
        <div className="mb-100 flex items-center gap-100">
          <NumericInput />
          <ProductCard.Button
            buttonVariant="cart"
            icon="token-icon-cart-button"
            onClick={fn()}
            className="flex-1"
          >
            Add to Cart
          </ProductCard.Button>
        </div>

        <div className="grid grid-cols-2 gap-100">
          <ProductCard.Button
            buttonVariant="detail"
            icon="token-icon-detail-button"
            onClick={fn()}
          >
            Quick View
          </ProductCard.Button>
          <ProductCard.Button
            buttonVariant="wishlist"
            icon="token-icon-wishlist-button"
            onClick={fn()}
          >
            Wishlist
          </ProductCard.Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-100 w-full"
          onClick={fn()}
        >
          Compare with similar items
        </Button>
      </ProductCard.Actions>

      {/* Additional info */}
      <div className="border-border-primary border-t pt-100">
        <span className="text-50 text-fg-muted">
          ✓ 2-year warranty • ✓ 30-day returns • ✓ Expert support
        </span>
      </div>
    </ProductCard>
  ),
}

// Multiple action layouts
export const ActionLayouts: Story = {
  name: 'Action Button Layouts',
  render: () => (
    <VariantContainer>
      <VariantGroup title="Horizontal Actions">
        <ProductCard>
          <ProductCard.Image src={productImages.shoes} alt="Shoes" />
          <ProductCard.Name>Running Shoes</ProductCard.Name>
          <ProductCard.Price>$89.99</ProductCard.Price>
          <ProductCard.Actions>
            <div className="flex gap-100">
              <ProductCard.Button
                buttonVariant="cart"
                icon="token-icon-cart-button"
              >
                Cart
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="detail"
                icon="token-icon-detail-button"
              >
                View
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="wishlist"
                icon="token-icon-wishlist-button"
              >
                Save
              </ProductCard.Button>
            </div>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Vertical Actions">
        <ProductCard>
          <ProductCard.Image src={productImages.headphones} alt="Headphones" />
          <ProductCard.Name>Wireless Headphones</ProductCard.Name>
          <ProductCard.Price>$199.99</ProductCard.Price>
          <ProductCard.Actions>
            <div className="flex flex-col gap-100">
              <ProductCard.Button
                buttonVariant="cart"
                icon="token-icon-cart-button"
                className="w-full"
              >
                Add to Cart
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="detail"
                icon="token-icon-detail-button"
                className="w-full"
              >
                View Details
              </ProductCard.Button>
            </div>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>

      <VariantGroup title="Mixed Layout">
        <ProductCard>
          <ProductCard.Image src={productImages.watch} alt="Watch" />
          <ProductCard.Name>Luxury Watch</ProductCard.Name>
          <ProductCard.Price>$999.99</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="cart"
              icon="token-icon-cart-button"
              className="mb-100 w-full"
            >
              Add to Cart
            </ProductCard.Button>
            <div className="flex gap-100">
              <ProductCard.Button
                buttonVariant="detail"
                icon="token-icon-detail-button"
                className="flex-1"
              >
                Details
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="wishlist"
                icon="token-icon-wishlist-button"
                className="flex-1"
              >
                Wishlist
              </ProductCard.Button>
            </div>
          </ProductCard.Actions>
        </ProductCard>
      </VariantGroup>
    </VariantContainer>
  ),
}
