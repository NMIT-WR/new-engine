import * as accordion from "@zag-js/accordion";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";

const accordionVariants = tv({
  slots: {
    root: [
      "flex flex-col w-full",
      "bg-accordion border-accordion-border rounded-accordion",
      "border-(length:--border-width-accordion)",
      "overflow-hidden",
      "transition-all duration-200",
    ],
    item: [
      "border-b-(length:--border-width-accordion) border-accordion-border",
    ],
    title: [
      "flex items-center justify-between w-full cursor-pointer px-accordion-title py-accordion-title",
      "rounded-none",
      "text-accordion-title-size font-accordion-title",
      "text-accordion-title-fg bg-accordion-title-bg",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accordion-ring focus-visible:ring-offset-0",
      "focus-visible:bg-accordion-hover",
      "data-[disabled]:text-accordion-fg-disabled",
      "hover:bg-accordion-title-hover",
      "data-[disabled=true]:cursor-not-allowed",
    ],
    subtitle: ["text-accordion-subtitle-size text-accordion-subtitle-fg"],
    content: [
      "p-accordion-content",
      "text-accordion-content text-accordion-content-fg bg-accordion-content-bg",
      "overflow-hidden",
    ],
    icon: ["data-[state=expanded]:rotate-180"],
  },
});

export type AccordionItem = {
  id: string;
  value: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export interface AccordionProps extends VariantProps<typeof accordionVariants> {
  id?: string;
  items: AccordionItem[];
  defaultValue?: string[];
  value?: string[];
  collapsible?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  onChange?: (value: string[]) => void;
}

export function Accordion({
  id,
  items = [],
  defaultValue,
  value,
  collapsible = true,
  multiple = false,
  dir = "ltr",
  onChange,
}: AccordionProps) {
  const generatedId = useId();
  const uniqueId = id || generatedId;

  const service = useMachine(accordion.machine, {
    id: uniqueId,
    value,
    defaultValue,
    collapsible,
    multiple,
    dir,
    orientation: "vertical",
    onValueChange: ({ value }) => {
      onChange?.(value);
    },
  });

  const api = accordion.connect(service, normalizeProps);

  const { root, item, title, content, icon, subtitle } = accordionVariants();

  return (
    <div className={root()} {...api.getRootProps()}>
      {items.map((accordionItem) => (
        <div
          {...api.getItemProps({
            value: accordionItem.value,
          })}
          key={accordionItem.id}
          className={item()}
        >
          <header>
            <Button
              theme="borderless"
              className={title()}
              {...api.getItemTriggerProps({
                value: accordionItem.value,
                disabled: accordionItem.disabled,
              })}
              data-disabled={accordionItem.disabled}
            >
              <div className="grid place-items-start">
                <h3>{accordionItem.title}</h3>
                {accordionItem.subtitle && (
                  <h4 className={subtitle()}>{accordionItem.subtitle}</h4>
                )}
              </div>
              <Icon
                className={icon()}
                icon="token-icon-accordion-chevron"
                data-state={
                  api.value.includes(accordionItem.value)
                    ? "expanded"
                    : "collapsed"
                }
              />
            </Button>
          </header>
          <div
            className={content()}
            {...api.getItemContentProps({
              value: accordionItem.value,
            })}
            data-state={
              api.value.includes(accordionItem.value) ? "expanded" : "collapsed"
            }
          >
            {accordionItem.content}
          </div>
        </div>
      ))}
    </div>
  );
}
