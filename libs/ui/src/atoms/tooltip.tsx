import * as tooltip from "@zag-js/tooltip";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { useId, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tooltipVariants = tv({
  slots: {
    trigger: ["inline-flex py-0 px-0"],
    content: [
      "[--arrow-size:var(--tooltip-arrow-size)]",
      "[--arrow-background:var(--tooltip-arrow-background)]",
      "bg-tooltip-bg",
      "rounded-tooltip shadow-tooltip",
    ],
    positioner: ["relative"],
  },
  variants: {
    size: {
      sm: {
        content: "text-tooltip-sm p-tooltip-sm",
      },
      md: {
        content: "text-tooltip-md p-tooltip-md",
      },
      lg: {
        content: "text-tooltip-lg p-tooltip-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface TooltipProps
  extends VariantProps<typeof tooltipVariants>,
    Partial<tooltip.Props>,
    Partial<tooltip.PositioningOptions> {
  /* Basic */
  ref?: React.RefObject<HTMLSpanElement>;
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({
  // Core and TV props
  content,
  children,
  className,
  ref,
  size,

  // Machine props
  id: MRAId,
  dir = "ltr",
  openDelay = 200,
  closeDelay = 200,
  interactive = true, // Hover over tooltip content
  defaultOpen,
  open,
  onOpenChange,
  disabled,
  closeOnEscape = true,
  closeOnPointerDown,
  closeOnScroll,
  closeOnClick,
  /* Position */
  placement, // (default: "bottom")
  offset = { mainAxis: 16, crossAxis: 0 },
  gutter, // Min space from screen edge
  flip, // Move to opposite side if not fit
  sameWidth, // Match trigger width
  boundary,
  listeners,
  strategy, // absolute | fixed
  ...rest
}: TooltipProps) {
  const generatedId = useId();
  const id = MRAId || generatedId;

  const service = useMachine(tooltip.machine as any, {
    // Identity & state
    id,
    dir,
    open,
    defaultOpen,
    disabled,
    // Timing & interaction
    openDelay,
    closeDelay,
    interactive,
    // Close triggers
    closeOnPointerDown,
    closeOnEscape,
    closeOnScroll,
    closeOnClick,
    // Events
    onOpenChange,

    positioning: {
      placement,
      offset,
      gutter,
      flip,
      sameWidth,
      boundary,
      listeners,
      strategy,
    },
  });

  const api = tooltip.connect(service as tooltip.Service, normalizeProps);
  const { positioner, content: contentSlot } = tooltipVariants({
    size,
    className,
  });

  return (
    <>
      <span {...api.getTriggerProps()} ref={ref}>
        {children}
      </span>
      <Portal>
        {api.open && (
          <div {...api.getPositionerProps()} className={positioner()}>
            <div {...api.getContentProps()} className={contentSlot()} {...rest}>
              <div {...api.getArrowProps()}>
                <div {...api.getArrowTipProps()} />
              </div>
              {content}
            </div>
          </div>
        )}
      </Portal>
    </>
  );
}

Tooltip.displayName = "Tooltip";
