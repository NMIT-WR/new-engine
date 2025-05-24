import type { Meta, StoryObj } from "@storybook/react";
import { Carousel, type CarouselSlide } from "../../src/molecules/carousel";
import React, { useState } from "react";

// Sample images using src approach (simpler)
const sampleImages: CarouselSlide[] = [
  {
    id: "slide-1",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    alt: "Beautiful landscape",
    // imageProps: { width: 250, height: 250 },
  },
  {
    id: "slide-2",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    alt: "City skyline",
    // imageProps: { width: 250, height: 250 },
  },
  {
    id: "slide-3",
    src: "https://images.unsplash.com/photo-1747258294931-79af146bd74c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Ocean view",
    // imageProps: { width: 250, height: 250 },
  },

  {
    id: "coffee",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    alt: "Coffee",
    //  imageProps: { width: 250, height: 250 },
  },
  {
    id: "architecture",
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600",
    alt: "Architecture",
    // imageProps: { width: 250, height: 250 },
  },

  {
    id: "city-panorama",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200",
    alt: "City panorama",
    //  imageProps: { width: 400, height: 150 },
  },
  {
    id: "beach-wide",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    alt: "Beach panorama",
    // imageProps: { width: 400, height: 150 },
  },

  {
    id: "skyscraper",
    src: "https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=400",
    alt: "Skyscraper",
    //  imageProps: { width: 150, height: 400 },
  },
];

