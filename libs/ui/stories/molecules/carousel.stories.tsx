import type { Meta, StoryObj } from "@storybook/react";
import { Carousel, type CarouselItem } from "../../src/molecules/carousel";
import React from "react";

// Sample images using src approach (simpler)
const sampleImages: CarouselItem[] = [
  {
    id: "slide-1",
    src: "https://picsum.photos/200",
    alt: "Beautiful landscape",
  },
  {
    id: "slide-2",
    src: "https://picsum.photos/201",
    alt: "City skyline",
  },
  {
    id: "slide-3",
    src: "https://picsum.photos/202",
    alt: "Ocean view",
  },
  {
    id: "slide-4",
    src: "https://picsum.photos/203",
    alt: "Mountain range",
  },
  {
    id: "slide-5",
    src: "https://picsum.photos/204",
    alt: "Forest path",
  },
];

// Mixed approach - some images, some custom content
const mixedSlides: CarouselItem[] = [
  {
    id: "image-1",
    src: "https://picsum.photos/205",
    alt: "Sample image",
  },
  {
    id: "content-1",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 h-full">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">
          Custom Content
        </h3>
        <p className="text-blue-700">
          This slide has custom JSX content instead of an image
        </p>
      </div>
    ),
  },
  {
    id: "image-2",
    src: "https://picsum.photos/206",
    alt: "Another image",
  },
];

// Content slides with text
const contentSlides: CarouselItem[] = [
  {
    id: "content-1",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Welcome</h3>
        <p className="text-blue-700">
          This is the first slide with custom content
        </p>
      </div>
    ),
  },
  {
    id: "content-2",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-green-50 to-green-100">
        <h3 className="text-2xl font-bold text-green-900 mb-4">Features</h3>
        <p className="text-green-700">Explore the amazing features we offer</p>
      </div>
    ),
  },
  {
    id: "content-3",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-2xl font-bold text-purple-900 mb-4">Get Started</h3>
        <p className="text-purple-700">Ready to begin your journey?</p>
      </div>
    ),
  },
];

// Polymorphic example with Next.js Image (commented for demo)
const nextImageSlides: CarouselItem[] = [
  {
    id: "next-1",
    src: "https://picsum.photos/207",
    alt: "Optimized with Next.js Image",
    // as: NextImage, // Uncomment when using Next.js
    imageProps: {
      width: 400,
      height: 300,
      priority: true, // Next.js specific prop
      quality: 85,
    },
  },
  {
    id: "next-2",
    src: "https://picsum.photos/208",
    alt: "Another optimized image",
    // as: NextImage,
    imageProps: {
      width: 400,
      height: 300,
      loading: "lazy",
    },
  },
];

// Product showcase with mixed content
const productShowcase: CarouselItem[] = [
  {
    id: "hero",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white h-full">
        <h2 className="text-3xl font-bold mb-4">Welcome to Our Store</h2>
        <p className="text-lg opacity-90">Discover amazing products</p>
      </div>
    ),
  },
  {
    id: "product-1",
    src: "https://picsum.photos/209",
    alt: "Featured Product 1",
  },
  {
    id: "cta",
    content: (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-green-500 to-teal-500 text-white h-full">
        <h3 className="text-2xl font-bold mb-4">Special Offer!</h3>
        <p className="text-lg mb-4">Get 20% off your first order</p>
        <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold">
          Shop Now
        </button>
      </div>
    ),
  },
  {
    id: "product-2",
    src: "https://picsum.photos/210",
    alt: "Featured Product 2",
  },
];

const meta: Meta<typeof Carousel> = {
  title: "Molecules/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible carousel component built with Zag.js that supports multiple orientations, autoplay, and customizable controls.

## Features
- Horizontal and vertical orientation
- Autoplay with pause/play controls
- Loop functionality
- Multiple slides per page
- Responsive design
- Keyboard navigation
- Touch/mouse drag support
- Customizable indicators
- Accessibility support
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Carousel orientation",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the carousel",
    },
    loop: {
      control: { type: "boolean" },
      description: "Enable looping of slides",
    },
    autoplay: {
      control: { type: "boolean" },
      description: "Enable autoplay",
    },
    allowMouseDrag: {
      control: { type: "boolean" },
      description: "Allow dragging with mouse",
    },
    slidesPerPage: {
      control: { type: "number", min: 1, max: 5 },
      description: "Number of slides to show at once",
    },
    slidesPerMove: {
      control: { type: "number", min: 1, max: 5 },
      description: "Number of slides to move at once",
    },
    hasControls: {
      control: { type: "boolean" },
      description: "Show navigation controls",
    },
    hasIndicators: {
      control: { type: "boolean" },
      description: "Show slide indicators",
    },
    showAutoplayButton: {
      control: { type: "boolean" },
      description: "Show autoplay toggle button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic carousel with simple image sources
export const Default: Story = {
  args: {
    items: sampleImages,
    orientation: "horizontal",
    size: "md",
    loop: false,
    autoplay: false,
  },
};

// Mixed content approach - images and custom JSX
export const MixedContent: Story = {
  args: {
    items: mixedSlides,
    size: "md",
    loop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the hybrid approach with both image sources and custom JSX content in the same carousel.",
      },
    },
  },
};

