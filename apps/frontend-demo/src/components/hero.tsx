import { Button } from 'ui/src/atoms/button'
import { Image } from 'ui/src/atoms/image'
import { tv } from 'ui/src/utils'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const heroVariants = tv({
  slots: {
    root: 'relative h-[600px] overflow-hidden',
    container: 'absolute inset-0',
    contentWrapper: 'relative flex h-full items-center',
    content: 'mx-auto flex w-full max-w-7xl bg-red-950/5 px-4 sm:px-6 lg:px-8',
    title:
      'mb-6 w-max font-bold text-5xl text-white tracking-tight sm:text-6xl md:text-7xl',
    subtitle: 'mb-8 w-96 text-gray-100 text-xl',
    headerButton: 'w-max px-8 py-2',
  },
})

export function Hero({
  title,
  subtitle,
  backgroundImage,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  const {
    root,
    container,
    contentWrapper,
    content,
    title: titleSlot,
    subtitle: subtitleSlot,
    headerButton,
  } = heroVariants()
  return (
    <section className={root()}>
      {/* Background Image */}
      <div className={container()}>
        <Image
          src={backgroundImage}
          alt="Hero background"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className={contentWrapper()}>
        <div className={content()}>
          <div className="flex w-full max-w-2xl flex-col">
            <h1 className={titleSlot()}>{title}</h1>
            {subtitle && <p className={subtitleSlot()}>{subtitle}</p>}
            {(primaryAction || secondaryAction) && (
              <div className="flex w-fit gap-4">
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="solid"
                    onClick={primaryAction.onClick}
                    className={headerButton()}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="outlined"
                    onClick={secondaryAction.onClick}
                    className={headerButton()}
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
