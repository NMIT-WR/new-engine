import type { ReactNode, Ref } from 'react'
import { Button } from '../atoms/button'
import { Icon, type IconType } from '../atoms/icon'
import { Link } from '../atoms/link'
import { Dialog } from '../molecules/dialog'
import { Header } from '../organisms/header'

export interface DrawerCategory {
  name: string
  icon: IconType
  href: string
  description?: string
}

// Trigger component props
export interface HeaderSubmenuDrawerTriggerProps {
  trigger: ReactNode | string
  open: boolean
  onOpenChange: (open: boolean) => void
  showTriggerIcon?: boolean
  triggerIcon?: IconType
  ref?: Ref<HTMLDivElement>
}

// Content component props
export interface HeaderSubmenuDrawerContentProps {
  categories: DrawerCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: 'center' | 'left' | 'right' | 'top' | 'bottom'
  layout?: 'flex' | 'grid'
  gridCols?: 2 | 3 | 4 | 5 | 6
  dialogClassName?: string
}

function HeaderSubmenuDrawerTrigger({
  trigger,
  open,
  onOpenChange,
  showTriggerIcon = true,
  triggerIcon = 'icon-[mdi--chevron-down]',
  ref,
}: HeaderSubmenuDrawerTriggerProps) {
  return (
    <Header.NavItem ref={ref}>
      <Button
        className="px-0 py-0 hover:bg-transparent"
        theme="borderless"
        onClick={() => onOpenChange(!open)}
        icon={showTriggerIcon ? triggerIcon : undefined}
        iconPosition="right"
      >
        {trigger}
      </Button>
    </Header.NavItem>
  )
}

function HeaderSubmenuDrawerContent({
  categories,
  open,
  onOpenChange,
  placement = 'top',
  layout = 'flex',
  gridCols = 4,
  dialogClassName = '-z-1 top-11 shadow-none',
}: HeaderSubmenuDrawerContentProps) {
  const getLayoutClassName = () => {
    if (layout === 'grid') {
      const colsMap = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
      }
      return `grid ${colsMap[gridCols]} gap-400`
    }
    return 'flex items-center justify-evenly'
  }

  return (
    <Dialog
      open={open}
      customTrigger
      placement={placement}
      size="xs"
      hideCloseButton
      behavior="modeless"
      className={dialogClassName}
      modal={false}
    >
      <div className={getLayoutClassName()}>
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="flex cursor-pointer flex-col items-center gap-100 text-center hover:opacity-75"
            onClick={() => onOpenChange(false)}
          >
            <Icon icon={category.icon} className="text-2xl" />
            <div className="flex flex-col gap-50">
              <span className="font-medium text-sm">{category.name}</span>
              {category.description && (
                <span className="text-fg-muted text-xs">
                  {category.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Dialog>
  )
}

export const HeaderSubmenuDrawer = {
  Trigger: HeaderSubmenuDrawerTrigger,
  Content: HeaderSubmenuDrawerContent,
}
