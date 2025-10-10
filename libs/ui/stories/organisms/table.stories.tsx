import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../../src/organisms/table'
import { VariantContainer } from '../../.storybook/decorator'

const meta = {
  title: 'Organisms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'outline', 'interactive', 'striped'],
      description: 'Visual style variant of the table',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of table cells and text',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Make header sticky on scroll',
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// Sample data for stories
const sampleProducts = [
  {
    id: 1,
    name: 'Laptop',
    category: 'Electronics',
    price: 999.99,
    stock: 50,
  },
  {
    id: 2,
    name: 'Coffee Maker',
    category: 'Home Appliances',
    price: 49.99,
    stock: 120,
  },
  {
    id: 3,
    name: 'Desk Chair',
    category: 'Furniture',
    price: 150.0,
    stock: 30,
  },
  {
    id: 4,
    name: 'Smartphone',
    category: 'Electronics',
    price: 799.99,
    stock: 75,
  },
  {
    id: 5,
    name: 'Headphones',
    category: 'Accessories',
    price: 199.99,
    stock: 200,
  },
]

// === BASIC VARIANTS ===

export const Basic: Story = {
  args: {
    variant: 'line',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Product Inventory</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
            <Table.Cell numeric>{product.stock}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Product Inventory</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
            <Table.Cell numeric>{product.stock}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Click on any row to select</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.map((product) => (
          <Table.Row
            key={product.id}
            onClick={() => alert(`Selected: ${product.name}`)}
          >
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
            <Table.Cell numeric>{product.stock}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

export const Striped: Story = {
  args: {
    variant: 'striped',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Product Inventory</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
            <Table.Cell numeric>{product.stock}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
}

// === SIZE VARIANTS ===

export const Sizes: Story = {

  render: () => {

    const sizes = ['sm', 'md', 'lg']
    const atributes = ["Product", "Category", "Price"]
   

    return (
    <VariantContainer>
    <Table size='sm'>
      <Table.Caption>Compact table with small size</Table.Caption>
      <Table.Header>
        <Table.Row>
          {atributes.map((attribute) => (
            <Table.ColumnHeader key={attribute} numeric={attribute === "Price"}>{attribute}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.slice(0, 3).map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
     <Table size='md'>
      <Table.Caption>Spacious table with large size</Table.Caption>
      <Table.Header>
        <Table.Row>
          {atributes.map((attribute) => (
            <Table.ColumnHeader key={attribute} numeric={attribute === "Price"}>{attribute}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.slice(0, 3).map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    <Table size='lg'>
      <Table.Caption>Spacious table with large size</Table.Caption>
      <Table.Header>
        <Table.Row>
          {atributes.map((attribute) => (
            <Table.ColumnHeader key={attribute} numeric={attribute === "Price"}>{attribute}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sampleProducts.slice(0, 3).map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </VariantContainer>
  )},
}


// === ADVANCED FEATURES ===

export const WithFooter: Story = {
  args: {
    variant: 'line',
    size: 'md',
  },
  render: (args) => {
    const total = sampleProducts.reduce((sum, p) => sum + p.price, 0)
    const totalStock = sampleProducts.reduce((sum, p) => sum + p.stock, 0)

    return (
      <Table {...args}>
        <Table.Caption>Product Inventory with Totals</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Product</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
            <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sampleProducts.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.category}</Table.Cell>
              <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
              <Table.Cell numeric>{product.stock}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={2}>
              <strong>Total</strong>
            </Table.Cell>
            <Table.Cell numeric>
              <strong>${total.toFixed(2)}</strong>
            </Table.Cell>
            <Table.Cell numeric>
              <strong>{totalStock}</strong>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  },
}

export const StickyHeader: Story = {
  args: {
    variant: 'line',
    size: 'md',
    stickyHeader: true,
  },
  render: (args) => {
    // Generate more rows for scrolling demo
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: ['Electronics', 'Furniture', 'Accessories'][i % 3],
      price: Math.random() * 1000,
      stock: Math.floor(Math.random() * 200),
    }))

    return (
      <div style={{ height: '400px', overflow: 'auto' }}>
        <Table {...args}>
          <Table.Caption>Scroll to see sticky header effect</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
              <Table.ColumnHeader>Category</Table.ColumnHeader>
              <Table.ColumnHeader numeric>Price</Table.ColumnHeader>
              <Table.ColumnHeader numeric>Stock</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {manyProducts.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell numeric>${product.price.toFixed(2)}</Table.Cell>
                <Table.Cell numeric>{product.stock}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

// === COMPLEX EXAMPLES ===

export const ComplexTable: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Quarterly Sales Report 2024</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Region</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Q1</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Q2</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Q3</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Q4</Table.ColumnHeader>
          <Table.ColumnHeader numeric>Total</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>North America</Table.Cell>
          <Table.Cell numeric>$125,000</Table.Cell>
          <Table.Cell numeric>$142,000</Table.Cell>
          <Table.Cell numeric>$138,000</Table.Cell>
          <Table.Cell numeric>$159,000</Table.Cell>
          <Table.Cell numeric>
            <strong>$564,000</strong>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Europe</Table.Cell>
          <Table.Cell numeric>$98,000</Table.Cell>
          <Table.Cell numeric>$105,000</Table.Cell>
          <Table.Cell numeric>$112,000</Table.Cell>
          <Table.Cell numeric>$128,000</Table.Cell>
          <Table.Cell numeric>
            <strong>$443,000</strong>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Asia Pacific</Table.Cell>
          <Table.Cell numeric>$87,000</Table.Cell>
          <Table.Cell numeric>$95,000</Table.Cell>
          <Table.Cell numeric>$102,000</Table.Cell>
          <Table.Cell numeric>$115,000</Table.Cell>
          <Table.Cell numeric>
            <strong>$399,000</strong>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>
            <strong>Total</strong>
          </Table.Cell>
          <Table.Cell numeric>
            <strong>$310,000</strong>
          </Table.Cell>
          <Table.Cell numeric>
            <strong>$342,000</strong>
          </Table.Cell>
          <Table.Cell numeric>
            <strong>$352,000</strong>
          </Table.Cell>
          <Table.Cell numeric>
            <strong>$402,000</strong>
          </Table.Cell>
          <Table.Cell numeric>
            <strong>$1,406,000</strong>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
}

export const MinimalTable: Story = {
  args: {
    variant: 'line',
    size: 'md',
  },
  render: (args) => (
    <Table {...args}>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Simple</Table.Cell>
          <Table.Cell>Table</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Without</Table.Cell>
          <Table.Cell>Header</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
}
