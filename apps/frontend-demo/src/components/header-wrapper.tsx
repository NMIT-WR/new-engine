'use client'

import { Header } from '@/components/header'
import type { NavItem } from '@/components/molecules/navigation'
import type { IconType } from '@ui/atoms/icon'
import { useMemo } from 'react'

interface HeaderWrapperProps {
  logo: {
    text?: string
    icon?: IconType
  }
}

export function HeaderWrapper({ logo }: HeaderWrapperProps) {
  const navigationItems = useMemo<NavItem[]>(() => {
    const categoryItems: NavItem[] = [
      {
        title: 'Trika',
        href: '/products?categories=pcat_01JYERRCMBCA6DTA9D2QK47365,pcat_01JYERRCMZ5D5VXQNW13ZQ8B42',
      },
      {
        title: 'Bundy',
        href: '/products?categories=pcat_01JYERRCR52228KG73ZTFJDFDH,pcat_01JYERRCRSY098ZP2TPDC8D8F3',
      },
      {
        title: 'Kola',
        href: '/products?categories=pcat_01JYERRDV0ZKND1HNDAEATS1YN,pcat_01JYERRDVQDFDX10CCPPCYR06T,pcat_01JYERRDW8KWJ8D39PFQ3CEJVZ',
      },
      {
        title: 'Doplňky',
        href: '/products?categories=pcat_01JYERRF0F4T1VXMEEGDV9Z2VK,pcat_01JYERRF13W6SR9SNBCB543D5B,pcat_01JYERRF2XXRH863JMAC438GTD',
      },
    ]

    return [
      { title: 'Domů', href: '/', prefetch: false },
      { title: 'Produkty', href: '/products', prefetch: true },
      {
        title: 'Kategorie',
        role: 'submenu' as const,
        children: categoryItems,
        prefetch: false,
      },
      { title: 'O nás', href: '/about', prefetch: false },
      { title: 'Kontakt', href: '/contact', prefetch: false },
    ]
  }, [])

  return <Header logo={logo} navigationItems={navigationItems} />
}
