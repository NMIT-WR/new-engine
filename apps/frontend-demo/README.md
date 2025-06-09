# Frontend Demo - E-commerce Store

A modern, clean e-commerce demo application built with Next.js 15 and a custom UI component library based on Zag.js and Tailwind CSS.

## 🌐 Live Demo

Visit the live demo at: [https://wr-demo.netlify.app](https://wr-demo.netlify.app)

## 📋 Overview

This demo showcases a minimalist e-commerce storefront with a focus on clean design and excellent user experience. The application demonstrates the usage of our custom UI component library (`@libs/ui`) built with:

- **Zag.js** - For accessible, framework-agnostic UI components
- **Tailwind CSS** - For utility-first styling
- **Design Tokens** - For consistent theming across components

## ✨ Features

### Implemented Pages
- **Landing Page** - Hero section with featured products and categories
- **Product Listing** - Browse all products with filtering and sorting
- **Category Pages** - Dedicated pages for each product category
- **Product Details** - Individual product pages with image gallery and specifications
- **Shopping Cart** - Add to cart functionality and cart management
- **User Authentication** - Login and registration pages
- **Search** - Product search functionality
- **Contact Page** - Contact form for customer inquiries
- **About Page** - Company information
- **Sale Page** - Special offers and discounted products

### Features
- **Clean Navigation** - Minimalist header with user menu and cart
- **Responsive Design** - Mobile-first approach with breakpoint optimizations
- **Dark Mode** - Theme toggle for light/dark mode preference
- **Product Filters** - Filter by price, color, size, and more

## 🚀 Deployment

The application is deployed on Netlify with automatic builds from the `out/` directory.

### Manual Deployment Steps
1. Build the application:
   ```bash
   pnpm build
   ```
2. The static files will be generated in the `out/` directory
3. Drag and drop the `out/` folder to Netlify's deployment area

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (with static export)
- **UI Library**: Custom components from `@libs/ui`
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Nx monorepo with pnpm
- **Deployment**: Netlify

## 📦 Project Structure

```
frontend-demo/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # Page-specific components
│   ├── data/          # Mock data and constants
│   └── tokens/        # Design system tokens
├── public/            # Static assets
└── out/              # Build output (for deployment)
```

## 🎨 Design Philosophy

The design follows modern e-commerce best practices inspired by leading fashion retailers:
- Clean, minimalist interface
- High-quality product imagery
- Clear typography hierarchy
- Subtle interactions and animations
- Focus on product presentation

## 🔧 Development

This project is part of a larger Nx monorepo. To run locally:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 📄 License

This is a demo project for showcasing the UI component library capabilities.