import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import {
  getProductByHandle,
  getProductFashionDataByHandle,
} from "@lib/data/products"
import ProductTemplate from "@modules/products/templates"
export const dynamic = "force-dynamic"
type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}
/*
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  {
    return []
  }
}*/

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const [pricedProduct, fashionData] = await Promise.all([
    getProductByHandle(handle, region.id),
    getProductFashionDataByHandle(handle),
  ])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      materials={fashionData.materials}
      region={region}
      countryCode={countryCode}
    />
  )
}
