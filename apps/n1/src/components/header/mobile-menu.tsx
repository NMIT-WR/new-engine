import { Dialog } from '@techsio/ui-kit/molecules/dialog'
import { Header, HeaderContext } from '@techsio/ui-kit/organisms/header'
import { useContext } from 'react'

export const MobileMenu = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useContext(HeaderContext)

  return (
    <Header.Mobile position="left">
      <Dialog
        open={isMobileMenuOpen}
        onOpenChange={({ open }) => setIsMobileMenuOpen(open)}
        placement="left"
        customTrigger
        behavior="modeless"
        position="absolute"
        modal={false}
        trapFocus={false}
        preventScroll={false}
        closeOnInteractOutside={true}
        portal={false}
        className="w-xs"
      >
        <h2>Dialog</h2>
      </Dialog>
    </Header.Mobile>
  )
}
