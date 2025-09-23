import { carouselImages } from '@/assets/carousel'
import { icons } from '@/assets/icons'
import { topCategoryImages } from '@/assets/top-category'
import type { Product } from '@/types/product'
import type { CarouselSlide } from '@new-engine/ui/molecules/carousel'

export const featureBlocks = [
  {
    maintText: 'DOPRAVA ZDARMA',
    subText: 'Pro objednávky nad 2.000 Kč.',
    icon: icons.carIcon,
  },
  {
    maintText: 'BEZPEČNÁ PLATBA',
    subText: 'Zabezpečení online platba.',
    icon: icons.cardIcon,
  },
  {
    maintText: 'DOPRAVA ZDARMA',
    subText: 'Odběrová místa PPL Parcel Shop',
    icon: icons.mapIcon,
  },
  {
    maintText: 'ŠIŘOKÁ NABÍDKA',
    subText: 'Oblečení, přilby, kola, chrániče, skateboardy,...',
    icon: icons.storeIcon,
  },
]

export const heroCarouselSlides: CarouselSlide[] = [
  {
    id: '1',
    src: carouselImages.saleImg.src,
  },
  {
    id: '2',
    src: carouselImages.nwImg.src,
  },
  {
    id: '3',
    src: carouselImages.tallboyImg.src,
  },
]

export const topCategory = [
  { src: topCategoryImages.bestSellerImg, label: 'Nejprodávanější přilba FOX' },
  { src: topCategoryImages.bicularImg, label: 'Purevue pro čistý obraz' },
  { src: topCategoryImages.electroImg, label: 'Nabídka elektrokol' },
  { src: topCategoryImages.tretryImg, label: 'Flat podrážky jsou v kurzu' },
]

export const featuredProducts: Product[] = [
  {
    id: 'product-1',
    title: 'Pánská kšiltovka Fox Level Up Strapback Hat',
    price: '1 099 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Skladem 2 ks',
    imageSrc: '/products/product1.jpg',
  },
  {
    id: 'product-2',
    title: 'Pánské Road tretry Northwave Veloce Extreme',
    price: '9 999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Skladem více než 10 ks',
    imageSrc: '/products/product2.jpg',
  },
  {
    id: 'product-3',
    title: 'Pánské triko Fox Big F Ss Prem Tee',
    price: '999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Skladem více než 10 ks',
    imageSrc: '/products/product3.jpg',
  },
  {
    id: 'product-4',
    title: 'Sedlo Selle Italia Flite Boost Superflow TM L3',
    price: '3 999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Skladem 3 ks',
    imageSrc: '/products/product4.jpg',
  },
  {
    id: 'product-5',
    title: 'Silniční kolo Cervélo R5 Ultegra DI2 Permafrost',
    price: '172 499 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Poslední kus',
    imageSrc: '/products/product5.jpg',
  },
  {
    id: 'product-6',
    title: 'Silniční kolo Cervélo S5 Force AXS Five Black',
    price: '199 999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Poslední kus',
    imageSrc: '/products/product6.jpg',
  },
  {
    id: 'product-7',
    title: 'Trail kolo Santa Cruz Tallboy 5 C 29 24 LG MELON GX1 AXS',
    price: '134 999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Poslední kus',
    imageSrc: '/products/product7.jpg',
  },
  {
    id: 'product-8',
    title: 'Zapletená kola Reserve Wheels RSV 30 SL 29" | DT 350 110 XD 6b',
    price: '44 999 Kč',
    stockStatus: 'in-stock',
    stockValue: 'Poslední kus',
    imageSrc: '/products/product8.jpg',
  },
]
