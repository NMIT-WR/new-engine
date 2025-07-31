import type { IconType } from '@ui/atoms/icon'

export interface TeamMember {
  name: string
  role: string
  image: string
}

export interface CompanyValue {
  title: string
  description: string
  icon: IconType // SVG path data
}

export interface CompanyStat {
  value: string
  label: string
}

export interface AboutContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  story: {
    title: string
    paragraphs: string[]
    image: string
    imageAlt: string
  }
  stats: CompanyStat[]
  values: {
    title: string
    items: CompanyValue[]
  }
  team: {
    title: string
    members: TeamMember[]
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export const aboutContent: AboutContent = {
  hero: {
    title: 'Náš příběh',
    subtitle: 'Vytváříme nadčasovou módu s účelem a vášní od roku 2020',
    backgroundImage:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=800&fit=crop',
  },
  story: {
    title: 'Od vize ke skutečnosti',
    paragraphs: [
      'Co začalo jako sen o revoluci v udržitelné módě, vyrostlo v hnutí. Založeni v roce 2020, začali jsme s jednoduchou vírou: že styl a udržitelnost by měly jít ruku v ruce.',
      'Každý kousek v naší kolekci vypráví příběh - od pečlivě vybraných ekologicky šetrných materiálů po zkušené řemeslníky, kteří každý design přivádějí k životu. Nevytváříme jen oblečení; budujeme komunitu uvědomělých spotřebitelů, kteří věří v sílu promyšlené módy.',
      'Naše cesta byla poznamenána inovacemi, spoluprací a neochvějným závazkem k našim hodnotám. Dnes jsme hrdí, že sloužíme tisícům zákazníků po celém světě, kteří sdílejí naši vizi udržitelnější a stylovější budoucnosti.',
    ],
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Naše dílna',
  },
  stats: [
    { value: '50K+', label: 'Spokojených zákazníků' },
    { value: '100%', label: 'Udržitelné materiály' },
    { value: '25+', label: 'Partnerských řemeslníků' },
    { value: '4.9★', label: 'Hodnocení zákazníků' },
  ],
  values: {
    title: 'Za čím si stojíme',
    items: [
      {
        title: 'Udržitelnost',
        description: 'Každé rozhodnutí děláme s ohledem na planetu',
        icon: 'token-icon-earth',
      },
      {
        title: 'Nekompromisní kvalita',
        description:
          'Pečlivě vybíráme materiály pro maximální životnost produktů',
        icon: 'token-icon-check-circle',
      },
      {
        title: 'Spravedlivý obchod',
        description: 'Transparentní dodavatelský řetězec od vlákna po výrobek',
        icon: 'token-icon-present',
      },
      {
        title: 'Inovace',
        description: 'Experimentujeme s materiály šetrnými k přírodě i lidem',
        icon: 'token-icon-light',
      },
      {
        title: 'Komunita',
        description:
          'Vybudovali jsme komunitu lidí se zápalem, která sdílí své nápady',
        icon: 'token-icon-group',
      },
      {
        title: 'Globální dopad',
        description: 'Z českého ateliéru jsme přerostli do zahraničních trhů',
        icon: 'token-icon-global',
      },
    ],
  },
  team: {
    title: 'Poznejte náš tým',
    members: [
      {
        name: 'Sára Johnsonová',
        role: 'Zakladatelka a kreativní ředitelka',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
      {
        name: 'Michael Chen',
        role: 'Vedoucí udržitelnosti',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
      {
        name: 'Emily Rodriguezová',
        role: 'Vedoucí designu',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      },
      {
        name: 'David Kim',
        role: 'Provozní ředitel',
        image:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
      },
    ],
  },
  cta: {
    title: 'Připojte se k naší cestě',
    description:
      'Jsme víc než značka - jsme hnutí směrem k uvědomělé módě. Každý váš nákup podporuje naši misi vytvořit udržitelnější a stylovější svět.',
    buttonText: 'Nakupovat naši kolekci',
    buttonLink: '/products',
  },
}
