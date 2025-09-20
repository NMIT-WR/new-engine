import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Link } from '../atoms/link'
import { tv } from '../utils'

const footerVariants = tv({
  slots: {
    root: 'flex w-full bg-footer-bg items-center justify-center',
    container: 'w-full max-w-footer-max bg-footer-container-bg',
    section: 'bg-footer-section-bg',
    brand: '',
    title: 'font-footer-title text-footer-title',
    link: 'font-footer-link text-footer-link',
    text: 'text-footer-text',
  },
  variants: {
    direction: {
      vertical: {
        root: 'flex-col',
      },
      horizontal: {
        root: 'flex-row',
      },
    },
    layout: {
      col: {
        container: 'grid grid-cols-(--footer-cols)',
      },
      row: {
        container: 'flex flex-row',
      },
    },
    sectionFlow: {
      col: {
        section: 'flex flex-col',
      },
      row: {
        section: 'flex flex-row',
      },
    },
    size: {
      sm: {
        root: 'p-footer-root-sm',
        container: 'gap-footer-container-sm',
        section: 'gap-footer-section-sm',
        title: 'text-footer-title-sm',
        link: 'text-footer-link-sm',
        text: 'text-footer-text-sm',
      },
      md: {
        root: 'p-footer-root-md',
        container: 'gap-footer-container-md',
        section: 'gap-footer-section-md',
        title: 'text-footer-title-md',
        link: 'text-footer-link-md',
        text: 'text-footer-text-md',
      },
      lg: {
        root: 'p-footer-root-lg',
        container: 'gap-footer-container-lg',
        section: 'gap-footer-section-lg',
        title: 'text-footer-title-lg',
        link: 'text-footer-link-lg',
        text: 'text-footer-text-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'horizontal',
    layout: 'col',
    sectionFlow: 'col',
  },
})

interface FooterContextValue {
  size?: 'sm' | 'md' | 'lg'
  sectionFlow?: 'col' | 'row'
}

const FooterContext = createContext<FooterContextValue>({})

interface FooterProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
  className?: string
}

interface FooterContainerProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterSectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterTitleProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterLinkProps
  extends HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
  href: string
  external?: boolean
}

interface FooterTextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

export function Footer({
  children,
  size,
  sectionFlow,
  className,
}: FooterProps) {
  const { root } = footerVariants({ size, className })

  return (
    <FooterContext.Provider value={{ size, sectionFlow }}>
      <footer className={root()}>{children}</footer>
    </FooterContext.Provider>
  )
}

Footer.Container = function FooterContainer({
  children,
  className,
}: FooterContainerProps) {
  const { size } = useContext(FooterContext)
  const { container } = footerVariants({ size, className })
  return <div className={container()}>{children}</div>
}

Footer.Section = function FooterSection({
  children,
  className,
}: FooterSectionProps) {
  const { size, sectionFlow } = useContext(FooterContext)
  const { section } = footerVariants({
    size,
    sectionFlow,
    className,
  })
  return <div className={section()}>{children}</div>
}

Footer.Title = function FooterTitle({ children, className }: FooterTitleProps) {
  const { size } = useContext(FooterContext)
  const { title } = footerVariants({ size, className })
  return <h3 className={title()}>{children}</h3>
}

Footer.Link = function FooterLink({
  children,
  className,
  href,
  external,
  ...props
}: FooterLinkProps) {
  const { size } = useContext(FooterContext)
  const { link } = footerVariants({ size, className })
  return (
    <Link
      href={href}
      className={link()}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}

Footer.Text = function FooterText({ children, className }: FooterTextProps) {
  const { size } = useContext(FooterContext)
  const { text } = footerVariants({ size, className })
  return <p className={text()}>{children}</p>
}
