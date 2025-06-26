export interface ContactInfo {
  type: 'email' | 'phone' | 'address'
  label: string
  value: string
  link?: string
  icon: string // SVG path data
}

export interface BusinessHours {
  day: string
  hours: string
}

export interface ContactContent {
  hero: {
    title: string
    subtitle: string
  }
  form: {
    title: string
    subjects: Array<{ value: string; label: string }>
    labels: {
      firstName: string
      lastName: string
      email: string
      phone: string
      subject: string
      message: string
      submit: string
    }
    successMessage: {
      title: string
      description: string
    }
  }
  info: {
    title: string
    items: ContactInfo[]
  }
  hours: {
    title: string
    schedule: BusinessHours[]
    timezone: string
  }
  help: {
    title: string
    description: string
    linkText: string
    linkHref: string
  }
}

export const contactContent: ContactContent = {
  hero: {
    title: 'Kontaktujte nás',
    subtitle:
      'Máte otázku nebo potřebujete pomoc? Jsme tu pro vás! Obraťte se na náš přátelský tým podpory a ozvěme se vám co nejdříve.',
  },
  form: {
    title: 'Pošlete nám zprávu',
    subjects: [
      { value: 'general', label: 'Obecný dotaz' },
      { value: 'order', label: 'Podpora objednávek' },
      { value: 'shipping', label: 'Otázka o doručení' },
      { value: 'returns', label: 'Vracení a výměny' },
      { value: 'wholesale', label: 'Velkoobchodní dotaz' },
      { value: 'other', label: 'Jiné' },
    ],
    labels: {
      firstName: 'Jméno',
      lastName: 'Příjmení',
      email: 'E-mailová adresa',
      phone: 'Telefonní číslo (nepovinné)',
      subject: 'Předmět',
      message: 'Zpráva',
      submit: 'Odeslat zprávu',
    },
    successMessage: {
      title: 'Zpráva odeslána!',
      description: 'Ozvěme se vám co nejdříve.',
    },
  },
  info: {
    title: 'Spojte se s námi',
    items: [
      {
        type: 'email',
        label: 'Napište nám na:',
        value: 'support@example.com',
        link: 'mailto:support@example.com',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      },
      {
        type: 'phone',
        label: 'Zavolejte nám na:',
        value: '+1 (234) 567-890',
        link: 'tel:+1234567890',
        icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      },
      {
        type: 'address',
        label: 'Navštivte naši kancelář:',
        value: '123 Fashion Street\nNew York, NY 10001\nUnited States',
        icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      },
    ],
  },
  hours: {
    title: 'Provozní doba',
    schedule: [
      { day: 'Pondělí - Pátek', hours: '9:00 - 18:00' },
      { day: 'Sobota', hours: '10:00 - 16:00' },
      { day: 'Neděle', hours: 'Zavřeno' },
    ],
    timezone: 'Všechny časy jsou ve východním čase (ET)',
  },
  help: {
    title: 'Rychlá pomoc',
    description: 'Hledáte rychlé odpovědi? Podívejte se na naše',
    linkText: 'Často kladené otázky',
    linkHref: '/faq',
  },
}
