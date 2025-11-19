import { Tabs } from '@new-engine/ui/molecules/tabs'

interface TabConfig {
  value: string
  label: string
  headline?: string
  content: React.ReactNode
}

interface ProductTabsProps {
  description?: string | null
  tabs?: TabConfig[]
}

export const ProductTabs = ({ description, tabs }: ProductTabsProps) => {
  return (
    <div>
      <Tabs className="px-0" variant="line" defaultValue={tabs?.[0]?.value}>
        <Tabs.List>
          {tabs?.map((item, index) => (
            <Tabs.Trigger key={index} value={`tab${index + 1}`}>
              {item.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        <p className="py-250">{description}</p>
        {tabs?.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="px-0">
            {tab.headline && (
              <h3 className="mb-200 font-bold text-lg">{tab.headline}</h3>
            )}
            {tab.content}
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  )
}
