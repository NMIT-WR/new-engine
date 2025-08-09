'use client'
import { StatsSection } from '@/components/stats-section'
import { aboutContent } from '@/data/about-content'
import { Icon } from '@new-engine/ui/atoms/icon'
import Image from 'next/image'
import aboutImage from '/assets/hero/about.webp'

export default function AboutPage() {
  const { hero, story, stats, values, team } = aboutContent

  return (
    <>
      {/* Hero Section with Background Image */}
      <section className="relative flex h-about-hero-height items-center bg-center bg-cover md:h-about-hero-height-md">
        <Image src={aboutImage} alt="some" fill priority placeholder="blur" />

        <div className="absolute inset-0 bg-about-hero-overlay" />
        <div className="relative mx-auto max-w-container-max px-about-container-x text-center text-white md:px-about-container-x-md lg:px-about-container-x-lg">
          <h1 className="mb-about-hero-title-bottom font-about-hero-title text-5xl md:text-7xl">
            {hero.title}
          </h1>
          <p className="mx-auto max-w-about-hero-subtitle-max text-about-hero-subtitle-size opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <div className="grid grid-cols-1 items-center gap-about-story-gap lg:grid-cols-2">
            <div className="space-y-about-grid-item-gap">
              <h2 className="font-about-grid-title text-about-grid-title-fg text-about-grid-title-size">
                {story.title}
              </h2>
              {story.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-about-grid-text-fg text-about-grid-text-size leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="overflow-hidden rounded-about-image-radius">
              <Image
                src={story.image}
                alt={story.imageAlt}
                width={800}
                height={600}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Values Section */}
      <section className="bg-about-values-section-bg py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <h2 className="mb-about-section-title-bottom text-center font-about-section-title text-about-section-title-fg text-about-section-title-size">
            {values.title}
          </h2>
          <div className="grid grid-cols-1 gap-about-values-gap sm:grid-cols-2 lg:grid-cols-3">
            {values.items.map((value, index) => (
              <div
                key={index}
                className="rounded-about-value border border-about-value-border bg-about-value-bg p-about-value-padding text-center transition-shadow hover:shadow-about-value-hover"
              >
                <Icon icon={value.icon} className="text-3xl text-info" />
                <h3 className="mb-about-value-title-bottom font-about-value-title text-about-value-title-fg text-about-value-title-size">
                  {value.title}
                </h3>
                <p className="text-about-value-text-fg text-about-value-text-size">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <h2 className="mb-about-section-title-bottom text-center font-about-section-title text-about-section-title-fg text-about-section-title-size">
            {team.title}
          </h2>
          <div className="place-self-center-safe grid grid-cols-1 gap-about-team-gap sm:grid-cols-2">
            {team.members.map((member, index) => (
              <div
                key={index}
                className="group flex w-fit flex-col gap-200 text-center"
              >
                <div className="relative overflow-hidden rounded-sm shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full"
                  />
                </div>
                <article>
                  <h3 className="font-about-team-name text-about-team-name-fg text-about-team-name-size">
                    {member.name}
                  </h3>
                  <p className="text-about-team-role-fg text-about-team-role-size">
                    {member.role}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
