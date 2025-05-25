'use client'

import { Layout, LayoutColumn } from '@/components/Layout'
import { LocalizedLink } from '@/components/LocalizedLink'
import { NewsletterForm } from '@/components/NewsletterForm'
import { useParams, usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export const Footer: React.FC = () => {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  const isAuthPage = currentPath === '/register' || currentPath === '/login'

  return (
    <div
      className={twMerge(
        'bg-grayscale-50 py-8 md:py-20',
        isAuthPage && 'hidden'
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="flex justify-between max-md:px-4 max-lg:flex-col md:gap-20">
            <div className="flex flex-1 justify-between max-sm:flex-col max-lg:order-2 max-lg:w-full sm:gap-30 md:items-center lg:gap-20">
              <div className="max-w-35 max-md:mb-9 md:flex-1">
                <h1 className="mb-2 text-lg leading-none md:mb-6 md:text-xl md:leading-[0.9]">
                  Sofa Society Co.
                </h1>
                <p className="text-xs">
                  &copy; {new Date().getFullYear()}, Sofa Society
                </p>
              </div>
              <div className="flex flex-1 justify-between gap-10 max-md:text-xs lg:justify-center xl:gap-18">
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <LocalizedLink href="/">FAQ</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/">Help</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/">Delivery</LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/">Returns</LocalizedLink>
                  </li>
                </ul>
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <a
                      href="https://www.instagram.com/agiloltd/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TikTok
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pinterest.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pinterest
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                </ul>
                <ul className="flex flex-col gap-6 md:gap-3.5">
                  <li>
                    <LocalizedLink href="/privacy-policy">
                      Privacy Policy
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/cookie-policy">
                      Cookie Policy
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/terms-of-use">
                      Terms of Use
                    </LocalizedLink>
                  </li>
                </ul>
              </div>
            </div>

            <NewsletterForm className="flex-1 max-md:mb-16 max-lg:order-1 max-lg:w-full lg:max-w-90 xl:max-w-96" />
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
