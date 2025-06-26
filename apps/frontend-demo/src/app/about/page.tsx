'use client'

import { aboutContent } from '@/data/about-content'

export default function AboutPage() {
  const { hero, story, stats, values, team } = aboutContent

  return (
    <>
      {/* Hero Section with Background Image */}
      <section
        className="relative flex h-about-hero-height items-center bg-center bg-cover md:h-about-hero-height-md"
        style={{
          backgroundImage: `url("${hero.backgroundImage}")`,
        }}
      >
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
              <img
                src={story.image}
                alt={story.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <div className="rounded-about-image-radius bg-about-stats-bg py-about-stats-padding">
            <div className="grid grid-cols-2 gap-about-stats-gap text-center md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="font-about-stat-number text-about-stat-number-fg text-about-stat-number-size">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-about-stat-label-fg text-about-stat-label-size">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                <svg
                  className="mx-auto mb-about-value-icon-bottom h-about-value-icon w-about-value-icon text-about-value-icon-fg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={value.icon}
                  />
                </svg>
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
          <div className="grid grid-cols-1 gap-about-team-gap sm:grid-cols-2 lg:grid-cols-4">
            {team.members.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-about-team-image-bottom overflow-hidden rounded-about-image-radius">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-about-team-image w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-about-team-name text-about-team-name-fg text-about-team-name-size">
                  {member.name}
                </h3>
                <p className="text-about-team-role-fg text-about-team-role-size">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
