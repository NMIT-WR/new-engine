import { Tabs } from '@new-engine/ui/molecules/tabs'

interface ProductTabsProps {
  description?: string | null
  content?: React.ReactNode[]
}
export const ProductTabs = ({ description, content }: ProductTabsProps) => {
  return (
    <div>
      <Tabs variant="line">
        <Tabs.List>
          <Tabs.Trigger value="tab1">PRODUKTOVÉ PARAMETRY</Tabs.Trigger>
          <Tabs.Trigger value="tab2">TABULKA VELIKOSTÍ</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <p>{description}</p>
        {content?.map((item, index) => (
          <Tabs.Content key={index} value={`tab${index + 1}`}>
            {item}
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  )
}
