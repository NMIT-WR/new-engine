import Link from 'next/link'
import { Image } from 'ui/src/atoms/image'
import { tv } from 'ui/src/utils'

const saleBannerVariants = tv({
  slots: {
    root: 'py-banner-section-y',
    container: 'mx-auto max-w-banner-max-w px-banner-container-x',
    wrapper: 'relative overflow-hidden rounded-banner-radius bg-banner-bg',
    imageWrapper: 'absolute inset-0',
    image: 'h-full w-full object-cover opacity-banner-image-opacity',
    content:
      'relative flex flex-col items-center gap-banner-content-gap px-banner-content-x md:px-banner-content-x-md py-banner-content-y md:py-banner-content-y-md text-center text-banner-text',
    title: 'font-bold text-banner-title-size md:text-banner-title-size-md',
    subtitle: 'text-banner-subtitle-size text-banner-subtitle',
    link: 'inline-block rounded-banner-button-radius bg-banner-button-bg px-banner-button-x py-banner-button-y font-medium text-banner-button-text transition-colors hover:bg-banner-button-hover',
  },
})

interface SaleBannerProps {
  title: string
  subtitle: string
  backgroundImage: string
  linkText: string
  linkHref: string
}

export function SaleBanner({
  title,
  subtitle,
  backgroundImage,
  linkText,
  linkHref,
}: SaleBannerProps) {
  const styles = saleBannerVariants()

  return (
    <section className={styles.root()}>
      <div className={styles.container()}>
        <div className={styles.wrapper()}>
          <div className={styles.imageWrapper()}>
            <Image
              src={backgroundImage}
              alt="Sale banner"
              className={styles.image()}
            />
          </div>
          <div className={styles.content()}>
            <h2 className={styles.title()}>{title}</h2>
            <p className={styles.subtitle()}>{subtitle}</p>
            <Link href={linkHref} className={styles.link()}>
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
