import type { Ref, TextareaHTMLAttributes } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '../utils';

const textareaVariants = tv({
  base: [
    'block w-full',
    'bg-textarea',
    'text-textarea-text',
    'placeholder:text-textarea-placeholder',
    'border-(length:--textarea-border-width) border-textarea-border',
    'rounded-textarea',
    'transition-all duration-200',
    'hover:bg-textarea-hover hover:border-textarea-border-hover',
    'focus:outline-none focus:bg-textarea-focus focus:border-textarea-border-focus',
    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-textarea-ring',
    'disabled:pointer-events-none disabled:bg-textarea-disabled disabled:border-textarea-border-disabled disabled:text-textarea-text-disabled',
  ],
  variants: {
    variant: {
      default: '',
      error: [
        'border-textarea-border-danger',
        'hover:border-textarea-border-danger-hover',
        'focus:border-textarea-border-danger-focus',
        'focus-visible:ring-textarea-ring-danger',
        'placeholder:text-textarea-placeholder-danger',
      ],
      success: [
        'border-textarea-border-success',
        'hover:border-textarea-border-success-hover',
        'focus:border-textarea-border-success-focus',
        'focus-visible:ring-textarea-ring-success',
      ],
      warning: [
        'border-textarea-border-warning',
        'hover:border-textarea-border-warning-hover',
        'focus:border-textarea-border-warning-focus',
        'focus-visible:ring-textarea-ring-warning',
      ],
      borderless: [
        'border-transparent',
        'bg-textarea-borderless',
        'hover:bg-fill-hover',
        'focus:bg-fill-active',
      ],
    },
    size: {
      sm: 'p-textarea-sm text-textarea-sm',
      md: 'p-textarea-md text-textarea-md',
      lg: 'p-textarea-lg text-textarea-lg',
    },
    resize: {
      none: 'resize-none',
      y: 'resize-y',
      x: 'resize-x',
      both: 'resize',
    },
    readonly: {
      true: 'bg-textarea-disabled cursor-default pointer-events-none opacity-90 text-textarea-text-disabled border-textarea-border-disabled',
    },
  },
  defaultVariants: {
    size: 'md',
    resize: 'y',
    variant: 'default',
  },
});

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  size,
  resize,
  variant,
  readonly,
  className,
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      readOnly={readonly}
      className={textareaVariants({
        size,
        resize,
        variant,
        readonly,
        className,
      })}
      {...props}
    />
  );
}

Textarea.displayName = 'Textarea';
