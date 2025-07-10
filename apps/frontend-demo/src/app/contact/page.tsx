'use client'
import { contactContent } from '@/data/contact-content'
import { Button } from '@ui/atoms/button'
import { FormInput } from '@ui/molecules/form-input'
import { FormTextarea } from '@ui/molecules/form-textarea'
import { Select } from '@ui/molecules/select'
import { useToast } from '@ui/molecules/toast'
import { useState } from 'react'

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
            <h1 className="mb-contact-hero-title-bottom font-contact-hero-title text-contact-hero-fg text-contact-hero-title-size">
              {hero.title}
            </h1>
            <p className="mx-auto max-w-contact-hero-subtitle-max text-contact-hero-subtitle-fg text-contact-hero-subtitle-size">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-contact-content-y">
        <div className="mx-auto max-w-container-max px-container-x">
          <div className="grid grid-cols-1 gap-contact-grid-gap lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="rounded-contact-form bg-contact-form-bg p-contact-form-padding shadow-contact-form"
              >
                <h2 className="mb-contact-form-title-bottom font-contact-form-title text-contact-form-title-fg text-contact-form-title-size">
                  {form.title}
                </h2>
                <div className="grid grid-cols-1 gap-contact-form-gap md:grid-cols-2">
                  <FormInput
                    id="firstName"
                    label={form.labels.firstName}
                    size="sm"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                  <FormInput
                    id="lastName"
                    label={form.labels.lastName}
                    size="sm"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                  <FormInput
                    id="email"
                    label={form.labels.email}
                    type="email"
                    size="sm"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <FormInput
                    id="phone"
                    label={form.labels.phone}
                    type="tel"
                    size="sm"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <div className="space-y-contact-field-gap md:col-span-2">
                    <label
                      htmlFor="subject"
                      className="font-contact-label text-contact-label-fg text-contact-label-size"
                    >
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
                      placeholder="Vyberte téma"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FormTextarea
                      id="message"
                      label={form.labels.message}
                      rows={6}
                      size="sm"
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
              <div className="rounded-contact-info border border-contact-info-border bg-contact-info-bg p-contact-info-padding">
                <h3 className="mb-contact-info-title-bottom font-contact-info-title text-contact-info-title-fg text-contact-info-title-size">
                  {info.title}
                </h3>
                {info.items.map((item, index) => (
                  <div
                    key={index}
                    className="mb-contact-info-item-gap flex items-start space-x-contact-info-icon-gap"
                  >
                    <svg
                      className="mt-1 h-contact-info-icon w-contact-info-icon flex-shrink-0 text-contact-info-icon-fg"
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
                      <p className="text-contact-info-text-fg text-contact-info-text-size">
                        {item.label}
                      </p>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-contact-info-link-fg transition-colors hover:text-contact-info-link-fg-hover"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="whitespace-pre-line text-contact-info-text-fg text-contact-info-text-size">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="rounded-contact-info border border-contact-info-border bg-contact-info-bg p-contact-info-padding">
                <h3 className="mb-contact-hours-title-bottom font-contact-hours-title text-contact-hours-title-fg text-contact-hours-title-size">
                  {hours.title}
                </h3>
                <div className="space-y-contact-hours-gap">
                  {hours.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-contact-hours-size"
                    >
                      <span className="text-contact-hours-day-fg">
                        {item.day}
                      </span>
                      <span className="text-contact-hours-time-fg">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-contact-info-text-fg text-contact-info-text-size">
                  {hours.timezone}
                </p>
              </div>

              {/* FAQ Link */}
              <div className="rounded-contact-info border border-contact-info-border bg-contact-info-bg p-contact-info-padding">
                <h3 className="mb-contact-info-title-bottom font-contact-info-title text-contact-info-title-fg text-contact-info-title-size">
                  {help.title}
                </h3>
                <p className="text-contact-info-text-fg text-contact-info-text-size">
                  {help.description}{' '}
                  <a
                    href={help.linkHref}
                    className="text-contact-info-link-fg transition-colors hover:text-contact-info-link-fg-hover"
                  >
                    {help.linkText}
                  </a>{' '}
                  pro okamžitou pomoc s častými dotazy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
