'use client'

import { aboutContent } from '../../data/about-content'

export default function AboutPage() {
  const { hero, story, stats, values, team } = aboutContent

  return (
    <>
      {/* Hero Section with Background Image */}
      <section 
        className="relative h-about-hero-height md:h-about-hero-height-md bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url("${hero.backgroundImage}")`
        }}
      >
        <div className="absolute inset-0 bg-about-hero-overlay" />
        <div className="relative z-10 text-center text-white max-w-container-max mx-auto px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <h1 className="text-5xl md:text-7xl font-about-hero-title mb-about-hero-title-bottom">
            {hero.title}
          </h1>
          <p className="text-about-hero-subtitle-size max-w-about-hero-subtitle-max mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-about-story-gap items-center">
            <div className="space-y-about-grid-item-gap">
              <h2 className="text-about-grid-title-size font-about-grid-title text-about-grid-title-fg">
                {story.title}
              </h2>
              {story.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-about-grid-text-size text-about-grid-text-fg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="rounded-about-image-radius overflow-hidden">
              <img 
                src={story.image}
                alt={story.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-about-section-y">
        <div className="mx-auto max-w-container-max px-about-container-x md:px-about-container-x-md lg:px-about-container-x-lg">
          <div className="bg-about-stats-bg py-about-stats-padding rounded-about-image-radius">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-about-stats-gap text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-about-stat-number-size font-about-stat-number text-about-stat-number-fg">
                    {stat.value}
                  </div>
                  <div className="text-about-stat-label-size text-about-stat-label-fg mt-2">
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
          <h2 className="text-about-section-title-size font-about-section-title text-about-section-title-fg mb-about-section-title-bottom text-center">
            {values.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-about-values-gap">
            {values.items.map((value, index) => (
              <div key={index} className="bg-about-value-bg rounded-about-value p-about-value-padding border border-about-value-border hover:shadow-about-value-hover transition-shadow text-center">
                <svg
                  className="w-about-value-icon h-about-value-icon text-about-value-icon-fg mb-about-value-icon-bottom mx-auto"
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
                <h3 className="text-about-value-title-size font-about-value-title text-about-value-title-fg mb-about-value-title-bottom">
                  {value.title}
                </h3>
                <p className="text-about-value-text-size text-about-value-text-fg">
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
          <h2 className="text-about-section-title-size font-about-section-title text-about-section-title-fg mb-about-section-title-bottom text-center">
            {team.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-about-team-gap">
            {team.members.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden rounded-about-image-radius mb-about-team-image-bottom">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-about-team-image object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-about-team-name-size font-about-team-name text-about-team-name-fg">
                  {member.name}
                </h3>
                <p className="text-about-team-role-size text-about-team-role-fg">
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