import { type HTMLAttributes, type ReactNode, createContext } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Link } from '../atoms/link'
import { tv } from '../utils'

const footerVariants = tv({
  slots: {
    root: 'flex flex-col',
    row: 'flex flex-row',
    col: 'flex flex-col',
    title: 'text-lg font-bold',
    link: 'text-blue-500 hover:text-blue-700',
  },
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface FooterContextValue {
  size?: 'sm' | 'md' | 'lg'
}

const FooterContext = createContext<FooterContextValue>({})

interface FooterProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
  className?: string
}

interface FooterRowProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterColProps
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
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

export function Footer({ children, size, className }: FooterProps) {
  const { root } = footerVariants({ size, className })
  return <footer className={root()}>{children}</footer>
}

export function FooterRow({ children, className }: FooterRowProps) {
  const { row } = footerVariants({ className })
  return <div className={row()}>{children}</div>
}

export function FooterCol({ children, className }: FooterColProps) {
  const { col } = footerVariants({ className })
  return <div className={col()}>{children}</div>
}

export function FooterTitle({ children, className }: FooterTitleProps) {
  const { title } = footerVariants({ className })
  return <h3 className={title()}>{children}</h3>
}

export function FooterLink({ children, className }: FooterLinkProps) {
  const { link } = footerVariants({ className })
  return (
    <Link href="#" className={link()}>
      {children}
    </Link>
  )
}
