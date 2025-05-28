'use client'
import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Input } from 'ui/src/atoms/input'
import { Accordion } from 'ui/src/molecules/accordion'
import { Dialog } from 'ui/src/molecules/dialog'

export default function Home() {
  return (
    <main className="random min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-bold text-4xl">Frontend Demo</h1>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-red-600">
            UI Components Showcase
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 font-medium text-lg">Buttons</h3>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  size="md"
                  theme="solid"
                  className="bg-btn-secondary"
                >
                  Primary Button
                </Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-lg">Badges</h3>
              <div className="flex gap-4">
                <Badge variant="primary">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-lg">Input</h3>
              <Input placeholder="Enter some text..." className="max-w-md" />
            </div>

            <div>
              <h3 className="mb-2 font-medium text-lg">Accordion</h3>
              <Accordion
                items={[
                  {
                    id: 'item-1',
                    value: 'item-1',
                    title: 'What is this demo?',
                    content:
                      'This is a demo application showcasing the UI library components.',
                  },
                  {
                    id: 'item-2',
                    value: 'item-2',
                    title: 'How to use components?',
                    content:
                      'Import components from ui/src and use them in your React components.',
                  },
                ]}
              />
            </div>

            <div>
              <h3 className="mb-2 font-medium text-lg">Dialog</h3>
              <Dialog
                title="Sample Dialog"
                description="This is a sample dialog component from the UI library."
              >
                <p>Dialog content goes here.</p>
              </Dialog>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
