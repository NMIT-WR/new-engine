import { Github } from '@medusajs/icons'
import { Button, Heading } from '@medusajs/ui'

const Hero = () => {
  return (
    <div className="relative h-[75vh] w-full border-ui-border-base border-b bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 text-center small:p-32">
        <span>
          <Heading
            level="h1"
            className="font-normal text-3xl text-ui-fg-base leading-10"
          >
            Ecommerce Starter Template
          </Heading>
          <Heading
            level="h2"
            className="font-normal text-3xl text-ui-fg-subtle leading-10"
          >
            Powered by Medusa and Next.js
          </Heading>
        </span>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="secondary">
            View on GitHub
            <Github />
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
