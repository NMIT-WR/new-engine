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
    href: '/obleceni-category-347',
    label: 'Oblečení',
  },
  {
    href: '/cyklo-category-378',
    label: 'Cyklo',
  },
  {
    href: '/moto-category-424',
    label: 'Moto',
  },
  {
    href: '/snb-skate-category-448',
    label: 'Snb-Skate',
  },
  {
    href: '/ski-category-466',
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
    href: '/obleceni-category-347',
    items: [
      {
        name: 'Bundy',
        href: '/obleceni-category-347/bundy',
        image: headerImgs.obleceni.bundy,
      },
      {
        name: 'Mikiny',
        href: '/obleceni-category-347/mikiny',
        image: headerImgs.obleceni.mikiny,
      },
      {
        name: 'Svetry',
        href: '/obleceni-category-347/svetry',
        image: headerImgs.obleceni.svetry,
      },
      {
        name: 'Košile',
        href: '/obleceni-category-347/kosile',
        image: headerImgs.obleceni.kosile,
      },
      {
        name: 'Trika a tílka',
        href: '/obleceni-category-347/trika-a-tilka',
        image: headerImgs.obleceni.trika,
      },
      {
        name: 'Kalhoty',
        href: '/obleceni-category-347/kalhoty',
        image: headerImgs.obleceni.kalhoty,
      },
      {
        name: 'Kraťasy',
        href: '/obleceni-category-347/kratasy',
        image: headerImgs.obleceni.kratasy,
      },
      {
        name: 'Plavky',
        href: '/obleceni-category-347/plavky',
        image: headerImgs.obleceni.plavky,
      },
      {
        name: 'Brýle',
        href: '/obleceni-category-347/bryle',
        image: headerImgs.obleceni.bryle,
      },
      {
        name: 'Šaty a Sukně',
        href: '/obleceni-category-347/saty-a-sukne',
        image: headerImgs.obleceni.saty,
      },
      {
        name: 'Doplňky',
        href: '/obleceni-category-347/doplnky',
        image: headerImgs.obleceni.doplnky,
      },
    ],
  },
  {
    name: 'Cyklo',
    href: '/cyklo-category-378',
    items: [
      {
        name: 'Kola',
        href: '/cyklo-category-378/kola',
        image: headerImgs.cyklo.kola,
      },
      {
        name: 'Elektrokola',
        href: '/cyklo-category-378/elektrokola',
        image: headerImgs.cyklo.elektrokola,
      },
      {
        name: 'Oblečení',
        href: '/cyklo-category-378/obleceni',
        image: headerImgs.cyklo.obleceni,
      },
      {
        name: 'Přilby',
        href: '/cyklo-category-378/prilby',
        image: headerImgs.cyklo.prilby,
      },
      {
        name: 'Chrániče',
        href: '/cyklo-category-378/chranice',
        image: headerImgs.cyklo.chranice,
      },
      {
        name: 'Sedla',
        href: '/cyklo-category-378/sedla',
        image: headerImgs.cyklo.sedla,
      },
      {
        name: 'Zapletená kola',
        href: '/cyklo-category-378/zapletena-kola',
        image: headerImgs.cyklo.zapletenaKola,
      },
      {
        name: 'Komponenty',
        href: '/cyklo-category-378/komponenty',
        image: headerImgs.cyklo.komponenty,
      },
      {
        name: 'Nářadí',
        href: '/cyklo-category-378/naradi',
        image: headerImgs.cyklo.naradi,
      },
      {
        name: 'Přeprava',
        href: '/cyklo-category-378/preprava',
        image: headerImgs.cyklo.preprava,
      },
      {
        name: 'Tašky',
        href: '/cyklo-category-378/tasky',
        image: headerImgs.cyklo.tasky,
      },
      {
        name: 'Výživa',
        href: '/cyklo-category-378/vyziva',
        image: headerImgs.cyklo.vyziva,
      },
      {
        name: 'Boty',
        href: '/cyklo-category-378/boty',
        image: headerImgs.cyklo.boty,
      },
      {
        name: 'Doplňky',
        href: '/cyklo-category-378/doplnky',
        image: headerImgs.cyklo.doplnky,
      },
    ],
  },
  {
    name: 'Moto',
    href: '/moto-category-424',
    items: [
      {
        name: 'Přilby',
        href: '/moto-category-424/prilby',
        image: headerImgs.moto.prilby,
      },
      {
        name: 'Boty',
        href: '/moto-category-424/boty',
        image: headerImgs.moto.boty,
      },
      {
        name: 'Oblečení',
        href: '/moto-category-424/obleceni',
        image: headerImgs.moto.obleceni,
      },
      {
        name: 'Chrániče',
        href: '/moto-category-424/chranice',
        image: headerImgs.moto.chranice,
      },
      {
        name: 'Brýle',
        href: '/moto-category-424/bryle',
        image: headerImgs.moto.bryle,
      },
      {
        name: 'Doplňky',
        href: '/moto-category-424/doplnky',
        image: headerImgs.moto.doplnky,
      },
    ],
  },
  {
    name: 'Snb-Skate',
    href: '/snb-skate-category-448',
    items: [
      {
        name: 'Skateboarding',
        href: '/snb-skate-category-448/skateboarding',
        image: headerImgs.snbSkate.skateboard,
      },
      {
        name: 'Snowboarding',
        href: '/snb-skate-category-448/snowboarding',
        image: headerImgs.snbSkate.snowboard,
      },
      {
        name: 'Brusle',
        href: '/snb-skate-category-448/brusle',
        image: headerImgs.snbSkate.brusle,
      },
    ],
  },
  {
    name: 'Ski',
    href: '/ski-category-466',
    items: [
      {
        name: 'Oblečení',
        href: '/ski-category-466/obleceni',
        image: headerImgs.ski.obleceni,
      },
      {
        name: 'Doplňky',
        href: '/ski-category-466/doplnky',
        image: headerImgs.ski.doplnky,
      },
    ],
  },
]
