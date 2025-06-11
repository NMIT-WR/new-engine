'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/src/atoms/button'
import { Image } from 'ui/src/atoms/image'

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
  const router = useRouter()

  const handlePrimaryAction = () => {
    if (primaryAction?.onClick) {
      primaryAction.onClick()
    } else if (primaryAction?.href) {
      router.push(primaryAction.href)
    }
  }

  const handleSecondaryAction = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick()
    } else if (secondaryAction?.href) {
      router.push(secondaryAction.href)
    }
  }

  return (
    <section className="relative h-hero-height overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
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
              <div className="flex w-fit gap-hero-button-gap">
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="solid"
                    onClick={handlePrimaryAction}
                    className="px-hero-button-x py-hero-button-y"
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="outlined"
                    onClick={handleSecondaryAction}
                    className={`border-white px-hero-button-x py-hero-button-y text-white`}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
