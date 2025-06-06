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
    title: 'Contact Us',
    subtitle: 'Have a question or need assistance? We\'re here to help! Reach out to our friendly support team and we\'ll get back to you as soon as possible.'
  },
  form: {
    title: 'Send Us a Message',
    subjects: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'order', label: 'Order Support' },
      { value: 'shipping', label: 'Shipping Question' },
      { value: 'returns', label: 'Returns & Exchanges' },
      { value: 'wholesale', label: 'Wholesale Inquiry' },
      { value: 'other', label: 'Other' }
    ],
    labels: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number (Optional)',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send Message'
    },
    successMessage: {
      title: 'Message Sent!',
      description: 'We\'ll get back to you as soon as possible.'
    }
  },
  info: {
    title: 'Get in Touch',
    items: [
      {
        type: 'email',
        label: 'Email us at:',
        value: 'support@example.com',
        link: 'mailto:support@example.com',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      },
      {
        type: 'phone',
        label: 'Call us at:',
        value: '+1 (234) 567-890',
        link: 'tel:+1234567890',
        icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
      },
      {
        type: 'address',
        label: 'Visit our office:',
        value: '123 Fashion Street\nNew York, NY 10001\nUnited States',
        icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
      }
    ]
  },
  hours: {
    title: 'Business Hours',
    schedule: [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    timezone: 'All times are in Eastern Time (ET)'
  },
  help: {
    title: 'Quick Help',
    description: 'Looking for quick answers? Check out our',
    linkText: 'Frequently Asked Questions',
    linkHref: '/faq'
  }
}