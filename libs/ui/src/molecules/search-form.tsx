import { type FormHTMLAttributes, type ReactNode, type Ref, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button, type ButtonProps } from '../atoms/button'
import { Input, type InputProps } from '../atoms/input'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const searchFormVariants = tv({
  slots: {
    form: 'grid relative',
    inputWrapper: [
      'grid grid-cols-[1fr_auto] relative items-center',
      'rounded-md bg-search-form-bg border-search-form-border border',
      'focus:border-search-form-border-active focus-within:border-search-form-border-active',
      'hover:bg-search-form-bg-hover',
      'has-[button:hover]:bg-search-form-bg',
    ],
    button: [
      'justify-self-end place-self-center focus-visible:ring-1 focus-visible:ring-offset-0',
      'h-full p-search-form-button',
    ],
  },
  variants: {
    size: {
      sm: {
        form: 'gap-search-form-sm',
        inputWrapper: 'gap-search-form-sm',
      },
      md: {
        form: 'gap-search-form-md',
        inputWrapper: 'gap-search-form-md',
      },
      lg: {
        form: 'gap-search-form-lg',
        inputWrapper: 'gap-search-form-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SearchFormProps
  extends VariantProps<typeof searchFormVariants>,
    Omit<FormHTMLAttributes<HTMLFormElement>, 'size'> {
  inputProps?: Omit<InputProps, 'size'>
  buttonProps?: Omit<ButtonProps, 'size'>
  label?: ReactNode
  buttonText?: ReactNode
  buttonIcon?: boolean
  placeholder?: string
  ref?: Ref<HTMLFormElement>
  searchId?: string
}

export function SearchForm({
  inputProps,
  buttonProps,
  size = 'md',
  buttonText,
  buttonIcon = false,
  placeholder = 'Search...',
  label,
  className,
  ref,
  searchId,
  ...props
}: SearchFormProps) {
  // Generate unique ID for input if not provided
  const fallbackId = useId()
  const id = searchId || `search-${fallbackId}`

  const withButton = !!buttonText || buttonIcon

  const { form, inputWrapper, button } = searchFormVariants({ size })

  return (
    <search>
      <form
        ref={ref}
        className={form({ size, className })}
        onSubmit={props.onSubmit}
        {...props}
      >
        {label && (
          <Label htmlFor={id} size={size}>
            {label}
          </Label>
        )}
        <div className={inputWrapper({ size })}>
          <Input
            id={id}
            type="search"
            placeholder={placeholder}
            size={size}
            context="nested"
            aria-label={label ? undefined : 'Search'}
            {...inputProps}
          />
          {withButton && (
            <Button
              type="submit"
              theme={buttonProps?.theme || 'borderless'}
              block={false}
              size={size}
              icon={buttonIcon ? 'token-icon-search' : undefined}
              aria-label={buttonText ? undefined : 'Search'}
              className={button({
                className: buttonText ? '' : 'aspect-square',
              })}
              {...buttonProps}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </form>
    </search>
  )
}

SearchForm.displayName = 'SearchForm'
