'use client'

import { Icon } from '@/components/Icon'
import { zodResolver } from '@hookform/resolvers/zod'
import CountrySelect from '@modules/checkout/components/country-select'
import * as React from 'react'
import {
  type ControllerRenderProps,
  type DefaultValues,
  FormProvider,
  type UseFormProps,
  type UseFormReturn,
  useController,
  useForm,
} from 'react-hook-form'
import { twJoin, twMerge } from 'tailwind-merge'
import type { z } from 'zod'

export type FormProps<T extends z.ZodTypeAny> = UseFormProps<z.infer<T>> & {
  schema: T
  onSubmit: (
    values: z.infer<T>,
    form: UseFormReturn<z.infer<T>>
  ) => void | Promise<void>
  defaultValues?: DefaultValues<z.infer<T>>
  children?:
    | React.ReactNode
    | ((form: UseFormReturn<z.infer<T>>) => React.ReactNode)

  formProps?: Omit<React.ComponentProps<'form'>, 'onSubmit'>
}

export const Form = <T extends z.ZodTypeAny>({
  schema,
  onSubmit,
  children,
  formProps,
  ...props
}: FormProps<T>) => {
  const form = useForm({
    resolver: zodResolver(schema),
    ...props,
  })

  const submitHandler = React.useCallback(
    (values: z.infer<T>) => {
      return onSubmit(values, form)
    },
    [onSubmit, form]
  )

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> =
    React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit(submitHandler, (err) => console.log(err))(event)
      },
      [form, submitHandler]
    )

  return (
    <FormProvider {...form}>
      <form {...formProps} onSubmit={onFormSubmit}>
        <fieldset disabled={form.formState.isSubmitting}>
          {typeof children === 'function' ? children(form) : children}
        </fieldset>
      </form>
    </FormProvider>
  )
}

export const getInputClassNames = ({
  uiSize = 'lg',
  isVisuallyDisabled,
  isSuccess,
}: InputOwnProps): string => {
  const sizeClasses = {
    sm: 'h-9 text-xs focus:pt-3.5 [&:not(:placeholder-shown)]:pt-3.5 [&:autofill]:pt-3.5',
    md: 'h-12 focus:pt-3 [&:not(:placeholder-shown)]:pt-3 [&:autofill]:pt-3',
    lg: 'h-14 focus:pt-4 [&:not(:placeholder-shown)]:pt-4 [&:autofill]:pt-4',
  }

  const visuallyDisabledClasses = isVisuallyDisabled
    ? 'pointer-events-none bg-grayscale-50'
    : ''

  const successClasses = isSuccess ? 'border-green-500 pr-7' : ''

  return twJoin(
    'peer block w-full rounded-xs border border-grayscale-200 bg-transparent px-4 outline-none transition-all placeholder:invisible hover:border-grayscale-500 focus:border-grayscale-500 disabled:pointer-events-none disabled:bg-grayscale-50 aria-[invalid=true]:border-red-primary aria-[invalid=true]:focus:border-red-900 aria-[invalid=true]:hover:border-red-900 [&:autofill]:bg-clip-text',
    sizeClasses[uiSize],
    visuallyDisabledClasses,
    successClasses
  )
}

export const getPlaceholderClassNames = ({
  uiSize = 'lg',
}: Pick<InputOwnProps, 'uiSize'>): string => {
  const sizeClasses = {
    lg: 'peer-focus:top-2.5 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:autofill]:top-2.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs',
    md: 'peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-[:autofill]:text-xs',
    sm: 'peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 peer-[:autofill]:top-1 text-xs peer-focus:text-2xs peer-[:not(:placeholder-shown)]:text-2xs peer-[:autofill]:text-2xs',
  }

  return twJoin(
    '-translate-y-1/2 pointer-events-none absolute left-4 text-grayscale-400 transition-all peer-placeholder-shown:top-1/2 peer-focus:translate-y-0 peer-[:autofill]:translate-y-0 peer-[:not(:placeholder-shown)]:translate-y-0',
    sizeClasses[uiSize]
  )
}

/**
 * Label
 */
