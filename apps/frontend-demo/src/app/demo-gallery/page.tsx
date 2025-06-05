import { Gallery } from '@/components/organisms/gallery'
import type { CarouselSlide } from 'ui/src/molecules/carousel'

// 3 images for basic example
const fewImages: CarouselSlide[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1200&fit=crop',
    alt: 'Product view 1',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1200&fit=crop',
    alt: 'Product view 2',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1200&fit=crop',
    alt: 'Product view 3',
  },
]

// 8 images for scrolling example
const manyImages: CarouselSlide[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1200&fit=crop',
    alt: 'Product view 1',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1200&fit=crop',
    alt: 'Product view 2',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1200&fit=crop',
    alt: 'Product view 3',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1200&fit=crop',
    alt: 'Product view 4',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop',
    alt: 'Product view 5',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1200&fit=crop',
    alt: 'Product view 6',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1200&fit=crop',
    alt: 'Product view 7',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1200&fit=crop',
    alt: 'Product view 8',
  },
]

export default function DemoGalleryPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Gallery Component Showcase</h1>
          <p className="text-muted-foreground text-lg">
            Vertical and horizontal orientations with different image counts
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vertical - 3 Images */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Vertical - 3 Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thumbnails on the left, no scrolling needed
              </p>
            </div>
            <Gallery 
              images={fewImages} 
              aspectRatio="portrait" 
              orientation="vertical"
            />
          </div>

          {/* Vertical - 8 Images with Scroll */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Vertical - 8 Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thumbnails on the left with vertical scrolling
              </p>
            </div>
            <Gallery 
              images={manyImages} 
              aspectRatio="portrait" 
              orientation="vertical"
            />
          </div>

          {/* Horizontal - 3 Images */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Horizontal - 3 Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thumbnails below, no scrolling needed
              </p>
            </div>
            <Gallery 
              images={fewImages} 
              aspectRatio="landscape" 
              orientation="horizontal"
            />
          </div>

          {/* Horizontal - 8 Images with Scroll */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Horizontal - 8 Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thumbnails below with horizontal scrolling
              </p>
            </div>
            <Gallery 
              images={manyImages} 
              aspectRatio="landscape" 
              orientation="horizontal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}