// Polymorphic image component example
export const PolymorphicImages: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          With Custom Image Component
        </h4>
        <p className="text-sm text-blue-700 mb-4">
          This example shows how you could use Next.js Image or any custom image
          component. The image component is applied to all items with `src`
          property.
        </p>
      </div>

      <Carousel
        items={nextImageSlides}
        defaultImageComponent="img" // In real app: NextImage
        defaultImageProps={{
          loading: "lazy",
          style: { objectFit: "cover" },
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example of using polymorphic image components (e.g., Next.js Image) with default props.",
      },
    },
  },
};

// Product showcase with mixed content
export const ProductShowcase: Story = {
  args: {
    items: productShowcase,
    autoplay: true,
    loop: true,
    showAutoplayButton: true,
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real-world example mixing hero content, product images, and call-to-action slides.",
      },
    },
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Small</h3>
        <Carousel items={sampleImages.slice(0, 3)} size="sm" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Medium (Default)</h3>
        <Carousel items={sampleImages.slice(0, 3)} size="md" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Large</h3>
        <Carousel items={sampleImages.slice(0, 3)} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different size variants of the carousel component.",
      },
    },
  },
};

// Vertical orientation
export const Vertical: Story = {
  args: {
    items: sampleImages.slice(0, 4),
    orientation: "vertical",
    size: "md",
    loop: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Carousel with vertical orientation and looping enabled.",
      },
    },
  },
};

// With autoplay
export const Autoplay: Story = {
  args: {
    items: contentSlides,
    autoplay: true,
    loop: true,
    showAutoplayButton: true,
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Carousel with autoplay enabled and pause/play controls.",
      },
    },
  },
};

// Multiple slides per page
export const MultipleSlides: Story = {
  args: {
    items: sampleImages,
    slidesPerPage: 2,
    slidesPerMove: 2,
    loop: true,
    size: "lg",
    spacing: "16px",
  },
  parameters: {
    docs: {
      description: {
        story: "Carousel showing multiple slides at once with custom spacing.",
      },
    },
  },
};

// Custom controls and indicators
export const CustomControls: Story = {
  args: {
    items: sampleImages,
    prevIcon: "icon-[mdi--arrow-left]",
    nextIcon: "icon-[mdi--arrow-right]",
    playIcon: "icon-[mdi--play-circle]",
    pauseIcon: "icon-[mdi--pause-circle]",
    showAutoplayButton: true,
    autoplay: false,
    controlsPosition: "top",
    indicatorsPosition: "top",
  },
  parameters: {
    docs: {
      description: {
        story: "Carousel with custom icons and controls positioned at the top.",
      },
    },
  },
};

// Minimal carousel
export const Minimal: Story = {
  args: {
    items: contentSlides,
    hasControls: false,
    hasIndicators: false,
    autoplay: true,
    loop: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Minimal carousel with no controls or indicators, only autoplay.",
      },
    },
  },
};

// With spacing
export const WithSpacing: Story = {
  args: {
    items: sampleImages,
    slidesPerPage: 3,
    spacing: "16px",
    size: "lg",
    loop: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Carousel with custom spacing between slides.",
      },
    },
  },
};

// Interactive demo
export const Interactive: Story = {
  render: () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
          <span className="text-sm font-medium">Current Slide:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            {currentSlide + 1} of {sampleImages.length}
          </span>
        </div>

        <Carousel
          items={sampleImages}
          onPageChange={({ page }) => setCurrentSlide(page)}
          loop={true}
          allowMouseDrag={true}
          showAutoplayButton={true}
        />

        <div className="text-xs text-gray-500 text-center">
          Try dragging the slides or using the controls
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive carousel demo with page change tracking.",
      },
    },
  },
};

// Edge cases
export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Single Slide</h3>
        <Carousel items={[sampleImages[0]]} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Two Slides</h3>
        <Carousel items={sampleImages.slice(0, 2)} loop={true} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Many Slides</h3>
        <Carousel
          items={[...sampleImages, ...sampleImages, ...sampleImages]}
          slidesPerPage={4}
          slidesPerMove={2}
          size="sm"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Edge cases with different numbers of slides.",
      },
    },
  },
};
