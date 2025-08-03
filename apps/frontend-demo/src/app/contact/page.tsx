'use client'
import { contactContent } from '@/data/contact-content'
import { useContactForm } from '@/hooks/use-contact-form'
import { Button } from '@ui/atoms/button'
import { Icon, type IconType } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'
import { FormInput } from '@ui/molecules/form-input'
import { FormTextarea } from '@ui/molecules/form-textarea'
import { Select } from '@ui/molecules/select'
import Image from 'next/image'
import contactImage from '/assets/hero/contact.webp'

export default function ContactPage() {
  const { hero, form, info, hours, help } = contactContent
  const { formData, updateField, handleSubmit, isSubmitting } = useContactForm()

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex h-about-hero-height items-center bg-center bg-cover md:h-about-hero-height-md">
        <Image
          src={contactImage}
          alt="Naše kancelář"
          className="-z-1 brightness-75"
          fill
          objectFit="cover"
          priority={true}
          placeholder="blur"
        />
        <div className="inset-0 mx-auto max-w-container-max px-container-x text-white">
          <div className="text-center">
            <h1 className="mb-contact-hero-title-bottom font-contact-hero-title text-contact-hero-title-size text-white">
              {hero.title}
            </h1>
            <p className="mx-auto max-w-contact-hero-subtitle-max text-contact-hero-subtitle-size text-white">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section id="contact-form" className="py-contact-content-y">
        <div className="mx-auto max-w-container-max px-container-x">
          <div className="grid grid-cols-1 gap-contact-grid-gap lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="grid rounded-contact-form bg-fill-base/20 p-contact-form-padding shadow-contact-form"
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
                      updateField('firstName', e.target.value)
                    }
                    required
                  />
                  <FormInput
                    id="lastName"
                    label={form.labels.lastName}
                    size="sm"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateField('lastName', e.target.value)
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
                      updateField('email', e.target.value)
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
                      updateField('phone', e.target.value)
                    }
                    required
                  />
                  <div className="space-y-contact-field-gap md:col-span-2">
                    <Select
                      label={form.labels.subject}
                      options={form.subjects}
                      value={[formData.subject]}
                      onValueChange={(details) =>
                        updateField('subject', details.value[0] || 'general')
                      }
                      size="sm"
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
                        updateField('message', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-6 place-self-end"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Odesílám...' : form.labels.submit}
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
                    <Icon
                      icon={item.icon as IconType}
                      className="h-6 text-md"
                    />
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

              {/* FAQ Link */}
              <div className="rounded-contact-info border border-contact-info-border bg-contact-info-bg p-contact-info-padding">
                <h3 className="mb-contact-info-title-bottom font-contact-info-title text-contact-info-title-fg text-contact-info-title-size">
                  {help.title}
                </h3>
                <p className="text-contact-info-text-fg text-contact-info-text-size">
                  Hledáte rychlé odpovědi? Podívejte se na naše často kladené
                  otázky pro okamžitou pomoc.
                </p>
                <LinkButton
                  href="/faq"
                  size="sm"
                  theme="borderless"
                  className="px-0 py-0 hover:bg-transparent"
                >
                  <span className="underline">Často kladené dotazy</span>
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
