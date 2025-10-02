import { type SubmenuCategory, links, submenuItems } from '@/data/header'
import { Dialog } from '@new-engine/ui/molecules/dialog'
import { Header } from '@new-engine/ui/organisms/header'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'

export const DesktopSubmenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [activeCategory, setActiveCategory] = useState<SubmenuCategory | null>(
    null
  )

  const handleOpenSubmenu = (categoryName: string) => {
    const category = submenuItems.find((item) => item.name === categoryName)

    if (!category) {
      setDrawerOpen(false)
      return
    }

    setActiveCategory(category)
    setDrawerOpen(true)
  }
  return (
    <Header.Desktop>
      <div className="w-full" onMouseLeave={() => setDrawerOpen(false)}>
        <Header.Container className="w-full border-highlight border-t-[1px] bg-gray-950 py-0">
          <Header.Nav className="z-30 gap-x-0 px-0 py-0">
            {links.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                prefetch={true}
                className="group px-300 py-300 hover:bg-yellow-400"
              >
                <Header.NavItem
                  onMouseEnter={() => handleOpenSubmenu(link.label)}
                  className="font-bold text-fg-reverse group-hover:text-black"
                >
                  {link.label}
                </Header.NavItem>
              </NextLink>
            ))}
          </Header.Nav>
        </Header.Container>

        <Dialog
          open={drawerOpen}
          customTrigger
          placement="top"
          position="absolute"
          size="xs"
          hideCloseButton
          behavior="modeless"
          className="top-full grid grid-rows-[1fr] starting:grid-rows-[0fr] bg-white shadow-none transition-all duration-500 ease-out"
          modal={false}
          trapFocus={false}
          preventScroll={false}
          closeOnInteractOutside={true}
          portal={false}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-6 gap-200">
              {activeCategory?.items.map((item) => (
                <Header.NavItem className="text-sm" key={item.name}>
                  <div className="grid h-full items-center justify-center border border-transparent hover:border-border-primary">
                    <div className="flex flex-col items-center gap-200">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          quality={50}
                          placeholder="blur"
                          className="h-[100px] w-[100px] object-contain"
                        />
                      )}
                      <h3 className="font-bold text-md">{item.name}</h3>
                    </div>
                  </div>
                </Header.NavItem>
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </Header.Desktop>
  )
}
