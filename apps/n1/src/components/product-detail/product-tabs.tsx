import { Tabs } from '@new-engine/ui/atoms/tabs'

export const ProductTabs = () => {
  const baseItems = [
    {
      value: 'tab1',
      label: 'Tab One',
      content: (
        <div>
          <h3 className="mb-2 font-semibold text-lg">Tab One Content</h3>
          <p>
            This is the content for the first tab. It can contain any React
            elements.
          </p>
        </div>
      ),
    },
    {
      value: 'tab2',
      label: 'Tab Two',
      content: (
        <div>
          <h3 className="mb-2 font-semibold text-lg">Tab Two Content</h3>
          <p>
            Second tab content goes here. You can put forms, images, or any
            components.
          </p>
        </div>
      ),
    },
    {
      value: 'tab3',
      label: 'Tab Three',
      content: (
        <div>
          <h3 className="mb-2 font-semibold text-lg">Tab Three Content</h3>
          <p>The third tab can have completely different content structure.</p>
        </div>
      ),
    },
  ]
  return (
    <div>
      <Tabs items={baseItems} variant="default" />
    </div>
  )
}
