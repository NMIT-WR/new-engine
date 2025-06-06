'use client'
import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Input } from 'ui/src/atoms/input'
import { Textarea } from 'ui/src/atoms/textarea'
import { Select } from 'ui/src/molecules/select'
import { useToast } from 'ui/src/molecules/toast'
import { contactContent } from '../../data/contact-content'

export default function ContactPage() {
  const { hero, form, info, hours, help } = contactContent
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    console.log('Contact form submitted:', formData)
    toast.create({
      title: form.successMessage.title,
      description: form.successMessage.description,
      duration: 5000,
    })
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-contact-hero-bg py-contact-hero-y">
        <div className="mx-auto max-w-container-max px-container-x">
          <div className="text-center">
            <h1 className="text-contact-hero-title-size font-contact-hero-title text-contact-hero-fg mb-contact-hero-title-bottom">
              {hero.title}
            </h1>
            <p className="text-contact-hero-subtitle-size text-contact-hero-subtitle-fg max-w-contact-hero-subtitle-max mx-auto">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-contact-content-y">
        <div className="mx-auto max-w-container-max px-container-x">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-contact-grid-gap">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-contact-form-bg rounded-contact-form p-contact-form-padding shadow-contact-form">
                <h2 className="text-contact-form-title-size font-contact-form-title text-contact-form-title-fg mb-contact-form-title-bottom">
                  {form.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-contact-form-gap">
                  <div className="space-y-contact-field-gap">
                    <label htmlFor="firstName" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.firstName}
                    </label>
                    <Input
                      id="firstName"
                      size='sm'
                      value={formData.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-contact-field-gap">
                    <label htmlFor="lastName" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.lastName}
                    </label>
                    <Input
                      id="lastName"
                        size='sm'
                      value={formData.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-contact-field-gap">
                    <label htmlFor="email" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.email}
                    </label>
                    <Input
                      id="email"
                      type="email"
                        size='sm'
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-contact-field-gap">
                    <label htmlFor="phone" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.phone}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                        size='sm'
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 space-y-contact-field-gap">
                    <label htmlFor="subject" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.subject}
                    </label>
                    <Select
                      options={form.subjects}
                      value={[formData.subject]}
                      onValueChange={(details) =>
                        setFormData({
                          ...formData,
                          subject: details.value[0] || 'general',
                        })
                      }
                      placeholder="Select a subject"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-contact-field-gap">
                    <label htmlFor="message" className="text-contact-label-size font-contact-label text-contact-label-fg">
                      {form.labels.message}
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-6 w-full">
                  {form.labels.submit}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-contact-side-gap">
              {/* Contact Info Card */}
              <div className="bg-contact-info-bg rounded-contact-info p-contact-info-padding border border-contact-info-border">
                <h3 className="text-contact-info-title-size font-contact-info-title text-contact-info-title-fg mb-contact-info-title-bottom">
                  {info.title}
                </h3>
                {info.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-contact-info-icon-gap mb-contact-info-item-gap">
                    <svg
                      className="w-contact-info-icon h-contact-info-icon text-contact-info-icon-fg flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    <div>
                      <p className="text-contact-info-text-size text-contact-info-text-fg">
                        {item.label}
                      </p>
                      {item.link ? (
                        <a href={item.link} className="text-contact-info-link-fg hover:text-contact-info-link-fg-hover transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-contact-info-text-size text-contact-info-text-fg whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-contact-info-bg rounded-contact-info p-contact-info-padding border border-contact-info-border">
                <h3 className="text-contact-hours-title-size font-contact-hours-title text-contact-hours-title-fg mb-contact-hours-title-bottom">
                  {hours.title}
                </h3>
                <div className="space-y-contact-hours-gap">
                  {hours.schedule.map((item, index) => (
                    <div key={index} className="flex justify-between text-contact-hours-size">
                      <span className="text-contact-hours-day-fg">{item.day}</span>
                      <span className="text-contact-hours-time-fg">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-contact-info-text-size text-contact-info-text-fg mt-4">
                  {hours.timezone}
                </p>
              </div>

              {/* FAQ Link */}
              <div className="bg-contact-info-bg rounded-contact-info p-contact-info-padding border border-contact-info-border">
                <h3 className="text-contact-info-title-size font-contact-info-title text-contact-info-title-fg mb-contact-info-title-bottom">
                  {help.title}
                </h3>
                <p className="text-contact-info-text-size text-contact-info-text-fg">
                  {help.description}{' '}
                  <a href={help.linkHref} className="text-contact-info-link-fg hover:text-contact-info-link-fg-hover transition-colors">
                    {help.linkText}
                  </a>{' '}
                  page for instant help with common queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}