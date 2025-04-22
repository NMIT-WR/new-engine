import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"

export const metadata: Metadata = {
  title: "Inspiration",
  description: "Get inspired by our latest collections",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

export default function InspirationPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-dark-green-three-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with dark green three-seater sofa"
          className="md:h-screen md:object-cover mb-8 md:mb-26"
        />
      </div>
      <div className="pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              The Astrid Curve sofa is a masterpiece of minimalism and luxury.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Our design philosophy revolves around creating pieces that are
                both beautiful and practical. Inspired by Scandinavian
                simplicity, modern luxury, and timeless classics.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/products/astrid-curve">
              <Image
                src="/images/content/dark-gray-three-seater-sofa.png"
                width={768}
                height={572}
                alt="Dark gray three-seater sofa"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Astrid Curve</p>
                  <p className="text-grayscale-500 text-xs">
                    Scandinavian Simplicity
                  </p>
                </div>
                <div>
                  <p className="font-semibold">1500€</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/content/living-room-brown-armchair-gray-corner-sofa.png"
              width={2496}
              height={1404}
              alt="Living room with brown armchair and gray corner sofa"
              className="mt-26 md:mt-36 mb-8 md:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              Haven Sofas have minimalistic designs, neutral colors, and
              high-quality textures.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Perfect for those who seek comfort with a clean and understated
                aesthetic. This collection brings the essence of Scandinavian
                elegance to your living room.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink
              href="/products/nordic-haven"
              className="mb-8 md:mb-16 inline-block"
            >
              <Image
                src="/images/content/gray-three-seater-sofa.png"
                width={768}
                height={572}
                alt="Gray three-seater sofa"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Nordic Haven</p>
                  <p className="text-grayscale-500 text-xs">
                    Scandinavian Simplicity
                  </p>
                </div>
                <div>
                  <p className="font-semibold">1500€</p>
                </div>
              </div>
            </LocalizedLink>
            <LocalizedLink href="/products/nordic-breeze">
              <Image
                src="/images/content/gray-arm-chair.png"
                width={768}
                height={572}
                alt="Gray arm chair"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Nordic Breeze</p>
                  <p className="text-grayscale-500 text-xs">
                    Scandinavian Simplicity
                  </p>
                </div>
                <div>
                  <p className="font-semibold">1200€</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
        </Layout>
        <Image
          src="/images/content/living-room-gray-two-seater-puffy-sofa.png"
          width={2880}
          height={1618}
          alt="Living room with gray two-seater puffy sofa"
          className="md:h-screen md:object-cover mt-26 md:mt-36 mb-8 md:mb-26"
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              Oslo Drift is infused with playful textures and vibrant patterns
              with eclectic vibes.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Whether you&apos;re looking for bold statement pieces or subtle
                elegance, this collection elevates your home with a touch of
                glamour, sophistication, and unmatched coziness.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/products/oslo-drift">
              <Image
                src="/images/content/white-two-seater-sofa.png"
                width={768}
                height={572}
                alt="White two-seater sofa"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Oslo Drift</p>
                  <p className="text-grayscale-500 text-xs">
                    Scandinavian Simplicity
                  </p>
                </div>
                <div>
                  <p className="font-semibold">1500€</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
        </Layout>
        <CollectionsSection className="mt-26 md:mt-36" />
      </div>
    </>
  )
}
