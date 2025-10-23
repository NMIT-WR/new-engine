/**
 * Templates layer - Ready-to-use component compositions with props-based API.
 * These templates provide simplified interfaces for compound pattern components,
 * ideal for Storybook controls and rapid prototyping.
 *
 * @module @libs/ui/templates
 */

// Product Card Template
export {
  ProductCardTemplate,
  type ProductCardTemplateProps,
} from './product-card'

// Numeric Input Template
export {
  NumericInputTemplate,
  type NumericInputTemplateProps,
} from './numeric-input'

// Tabs Template
export { TabsTemplate, type TabsTemplateProps, type TabItem } from './tabs'

// Accordion Template
export {
  AccordionTemplate,
  type AccordionTemplateProps,
  type AccordionItem,
} from './accordion'

// Carousel Template
export { CarouselTemplate, type CarouselTemplateProps } from './carousel'
