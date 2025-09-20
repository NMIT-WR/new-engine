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
    root: 'flex w-full bg-footer-bg items-center justify-center rounded-footer',
    container: 'w-full max-w-footer-max bg-footer-container-bg',
    section: 'bg-footer-section-bg',
    list: 'flex flex-col bg-footer-list-bg list-none p-0 m-0 gap-footer-list-gap',
    bottom:
      'flex w-full items-center bg-footer-bottom-bg justify-between border-t-(--border-width-footer) border-footer-divider-border pt-footer-bottom',
    title:
      'font-footer-title text-footer-title-fg hover:text-footer-title-fg-hover transition-footer-title',
    link: 'font-footer-link text-footer-link-fg hover:text-footer-link-fg-hover transition-footer-link',
    text: 'text-footer-text-fg',
    divider:
      'w-full h-footer-divider bg-footer-divider-border border-0 my-footer-divider',
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
        list: 'gap-footer-list-gap-sm',
        title: 'text-footer-title-sm',
        link: 'text-footer-link-sm',
        text: 'text-footer-text-sm',
        bottom: 'p-footer-bottom-sm',
        divider: 'my-footer-divider-sm',
      },
      md: {
        root: 'p-footer-root-md',
        container: 'gap-footer-container-md',
        section: 'gap-footer-section-md',
        list: 'gap-footer-list-gap-md',
        title: 'text-footer-title-md',
        link: 'text-footer-link-md',
        text: 'text-footer-text-md',
        bottom: 'p-footer-bottom-md',
        divider: 'my-footer-divider-md',
      },
      lg: {
        root: 'p-footer-root-lg',
        container: 'gap-footer-container-lg',
        section: 'gap-footer-section-lg',
        list: 'gap-footer-list-gap-lg',
        title: 'text-footer-title-lg',
        link: 'text-footer-link-lg',
        text: 'text-footer-text-lg',
        bottom: 'p-footer-bottom-lg',
        divider: 'my-footer-divider-lg',
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

interface FooterListProps
  extends HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterDividerProps
  extends HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof footerVariants> {
  className?: string
}

interface FooterBottomProps
  extends HTMLAttributes<HTMLDivElement>,
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

Footer.List = function FooterList({
  children,
  className,
  ...props
}: FooterListProps) {
  const { size } = useContext(FooterContext)
  const { list } = footerVariants({ size, className })
  return (
    <ul className={list()} {...props}>
      {children}
    </ul>
  )
}

Footer.Divider = function FooterDivider({
  className,
  ...props
}: FooterDividerProps) {
  const { size } = useContext(FooterContext)
  const { divider } = footerVariants({ size, className })
  return <hr className={divider()} {...props} />
}

Footer.Bottom = function FooterBottom({
  children,
  className,
  ...props
}: FooterBottomProps) {
  const { size } = useContext(FooterContext)
  const { bottom } = footerVariants({ size, className })
  return (
    <div className={bottom()} {...props}>
      {children}
    </div>
  )
}
