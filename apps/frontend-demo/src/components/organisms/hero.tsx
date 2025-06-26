'use client'
import { Image } from '@ui/atoms/image'
import { LinkButton } from '@ui/atoms/link-button'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  primaryAction,
  secondaryAction,
}: HeroProps) {

  return (
    <section className="relative h-hero-height overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Pozadí hero sekce"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-center">
        <div className="mx-auto w-full max-w-hero-max-w px-hero-container-x sm:px-hero-container-x-sm lg:px-hero-container-x-lg">
          <div className="flex w-full max-w-hero-content-max-w flex-col gap-hero-content-gap">
            <h1 className="font-hero-title text-hero-fg text-hero-title-size tracking-tight sm:text-hero-title-size-sm md:text-hero-title-size-md">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-hero-subtitle-max-w text-hero-fg text-hero-subtitle-size">
                {subtitle}
              </p>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col md:flex-row w-fit gap-hero-button-gap">
                {primaryAction && (
                  <LinkButton
                    variant="primary"
                    size="lg"
                    theme="solid"
                    href="/products"
                    className="py-xs h-fit lg:px-hero-button-x lg:py-hero-button-y"
                  >
                    {primaryAction.label}
                  </LinkButton>
                )}
                {secondaryAction && (
                  <LinkButton
                    variant="primary"
                    size="lg"
                    theme="borderless"
                    href="/products"
                    className='py-xs outline-2 border-white lg:px-hero-button-x lg:py-hero-button-y text-white'
                  >
                    {secondaryAction.label}
                  </LinkButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
