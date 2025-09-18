import { carouselImages } from '@/assets/carousel'
import { icons } from '@/assets/icons'
import { topCategoryImages } from '@/assets/top-category'
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
