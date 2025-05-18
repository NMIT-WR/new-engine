import * as tooltip from "@zag-js/tooltip";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tooltipVariants = tv({
  slots: {
    trigger: ["inline-flex py-0 px-0"],
    content: [
      "bg-tooltip-bg text-tooltip-text",
      "py-tooltip-y px-tooltip-x",
      "rounded-tooltip shadow-tooltip",
      "text-tooltip",
      "data-[zag-arrow]:bg-tooltip-bg",
    ],
    arrow: [],
    arrowTip: [],
    positioner: ["relative"],
  },
  variants: {
    size: {
      sm: {
        content: "text-tooltip-sm py-tooltip-y-sm px-tooltip-x-sm",
      },
      md: {
        content: "text-tooltip-md py-tooltip-y-md px-tooltip-x-md",
      },
      lg: {
        content: "text-tooltip-lg py-tooltip-y-lg px-tooltip-x-lg",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content">,
    VariantProps<typeof tooltipVariants> {
  ref?: React.RefObject<HTMLButtonElement>;
  content: ReactNode;
  children: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  /* Whether the tooltip is interactive. If `true`, 
  the tooltip will not close when the pointer is moved over it. */
  interactive?: boolean;
  placement?: tooltip.Placement;
  offset?: tooltip.PositioningOptions["offset"];
  gutter?: tooltip.PositioningOptions["gutter"];
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,

  size,
  openDelay = 200,
  closeDelay = 200,
  interactive = true,
  placement = "bottom",
  offset = { mainAxis: 8, crossAxis: 0 },
  gutter,
  defaultOpen,
  onOpenChange,
  id: MRAId,
  disabled,
  className,
  ref,
  ...rest
}: TooltipProps) {
  const generatedId = useId();
  const id = MRAId || generatedId;

  const service = useMachine(tooltip.machine as any, {
    id,
    openDelay,
    closeDelay,
    interactive,
    defaultOpen,
    onOpenChange: (details: tooltip.OpenChangeDetails) =>
      onOpenChange?.(details.open),
    disabled,
    positioning: {
      placement,
      offset,
      gutter,
    },
  });

  const api = tooltip.connect(service as tooltip.Service, normalizeProps);
  const styles = tooltipVariants({ size, className });

  return (
    <>
      <span {...api.getTriggerProps()} ref={ref}>
        {children}
      </span>
      {api.open && (
        <div {...api.getPositionerProps()} className={styles.positioner()}>
          <div
            {...api.getContentProps()}
            className={styles.content()}
            {...rest}
          >
            <div {...api.getArrowProps()}>
              <div {...api.getArrowTipProps()} className={styles.arrowTip()} />
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

Tooltip.displayName = "Tooltip";
