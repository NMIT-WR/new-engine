import type { IconType } from '../atoms/icon'
import { Accordion, type AccordionProps } from '../molecules/accordion'

export interface AccordionItem {
  value: string
  title: string
  content: React.ReactNode
  disabled?: boolean
}

export interface AccordionTemplateProps
  extends Omit<AccordionProps, 'children'> {
  items: AccordionItem[]
  showIndicator?: boolean
  indicatorIcon?: IconType
}

export function AccordionTemplate({
  items,
  showIndicator = true,
  indicatorIcon = 'token-icon-accordion-chevron',
  variant = 'default',
  size = 'md',
  shadow = 'none',
  collapsible = true,
  multiple = false,
  defaultValue,
  value,
  onChange,
  ref,
  className,
  ...accordionProps
}: AccordionTemplateProps) {
  return (
    <Accordion
      ref={ref}
      variant={variant}
      size={size}
      shadow={shadow}
      collapsible={collapsible}
      multiple={multiple}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className={className}
      {...accordionProps}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          <Accordion.Header>
            {item.title}
            {showIndicator && <Accordion.Indicator icon={indicatorIcon} />}
          </Accordion.Header>
          <Accordion.Content>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
