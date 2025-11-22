import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from "react"
import type { VariantProps } from "tailwind-variants"
import { Link } from "../atoms/link"
import { tv } from "../utils"

const footerVariants = tv({
  slots: {
    root: "flex w-full items-center justify-center rounded-footer bg-footer-bg",
    container: "w-full max-w-footer-max bg-footer-container-bg",
    section: "bg-footer-section-bg",
    list: "flex list-none flex-col gap-footer-list-gap bg-footer-list-bg",
    bottom:
      "flex w-full items-center justify-between border-t-(--border-width-footer) bg-footer-bottom-bg pt-footer-bottom",
    title:
      "font-footer-title text-footer-title-fg transition-footer-title hover:text-footer-title-fg-hover",
    link: "font-footer-link text-footer-link-fg transition-footer-link hover:text-footer-link-fg-hover",
    text: "text-footer-text-fg",
    divider: "flex h-footer-divider w-full border-0 bg-footer-divider-bg",
  },
  variants: {
    direction: {
      vertical: {
        root: "flex-col",
      },
      horizontal: {
        root: "flex-row",
      },
    },
    layout: {
      col: {
        container: "grid grid-cols-(--footer-cols)",
      },
      row: {
        container: "flex flex-row",
      },
    },
    sectionFlow: {
      col: {
        section: "flex flex-col",
      },
      row: {
        section: "flex flex-row",
      },
    },
    size: {
      sm: {
        root: "p-footer-root-sm",
        container: "gap-footer-container-sm",
        section: "gap-footer-section-sm",
        list: "gap-footer-list-gap-sm",
        title: "text-footer-title-sm",
        link: "text-footer-link-sm",
        text: "text-footer-text-sm",
        bottom: "p-footer-bottom-sm",
        divider: "my-footer-divider-sm",
      },
      md: {
        root: "p-footer-root-md",
        container: "gap-footer-container-md",
        section: "gap-footer-section-md",
        list: "gap-footer-list-gap-md",
        title: "text-footer-title-md",
        link: "text-footer-link-md",
        text: "text-footer-text-md",
        bottom: "p-footer-bottom-md",
        divider: "my-footer-divider-md",
      },
      lg: {
        root: "p-footer-root-lg",
        container: "gap-footer-container-lg",
        section: "gap-footer-section-lg",
        list: "gap-footer-list-gap-lg",
        title: "text-footer-title-lg",
        link: "text-footer-link-lg",
        text: "text-footer-text-lg",
        bottom: "p-footer-bottom-lg",
        divider: "my-footer-divider-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
    direction: "horizontal",
    layout: "col",
    sectionFlow: "col",
  },
})

type FooterContextValue = {
  size?: "sm" | "md" | "lg"
  sectionFlow?: "col" | "row"
  layout?: "col" | "row"
}

const FooterContext = createContext<FooterContextValue>({})

interface FooterProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode
}

interface FooterContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

interface FooterSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

interface FooterTitleProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

interface FooterLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  external?: boolean
}

interface FooterTextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

interface FooterListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
}

interface FooterDividerProps extends HTMLAttributes<HTMLHRElement> {}

interface FooterBottomProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Footer({
  children,
  size,
  sectionFlow,
  direction,
  layout,
  className,
}: FooterProps) {
  const { root } = footerVariants({ size, direction })

  return (
    <FooterContext.Provider value={{ size, sectionFlow, layout }}>
      <footer className={root({ className })}>{children}</footer>
    </FooterContext.Provider>
  )
}

Footer.Container = function FooterContainer({
  children,
  className,
}: FooterContainerProps) {
  const { size, layout } = useContext(FooterContext)
  const { container } = footerVariants({ size, layout })
  return <div className={container({ className })}>{children}</div>
}

Footer.Section = function FooterSection({
  children,
  className,
}: FooterSectionProps) {
  const { size, sectionFlow } = useContext(FooterContext)
  const { section } = footerVariants({
    size,
    sectionFlow,
  })
  return <div className={section({ className })}>{children}</div>
}

Footer.Title = function FooterTitle({ children, className }: FooterTitleProps) {
  const { size } = useContext(FooterContext)
  const { title } = footerVariants({ size })
  return <h3 className={title({ className })}>{children}</h3>
}

Footer.Link = function FooterLink({
  children,
  className,
  href,
  external,
  ...props
}: FooterLinkProps) {
  const { size } = useContext(FooterContext)
  const { link } = footerVariants({ size })
  return (
    <Link
      className={link({ className })}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}

Footer.Text = function FooterText({ children, className }: FooterTextProps) {
  const { size } = useContext(FooterContext)
  const { text } = footerVariants({ size })
  return <p className={text({ className })}>{children}</p>
}

Footer.List = function FooterList({
  children,
  className,
  ...props
}: FooterListProps) {
  const { size } = useContext(FooterContext)
  const { list } = footerVariants({ size })
  return (
    <ul className={list({ className })} {...props}>
      {children}
    </ul>
  )
}

Footer.Divider = function FooterDivider({
  className,
  ...props
}: FooterDividerProps) {
  const { size } = useContext(FooterContext)
  const { divider } = footerVariants({ size })
  return <hr className={divider({ className })} {...props} />
}

Footer.Bottom = function FooterBottom({
  children,
  className,
  ...props
}: FooterBottomProps) {
  const { size } = useContext(FooterContext)
  const { bottom } = footerVariants({ size })
  return (
    <div className={bottom({ className })} {...props}>
      {children}
    </div>
  )
}
