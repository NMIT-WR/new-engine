import * as toast from "@zag-js/toast";
import { Portal, normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";
//import { Icon } from "../atoms/icon";

// Toast Item Variants
const toastVariants = tv({
  slots: {
    root: [
      "relative rounded-toast-root border-(length:--border-width-toast) bg-pink-900 shadow-lg",
      "w-toast-width overflow-hidden p-toast-root",
      "data-[type=error]:bg-toast-error-bg data-[type=error]:border-toast-error-border",
      "data-[type=success]:bg-toast-success-bg data-[type=success]:border-toast-success-border",
      "data-[type=info]:bg-toast-info-bg data-[type=info]:border-toast-info-border",
      "data-[type=warning]:bg-toast-warning-bg data-[type=warning]:border-toast-warning-border",
      "data-[state=open]:animate-toast-slide-in",
      "data-[state=closed]:animate-toast-slide-out",
    ],
    progressbar: [
      "absolute left-0 bottom-0 h-toast-progress w-full",
      "origin-left transition-transform duration-100",
      "data-[type=error]:bg-toast-error-progress",
      "data-[type=success]:bg-toast-success-progress",
      "data-[type=info]:bg-toast-info-progress",
      "data-[type=warning]:bg-toast-warning-progress",
    ],
    header: "flex relative items-center gap-toast-content ",
    icon: [
      "flex-shrink-0 text-toast-icon-size",
      "data-[type=error]:text-toast-error-icon data-[type=error]:token-icon-toast-error",
      "data-[type=success]:text-toast-success-icon data-[type=success]:token-icon-toast-success",
      "data-[type=info]:text-toast-info-icon data-[type=info]:token-icon-toast-info",
      "data-[type=warning]:text-toast-warning-icon data-[type=warning]:token-icon-toast-warning",
      "data-[type=loading]:text-toast-loading-icon data-[type=loading]:token-icon-toast-loading",
    ],
    title: [
      "font-toast-title text-toast-title-size text-toast-title-fg",
      "data-[type=error]:text-toast-error-title",
      "data-[type=success]:text-toast-success-title",
      "data-[type=info]:text-toast-info-title",
      "data-[type=warning]:text-toast-warning-title",
    ],
    description: [
      "text-toast-description-size text-toast-description-fg mt-toast-description-gap",
    ],
    closeButton: [
      "grid place-items-center flex-shrink-0 ml-auto ",
      "cursor-pointer",
      "text-toast-close hover:text-toast-close-hover text-toast-close-size",
    ],
  },
});

// Toast Item Component
interface ToastProps {
  actor: toast.Options<React.ReactNode>;
  index: number;
  parent: toast.GroupService;
}

export function Toast({ actor, index, parent }: ToastProps) {
  const composedProps = {
    ...actor,
    index,
    parent,
  };
  const service = useMachine(toast.machine, composedProps);
  const api = toast.connect(service, normalizeProps);

  const { root, progressbar, header, icon, title, description, closeButton } =
    toastVariants();

  return (
    <div className={root()} {...api.getRootProps()}>
      <span {...api.getGhostBeforeProps()} />

      <div
        className={progressbar()}
        data-type={api.type}
        data-part="progressbar"
      />

      <div className={header()}>
        <span className={icon()} data-type={api.type} />
        <div className={title()} {...api.getTitleProps()} data-type={api.type}>
          {api.title}
        </div>
        <button className={closeButton()} {...api.getCloseTriggerProps()}>
          <span className="token-icon-toast-close" />
        </button>
      </div>
      {api.description && (
        <div
          className={description()}
          {...api.getDescriptionProps()}
          data-type={api.type}
        >
          {api.description}
        </div>
      )}

      <span {...api.getGhostAfterProps()} />
    </div>
  );
}

// Toast Group Component
export interface ToastContainerProps
  extends VariantProps<typeof toastVariants> {
  placement?: toast.Placement;
  gap?: number;
  offsets?: string;
  overlap?: boolean;
  max?: number;
}

// Create the global toast store
export const toaster = toast.createStore({
  placement: "bottom-end",
  gap: 16,
  offsets: "44px",
});

export function ToastContainer({
  placement,
  gap,
  offsets,
  overlap,
  max,
  ...props
}: ToastContainerProps = {}) {
  const service = useMachine(toast.group.machine, {
    id: useId(),
    store: toaster,
    ...props,
  });

  const api = toast.group.connect(service, normalizeProps);

  return (
    <Portal>
      <div {...api.getGroupProps()}>
        {api.getToasts().map((toast, index) => (
          <Toast key={toast.id} actor={toast} index={index} parent={service} />
        ))}
      </div>
    </Portal>
  );
}

// Hook for using toaster in components
export function useToast() {
  return toaster;
}
