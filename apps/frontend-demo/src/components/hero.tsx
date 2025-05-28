import { Button } from 'ui/src/atoms/button'
import { Image } from 'ui/src/atoms/image'

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

export function Hero({
  title,
  subtitle,
  backgroundImage,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-center">
        <div className="mx-auto flex w-full max-w-7xl bg-red-500/10 px-4 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-2xl flex-col">
            <h1 className="mb-6 w-max font-bold text-5xl text-white tracking-tight sm:text-6xl md:text-7xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mb-8 w-96 bg-green-200/30 text-gray-100 text-xl">
                {subtitle}
              </p>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex gap-4">
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    theme="solid"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="secondary"
                    size="lg"
                    theme="outlined"
                    onClick={secondaryAction.onClick}
                    className="!text-white !border-white hover:!bg-white/10"
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