// Mixed approach - some images, some custom content
const mixedSlides: CarouselSlide[] = [
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
const contentSlides: CarouselSlide[] = [
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
      <div className="flex ">
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic carousel with simple image sources
export const Default: Story = {
  args: {
    slides: sampleImages,
    orientation: "horizontal",
    loop: true,
    allowMouseDrag: true,
    autoplay: false,
  },
};

// Mixed content approach - images and custom JSX
export const MixedContent: Story = {
  args: {
    slides: mixedSlides,
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

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Small</h3>
        <Carousel slides={sampleImages.slice(0, 3)} slideCount={3} size="sm" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Medium (Default)</h3>
        <Carousel slides={sampleImages.slice(0, 3)} slideCount={3} size="md" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Large</h3>
        <Carousel slides={sampleImages.slice(0, 3)} slideCount={3} size="lg" />
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

export const ObjectFitDemo: Story = {
  render: () => {
    const testImage = {
      id: "test",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      alt: "Portrait for object-fit testing",
    };

    const size = "md";
    const slideCount = 1;

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Object Fit Variants</h3>
          <p className="text-sm text-gray-600">
            Portrait image (400×600) in square containers
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Cover */}
          <div>
            <h4 className="text-sm font-medium mb-2">Cover</h4>
            <p className="text-xs text-gray-500 mb-4">
              Image covers entire container, may crop
            </p>
            <Carousel
              slides={[testImage]}
              objectFit="cover"
              aspectRatio="square"
              size={size}
              loop={false}
              slideCount={slideCount}
            />
          </div>

          {/* Contain */}
          <div>
            <h4 className="text-sm font-medium mb-2">Contain</h4>
            <p className="text-xs text-gray-500 mb-4">
              Entire image visible, may have empty space
            </p>
            <Carousel
              slides={[testImage]}
              objectFit="contain"
              aspectRatio="square"
              size={size}
              loop={false}
              slideCount={slideCount}
            />
          </div>

          {/* Fill */}
          <div>
            <h4 className="text-sm font-medium mb-2">Fill</h4>
            <p className="text-xs text-gray-500 mb-4">
              Image stretches to fill, may distort
            </p>
            <Carousel
              slides={[testImage]}
              objectFit="fill"
              aspectRatio="square"
              size={size}
              loop={false}
              slideCount={slideCount}
            />
          </div>

          {/* None */}
          <div>
            <h4 className="text-sm font-medium mb-2">None</h4>
            <p className="text-xs text-gray-500 mb-4">
              Natural size, no fitting applied
            </p>
            <Carousel
              slides={[testImage]}
              objectFit="none"
              aspectRatio="square"
              size={size}
              loop={false}
              slideCount={slideCount}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const AspectRatioDemo: Story = {
  render: () => {
    const landscapeImage = {
      id: "landscape",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      alt: "Mountain landscape",
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Aspect Ratio Variants</h3>
          <p className="text-sm text-gray-600">
            Same landscape image in different aspect ratios
          </p>
        </div>

        <div className="space-y-6">
          {/* Square */}
          <div>
            <h4 className="text-sm font-medium mb-2">Square (1:1)</h4>
            <Carousel
              slides={[landscapeImage]}
              slideCount={1}
              aspectRatio="square"
              objectFit="cover"
              size="md"
              loop={false}
            />
          </div>

          {/* Landscape */}
          <div>
            <h4 className="text-sm font-medium mb-2">Landscape (16:9)</h4>
            <Carousel
              slides={[landscapeImage]}
              slideCount={1}
              aspectRatio="landscape"
              objectFit="cover"
              size="md"
              loop={false}
            />
          </div>

          {/* Portrait */}
          <div>
            <h4 className="text-sm font-medium mb-2">Portrait (3:4)</h4>
            <Carousel
              slides={[landscapeImage]}
              slideCount={1}
              aspectRatio="portrait"
              objectFit="cover"
              size="md"
              loop={false}
            />
          </div>

          {/* Wide */}
          <div>
            <h4 className="text-sm font-medium mb-2">Wide (21:9)</h4>
            <Carousel
              slides={[landscapeImage]}
              slideCount={1}
              aspectRatio="wide"
              objectFit="cover"
              size="md"
              loop={false}
            />
          </div>

          {/* None */}
          <div>
            <h4 className="text-sm font-medium mb-2">None (natural height)</h4>
            <Carousel
              slides={[landscapeImage]}
              aspectRatio="none"
              objectFit="contain"
              size="md"
              loop={false}
              slideCount={1}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const CombinedDemo: Story = {
  render: () => {
    const [objectFit, setObjectFit] = useState<
      "cover" | "contain" | "fill" | "none"
    >("cover");
    const [aspectRatio, setAspectRatio] = useState<
      "square" | "landscape" | "portrait" | "wide" | "none"
    >("square");
    const [size, setSize] = useState<"sm" | "md" | "lg" | "full">("md");

    const testImages: CarouselSlide[] = [
      {
        id: "portrait",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        alt: "Portrait",
      },
      {
        id: "landscape",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        alt: "Landscape",
      },
      {
        id: "square",
        src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
        alt: "Square",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Object Fit</label>
            <select
              value={objectFit}
              onChange={(e) => setObjectFit(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="square">Square</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="wide">Wide</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="px-3 py-2 border rounded"
            >
              <option value="sm">sm</option>
              <option value="md">md</option>
              <option value="lg">lg</option>
              <option value="full">full</option>
            </select>
          </div>
        </div>

        <Carousel
          slides={testImages}
          objectFit={objectFit}
          aspectRatio={aspectRatio}
          size={size}
          slideCount={3}
        />

        <div className="text-xs text-gray-500">
          Try different combinations to see how images adapt
        </div>
      </div>
    );
  },
};

// Vertical orientation
export const Vertical: Story = {
  render: () => (
    <div className="">
      <Carousel
        orientation="vertical"
        slides={sampleImages.slice(0, 4)}
        size="md"
        loop
        slideCount={4}
      />
    </div>
  ),
};

// With autoplay
export const Autoplay: Story = {
  args: {
    slides: contentSlides,
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
    slides: sampleImages,
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

// With spacing
export const WithSpacing: Story = {
  args: {
    slides: sampleImages,
    slidesPerPage: 3,
    /*spacing: "16px",*/
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
