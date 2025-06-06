'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'ui/src/atoms/button'
import { Image } from 'ui/src/atoms/image'
import { tv } from 'ui/src/utils'

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

const heroVariants = tv({
  slots: {
    root: 'relative h-hero-height overflow-hidden',
    container: 'absolute inset-0',
    overlay: 'absolute inset-0 bg-hero-overlay',
    contentWrapper: 'relative flex h-full items-center',
    content:
      'mx-auto w-full max-w-hero-max-w px-hero-container-x sm:px-hero-container-x-sm lg:px-hero-container-x-lg',
    contentInner:
      'flex w-full max-w-hero-content-max-w flex-col gap-hero-content-gap',
    title:
      'font-hero-title text-hero-title-size sm:text-hero-title-size-sm md:text-hero-title-size-md text-hero-fg tracking-tight',
    subtitle: 'max-w-hero-subtitle-max-w text-hero-subtitle-size text-hero-fg',
    actions: 'flex w-fit gap-hero-button-gap',
    button: 'px-hero-button-x py-hero-button-y',
  },
})

export function Hero({
  title,
  subtitle,
  backgroundImage,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  const styles = heroVariants()
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
    <section className={styles.root()}>
      {/* Background Image */}
      <div className={styles.container()}>
        <Image
          src={backgroundImage}
          alt="Hero background"
          className="h-full w-full object-cover"
        />
        <div className={styles.overlay()} />
      </div>

      {/* Content */}
      <div className={styles.contentWrapper()}>
        <div className={styles.content()}>
          <div className={styles.contentInner()}>
            <h1 className={styles.title()}>{title}</h1>
            {subtitle && <p className={styles.subtitle()}>{subtitle}</p>}
            {(primaryAction || secondaryAction) && (
              <div className={styles.actions()}>
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="solid"
                    onClick={handlePrimaryAction}
                    className={styles.button()}
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
                    className={styles.button({
                      class: 'border-white text-white',
                    })}
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
