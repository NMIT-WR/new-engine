import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { useId, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "../atoms/button"; // If using a Button component for the close trigger

const dialogVariants = tv({
  slots: {
    backdrop: ["fixed inset-0 z-40 bg-dialog-backdrop-bg"],
    positioner: ["fixed inset-0 z-50 flex items-center justify-center p-4"],
    content: [
      "relative flex flex-col p-dialog-content-padding", // Padding directly on content
      "bg-dialog-content-bg text-dialog-content-fg",
      "border-(length:--border-width-dialog-content) border-dialog-content-border",
      "rounded-dialog-content shadow-dialog-content",
      "max-h-dialog-content overflow-y-auto",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dialog-ring focus-visible:ring-offset-2",
    ],
    title: [
      // Slot for the title text
      "text-dialog-title-size font-weight-dialog-title text-dialog-title-fg line-height-dialog-title",
      "mb-dialog-description-margin-top", // Margin below title, before description or content
    ],
    description: [
      // Slot for the description text
      "text-dialog-description-size text-dialog-description-fg line-height-dialog-description",
      "mb-dialog-body-padding-y", // Margin below description, before main children or footer actions
    ],
    // Body slot is removed, children will be direct descendants of content or wrapped in a div if needed
    // Footer slot is removed, action buttons will be direct descendants of content or wrapped
    closeTrigger: [
      // For the 'X' close button
      "absolute top-dialog-close-trigger-top right-dialog-close-trigger-right",
      "flex items-center justify-center",
      "p-dialog-close-trigger-padding rounded-dialog-close-trigger",
      "text-dialog-close-trigger-fg hover:text-dialog-close-trigger-fg-hover",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dialog-ring",
    ],
  },
});

export interface DialogProps extends VariantProps<typeof dialogVariants> {
  open?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  initialFocusEl?: () => HTMLElement | null;
  finalFocusEl?: () => HTMLElement | null;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  preventScroll?: boolean;
  trapFocus?: boolean;
  modal?: boolean;

  id?: string;
  trigger?: ReactNode;
  triggerText?: string;
  title?: ReactNode;
  description?: ReactNode; // Optional description separate from body
  children?: ReactNode; // Main content of the dialog
  actions?: ReactNode;
  hideCloseButton?: boolean;
  className?: string; // For the content element
}

export function Dialog({
  id,
  open,
  onOpenChange,
  initialFocusEl,
  finalFocusEl,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  preventScroll = true,
  trapFocus = true,
  modal = true,
  trigger,
  triggerText = "Open",
  title,
  description,
  children,
  hideCloseButton = false,
  className,
  actions,
}: DialogProps) {
  const generatedId = useId();
  const uniqueId = id || generatedId;

  // Use type assertions to work around the type issues
  const service = useMachine(dialog.machine as any, {
    id: uniqueId,
    open: open ?? false,
    onOpenChange,
    modal,
    closeOnEscape,
    closeOnInteractOutside,
    preventScroll,
    trapFocus,
    initialFocusEl,
    finalFocusEl,
  }) as dialog.Service;

  const api = dialog.connect(service, normalizeProps);

  const {
    backdrop,
    positioner,
    content,
    title: titleSlot,
    description: descriptionSlot,
    closeTrigger,
  } = dialogVariants();

  return (
    <>
      {trigger ? (
        trigger
      ) : (
        <Button variant="primary" {...api.getTriggerProps()}>
          {triggerText}
        </Button>
      )}
      {api.open && (
        <Portal>
          <div className={backdrop()} {...api.getBackdropProps()} />
          <div className={positioner()} {...api.getPositionerProps()}>
            <div className={content()} {...api.getContentProps()}>
              {!hideCloseButton && (
                <Button
                  theme="borderless"
                  className={closeTrigger()}
                  {...api.getCloseTriggerProps()}
                  icon="token-icon-dialog-close"
                />
              )}
              {title && (
                <h2 className={titleSlot()} {...api.getTitleProps()}>
                  {title}
                </h2>
              )}
              {description && (
                <div
                  className={descriptionSlot()}
                  {...api.getDescriptionProps()}
                >
                  {description}
                </div>
              )}
              <div className="flex-grow overflow-y-auto">{children}</div>

              {actions && (
                <div className="mt-auto pt-4 flex justify-end gap-2 shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
