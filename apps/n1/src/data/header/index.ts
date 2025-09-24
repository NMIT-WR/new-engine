import { headerImgs } from '@/assets/header'
import type { StaticImageData } from 'next/image'

export type SubMenuItem = {
  name: string
  href: string
  image?: StaticImageData
}

export type SubmenuCategory = {
  name: string
  href: string
  items: SubMenuItem[]
}

export const links = [
  {
    href: '/novinky',
    label: 'Novinky',
  },
  {
    href: '/panske',
    label: 'Pánské',
  },
  {
    href: '/damske',
    label: 'Dámské',
  },
  {
    href: '/detske',
    label: 'Dětské',
  },
  {
    href: '/obleceni',
    label: 'Oblečení',
  },
  {
    href: '/cyklo',
    label: 'Cyklo',
  },
  {
    href: '/moto',
    label: 'Moto',
  },
  {
    href: '/snb-skate',
    label: 'Snb-Skate',
  },
  {
    href: '/ski',
    label: 'Ski',
  },
  {
    href: '/vyprodej',
    label: 'Výprodej',
  },
]

export const submenuItems: SubmenuCategory[] = [
  {
    name: 'Pánské',
    href: '/panske',
    items: [
      {
        name: 'Oblečení',
        href: '/panske/obleceni',
        image: headerImgs.panske.obleceni,
      },
      {
        name: 'Cyklo',
        href: '/panske/cyklo',
        image: headerImgs.panske.cyklo,
      },
      {
        name: 'Moto',
        href: '/panske/moto',
        image: headerImgs.panske.moto,
      },
      {
        name: 'Snb-Skate',
        href: '/panske/snb-skate',
        image: headerImgs.panske.snbSkate,
      },
      {
        name: 'Ski',
        href: '/panske/ski',
        image: headerImgs.panske.ski,
      },
    ],
  },
  {
    name: 'Dámské',
    href: '/damske',
    items: [
      {
        name: 'Oblečení',
        href: '/damske/obleceni',
        image: headerImgs.damske.obleceni,
      },
      {
        name: 'Cyklo',
        href: '/damske/cyklo',
        image: headerImgs.damske.cyklo,
      },
      {
        name: 'Moto',
        href: '/damske/moto',
        image: headerImgs.damske.moto,
      },
      {
        name: 'Snb-Skate',
        href: '/damske/snb-skate',
        image: headerImgs.damske.snbSkate,
      },
      {
        name: 'Ski',
        href: '/damske/ski',
        image: headerImgs.damske.ski,
      },
    ],
  },
  {
    name: 'Dětské',
    href: '/detske',
    items: [
      {
        name: 'Oblečení',
        href: '/detske/obleceni',
        image: headerImgs.detske.obleceni,
      },
      {
        name: 'Cyklo',
        href: '/detske/cyklo',
        image: headerImgs.detske.cyklo,
      },
      {
        name: 'Moto',
        href: '/detske/moto',
        image: headerImgs.detske.moto,
      },
      {
        name: 'Snb-Skate',
        href: '/detske/snb-skate',
        image: headerImgs.detske.snbSkate,
      },
      {
        name: 'Ski',
        href: '/detske/ski',
        image: headerImgs.detske.ski,
      },
    ],
  },
  {
    name: 'Oblečení',
    href: '/obleceni',
    items: [
      {
        name: 'Bundy',
        href: '/obleceni/bundy',
        image: headerImgs.obleceni.bundy,
      },
      {
        name: 'Mikiny',
        href: '/obleceni/mikiny',
        image: headerImgs.obleceni.mikiny,
      },
      {
        name: 'Svetry',
        href: '/obleceni/svetry',
        image: headerImgs.obleceni.svetry,
      },
      {
        name: 'Košile',
        href: '/obleceni/kosile',
        image: headerImgs.obleceni.kosile,
      },
      {
        name: 'Trika a tílka',
        href: '/obleceni/trika-a-tilka',
        image: headerImgs.obleceni.trika,
      },
      {
        name: 'Kalhoty',
        href: '/obleceni/kalhoty',
        image: headerImgs.obleceni.kalhoty,
      },
      {
        name: 'Kraťasy',
        href: '/obleceni/kratasy',
        image: headerImgs.obleceni.kratasy,
      },
      {
        name: 'Plavky',
        href: '/obleceni/plavky',
        image: headerImgs.obleceni.plavky,
      },
      {
        name: 'Brýle',
        href: '/obleceni/bryle',
        image: headerImgs.obleceni.bryle,
      },
      {
        name: 'Šaty a Sukně',
        href: '/obleceni/saty-a-sukne',
        image: headerImgs.obleceni.saty,
      },
      {
        name: 'Doplňky',
        href: '/obleceni/doplnky',
        image: headerImgs.obleceni.doplnky,
      },
    ],
  },
  {
    name: 'Cyklo',
    href: '/cyklo',
    items: [
      {
        name: 'Kola',
        href: '/cyklo/kola',
        image: headerImgs.cyklo.kola,
      },
      {
        name: 'Elektrokola',
        href: '/cyklo/elektrokola',
        image: headerImgs.cyklo.elektrokola,
      },
      {
        name: 'Oblečení',
        href: '/cyklo/obleceni',
        image: headerImgs.cyklo.obleceni,
      },
      {
        name: 'Přilby',
        href: '/cyklo/prilby',
        image: headerImgs.cyklo.prilby,
      },
      {
        name: 'Chrániče',
        href: '/cyklo/chranice',
        image: headerImgs.cyklo.chranice,
      },
      {
        name: 'Sedla',
        href: '/cyklo/sedla',
        image: headerImgs.cyklo.sedla,
      },
      {
        name: 'Zapletená kola',
        href: '/cyklo/zapletena-kola',
        image: headerImgs.cyklo.zapletenaKola,
      },
      {
        name: 'Komponenty',
        href: '/cyklo/komponenty',
        image: headerImgs.cyklo.komponenty,
      },
      {
        name: 'Nářadí',
        href: '/cyklo/naradi',
        image: headerImgs.cyklo.naradi,
      },
      {
        name: 'Přeprava',
        href: '/cyklo/preprava',
        image: headerImgs.cyklo.preprava,
      },
      {
        name: 'Tašky',
        href: '/cyklo/tasky',
        image: headerImgs.cyklo.tasky,
      },
      {
        name: 'Výživa',
        href: '/cyklo/vyziva',
        image: headerImgs.cyklo.vyziva,
      },
      {
        name: 'Boty',
        href: '/cyklo/boty',
        image: headerImgs.cyklo.boty,
      },
      {
        name: 'Doplňky',
        href: '/cyklo/doplnky',
        image: headerImgs.cyklo.doplnky,
      },
    ],
  },
  {
    name: 'Moto',
    href: '/moto',
    items: [
      {
        name: 'Přilby',
        href: '/moto/prilby',
        image: headerImgs.moto.prilby,
      },
      {
        name: 'Boty',
        href: '/moto/boty',
        image: headerImgs.moto.boty,
      },
      {
        name: 'Oblečení',
        href: '/moto/obleceni',
        image: headerImgs.moto.obleceni,
      },
      {
        name: 'Chrániče',
        href: '/moto/chranice',
        image: headerImgs.moto.chranice,
      },
      {
        name: 'Brýle',
        href: '/moto/bryle',
        image: headerImgs.moto.bryle,
      },
      {
        name: 'Doplňky',
        href: '/moto/doplnky',
        image: headerImgs.moto.doplnky,
      },
    ],
  },
  {
    name: 'Snb-Skate',
    href: '/snb-skate',
    items: [
      {
        name: 'Skateboarding',
        href: '/snb-skate/skateboarding',
        image: headerImgs.snbSkate.skateboard,
      },
      {
        name: 'Snowboarding',
        href: '/snb-skate/snowboarding',
        image: headerImgs.snbSkate.snowboard,
      },
      {
        name: 'Brusle',
        href: '/snb-skate/brusle',
        image: headerImgs.snbSkate.brusle,
      },
    ],
  },
  {
    name: 'Ski',
    href: '/ski',
    items: [
      {
        name: 'Oblečení',
        href: '/ski/obleceni',
        image: headerImgs.ski.obleceni,
      },
      {
        name: 'Doplňky',
        href: '/ski/doplnky',
        image: headerImgs.ski.doplnky,
      },
    ],
  },
]
