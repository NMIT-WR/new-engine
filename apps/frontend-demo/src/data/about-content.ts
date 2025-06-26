export interface TeamMember {
  name: string
  role: string
  image: string
}

export interface CompanyValue {
  title: string
  description: string
  icon: string // SVG path data
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
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop',
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
        title: 'Udržitelnost na prvním místě',
        description:
          'Každé rozhodnutí, které děláme, zvažuje jeho dopad na životní prostředí. Od materiálů po balení, udržitelnost nás vede cestou.',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        title: 'Nekompromisní kvalita',
        description:
          'Věříme ve vytváření kousků, které vydrží. Každý kus je vytvořen s důrazem na detail a postaven tak, aby obstál ve zkoušce času.',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        title: 'Spravedlivý obchod',
        description:
          'Zajišťujeme spravedlivé mzdy a bezpečné pracovní podmínky pro všechny naše partnery, podporujeme dlouhodobé vztahy založené na respektu.',
        icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      },
      {
        title: 'Inovace',
        description:
          'Neustále zkoumáme nové materiály a techniky, abychom posunuli hranice udržitelné módy.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        title: 'Komunita',
        description:
          'Móda je lepší společně. Vybudovali jsme komunitu, která sdílí nápady, hodnoty a lásku k uvědomělému životu.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      },
      {
        title: 'Globální dopad',
        description:
          'Naše vize přesahuje módu. Jsme odhodláni mít pozitivní dopad na komunity po celém světě.',
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
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