type InputLabelOwnProps = {
  isRequired?: boolean
}

export type InputLabelProps = React.ComponentPropsWithRef<'label'> &
  InputLabelOwnProps

export const InputLabel = ({
  isRequired,
  children,
  className,
  ...rest
}: InputLabelProps) => (
  <label {...rest} className={twMerge('mb-1 block font-semibold', className)}>
    {children}
    {isRequired && <span className="ml-0.5 text-orange-700">*</span>}
  </label>
)

/**
 * SubLabel
 */
type InputSubLabelOwnProps = {
  type: 'success' | 'error'
}

export const InputSubLabel: React.FC<
  React.ComponentPropsWithRef<'p'> & InputSubLabelOwnProps
> = ({ type, children, className, ...rest }) => (
  <p
    {...rest}
    className={twMerge(
      'mt-2 text-xs',
      type === 'success' && 'text-green-700',
      type === 'error' && 'text-red-primary',
      className
    )}
  >
    {children}
  </p>
)

/**
 * Input
 */
export type InputOwnProps = {
  uiSize?: 'sm' | 'md' | 'lg'
  isVisuallyDisabled?: boolean
  isSuccess?: boolean
  errorMessage?: string
  wrapperClassName?: string
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputOwnProps & {
    ref?: React.Ref<HTMLInputElement>
  }
export const Input = ({
  uiSize = 'lg',
  isVisuallyDisabled,
  isSuccess,
  errorMessage,
  wrapperClassName,
  placeholder,
  className,
  ref,
  ...rest
}: InputProps) => (
  <div className={twMerge('relative', wrapperClassName)}>
    <input
      {...rest}
      ref={ref}
      className={twMerge(
        getInputClassNames({
          uiSize,
          isVisuallyDisabled,
          isSuccess,
        }),
        className
      )}
      placeholder={placeholder}
    />
    {placeholder && (
      <span className={getPlaceholderClassNames({ uiSize })}>
        {placeholder}
      </span>
    )}
    {isSuccess && (
      <Icon
        name="check"
        className="-translate-y-1/2 absolute top-1/2 right-0 mr-4 h-auto w-6 text-green-500"
      />
    )}
    {errorMessage && (
      <InputSubLabel type="error" className="hidden aria-[invalid=true]:block">
        {errorMessage}
      </InputSubLabel>
    )}
  </div>
)

export interface InputFieldProps {
  className?: string
  name: string
  placeholder?: string
  type?: React.ComponentProps<typeof Input>['type']
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    'name' | 'id' | 'type' | keyof ControllerRenderProps
  >
}

export const InputField: React.FC<InputFieldProps> = ({
  className,
  name,
  type,
  inputProps,
  placeholder,
}) => {
  const { field, fieldState } = useController<{ __name__: string }, '__name__'>(
    { name: name as '__name__' }
  )

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        {...inputProps}
        {...field}
        value={field.value ?? ''}
        id={name}
        type={type}
        aria-invalid={Boolean(fieldState.error)}
      />
      {fieldState.error && (
        <div className="pt-2 text-red-900 text-small-regular">
          <span>{fieldState.error.message}</span>
        </div>
      )}
    </div>
  )
}

export interface CountrySelectFieldProps {
  className?: string
  name: string
  label?: string
  selectProps?: Omit<
    React.ComponentProps<typeof CountrySelect>,
    'name' | 'id' | keyof ControllerRenderProps
  >
  isRequired?: boolean
  children?: React.ReactNode
}

export const CountrySelectField: React.FC<CountrySelectFieldProps> = ({
  className,
  name,
  selectProps,
  children,
}) => {
  const { field, fieldState } = useController<{ __name__: string }, '__name__'>(
    { name: name as '__name__' }
  )

  return (
    <div className={className}>
      <CountrySelect
        {...selectProps}
        {...field}
        selectedKey={field.value ?? ''}
        name={name}
      >
        <>{children}</>
      </CountrySelect>
      {fieldState.error && (
        <div className="pt-2 text-red-900 text-small-regular">
          <span>{fieldState.error.message}</span>
        </div>
      )}
    </div>
  )
}
