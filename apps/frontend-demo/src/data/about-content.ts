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
    title: 'Our Story',
    subtitle: 'Crafting timeless fashion with purpose and passion since 2020',
    backgroundImage:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=800&fit=crop',
  },
  story: {
    title: 'From Vision to Reality',
    paragraphs: [
      'What started as a dream to revolutionize sustainable fashion has grown into a movement. Founded in 2020, we began with a simple belief: that style and sustainability should go hand in hand.',
      "Every piece in our collection tells a story - from the carefully selected eco-friendly materials to the skilled artisans who bring each design to life. We're not just creating clothes; we're building a community of conscious consumers who believe in the power of thoughtful fashion.",
      "Our journey has been marked by innovation, collaboration, and an unwavering commitment to our values. Today, we're proud to serve thousands of customers worldwide who share our vision for a more sustainable and stylish future.",
    ],
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop',
    imageAlt: 'Our workshop',
  },
  stats: [
    { value: '50K+', label: 'Happy Customers' },
    { value: '100%', label: 'Sustainable Materials' },
    { value: '25+', label: 'Partner Artisans' },
    { value: '4.9★', label: 'Customer Rating' },
  ],
  values: {
    title: 'What We Stand For',
    items: [
      {
        title: 'Sustainability First',
        description:
          'Every decision we make considers its environmental impact. From materials to packaging, sustainability guides our way.',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        title: 'Uncompromising Quality',
        description:
          'We believe in creating pieces that last. Each item is crafted with attention to detail and built to withstand the test of time.',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        title: 'Fair Trade',
        description:
          'We ensure fair wages and safe working conditions for all our partners, fostering long-term relationships built on respect.',
        icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      },
      {
        title: 'Innovation',
        description:
          'We continuously explore new materials and techniques to push the boundaries of sustainable fashion.',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        title: 'Community',
        description:
          "Fashion is better together. We've built a community that shares ideas, values, and a love for conscious living.",
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      },
      {
        title: 'Global Impact',
        description:
          "Our vision extends beyond fashion. We're committed to making a positive impact on communities worldwide.",
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      },
    ],
  },
  team: {
    title: 'Meet Our Team',
    members: [
      {
        name: 'Sarah Johnson',
        role: 'Founder & Creative Director',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
      {
        name: 'Michael Chen',
        role: 'Head of Sustainability',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
      {
        name: 'Emily Rodriguez',
        role: 'Design Lead',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      },
      {
        name: 'David Kim',
        role: 'Operations Director',
        image:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
      },
    ],
  },
  cta: {
    title: 'Join Our Journey',
    description:
      "We're more than a brand - we're a movement towards conscious fashion. Every purchase you make supports our mission to create a more sustainable and stylish world.",
    buttonText: 'Shop Our Collection',
    buttonLink: '/products',
  },
}
