'use client'
import { footerImgs } from '@/assets/footer'
import { Icon } from '@new-engine/ui/atoms/icon'
import { Footer } from '@new-engine/ui/organisms/footer'
import Image from 'next/image'
import Link from 'next/link'

export function N1Footer() {
  return (
    <Footer className="relative px-0 py-0" direction="vertical">
      <Footer.Container className="max-w-full gap-x-800 p-400">
        {/* Company Info Section */}
        <Footer.Section className="col-span-6">
          <Image
            src={footerImgs.footerLogo}
            alt="N1 Shop Logo"
            width={400}
            height={400}
            className="mb-200 w-auto"
          />
          <div className="flex flex-col gap-200">
            <div className="flex items-start">
              <Icon
                icon="icon-[mdi--map-marker]"
                size="sm"
                className="mt-100 mr-200 text-lg text-white"
              />
              <div>
                <Footer.Text>N Distribution s. r. o.</Footer.Text>
                <Footer.Text className="text-xs">
                  Generála Šišky 1990/8, 143 00 Praha 4 - Modřany
                </Footer.Text>
              </div>
            </div>
            <Footer.Text>
              <Icon
                icon="icon-[mdi--phone]"
                size="sm"
                className="mr-200 inline-block text-lg"
              />
              +420 244 402 795
            </Footer.Text>
            <Footer.Link href="mailto:office@ndistribution.cz">
              <Icon
                icon="icon-[mdi--email]"
                size="sm"
                className="mr-200 inline-block text-lg"
              />
              office@ndistribution.cz
            </Footer.Link>
            <Footer.Text>
              <Icon
                icon="icon-[mdi--clock]"
                size="sm"
                className="mr-200 inline-block text-lg"
              />
              Po, Út, St, Čt, Pá: 8:00 - 17:00
            </Footer.Text>
          </div>
        </Footer.Section>

        {/* Business Terms Section */}
        <Footer.Section className="col-span-4 w-fit">
          <Footer.Title>Obchodní podmínky</Footer.Title>
          <Footer.List>
            <Footer.Link href="/zasady-ochrany">
              Zásady ochrany osobních údajů
            </Footer.Link>
            <Footer.Link href="/zpusoby-platby">Způsoby platby</Footer.Link>
            <Footer.Link href="/zpusoby-dopravy">Způsoby dopravy</Footer.Link>
            <Footer.Link href="/nastaveni-cookies">
              Nastavení cookies
            </Footer.Link>
          </Footer.List>
        </Footer.Section>

        {/* Cookies Section */}
        <Footer.Section className="col-span-4">
          <Footer.Title>Opětovné vyvolání cookies</Footer.Title>
        </Footer.Section>

        {/* News Section */}
        <Footer.Section className="col-span-4">
          <Footer.Title>Novinky</Footer.Title>
        </Footer.Section>
      </Footer.Container>
      <Footer.Bottom className="bg-black">
        <Footer.Text className="text-fg-dark text-md">
          2025 COPYRIGHT N Distribution s.r.o.
        </Footer.Text>

        <div className="flex items-center gap-100">
          <Footer.Text className="text-fg-dark text-md">
            Tvorba eshopu:
          </Footer.Text>
          <Link
            href="https://webrevolution.cz"
            className="text-fg-dark text-md underline hover:no-underline"
          >
            Web Revolution
          </Link>
          <Image
            src={footerImgs.wrLogo}
            alt="Web Revolution"
            width={32}
            height={32}
          />
        </div>
      </Footer.Bottom>
    </Footer>
  )
}
