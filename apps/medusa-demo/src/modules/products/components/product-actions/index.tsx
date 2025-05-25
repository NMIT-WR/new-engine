'use client'

import { Button } from '@/components/Button'
import { NumberField } from '@/components/NumberField'
import { UiRadioGroup } from '@/components/ui/Radio'
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from '@/components/ui/Select'
import { getVariantItemsInStock } from '@lib/util/inventory'
import { withReactQueryProvider } from '@lib/util/react-query'
import type { HttpTypes } from '@medusajs/types'
import ProductPrice from '@modules/products/components/product-price'
import { useAddLineItem } from 'hooks/cart'
import { useCountryCode } from 'hooks/country-code'
import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import * as ReactAria from 'react-aria-components'

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant['options']
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) {
      acc[varopt.option_id] = varopt.value
    }
    return acc
  }, {})
}

const priorityOptions = ['Material', 'Color', 'Size']

const getInitialOptions = (product: ProductActionsProps['product']) => {
  if (product.variants?.length === 1) {
    const variantOptions = optionsAsKeymap(product.variants[0].options)
    return variantOptions ?? {}
  }

  if (product.options) {
    const singleOptionValues = product.options
      .filter((option) => option.values)
      .filter((option) => option.values!.length === 1)
      .reduce(
        (acc, option) => {
          acc[option.id] = option.values![0].value
          return acc
        },
        {} as Record<string, string>
      )

    return singleOptionValues
  }

  return null
}

function ProductActions({ product, materials, disabled }: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    getInitialOptions(product) ?? {}
  )
  const [quantity, setQuantity] = useState(1)
  const countryCode = useCountryCode()

  const { mutateAsync, isPending } = useAddLineItem()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    const initialOptions = getInitialOptions(product)
    if (initialOptions) {
      setOptions(initialOptions)
    }
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // check if the selected variant is in stock
  const itemsInStock = selectedVariant
    ? getVariantItemsInStock(selectedVariant)
    : 0

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    console.log('selectedVariant', selectedVariant)

    await mutateAsync({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })
  }

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const productOptions = (product.options || []).sort((a, b) => {
    let aPriority = priorityOptions.indexOf(a.title ?? '')
    let bPriority = priorityOptions.indexOf(b.title ?? '')

    if (aPriority === -1) {
      aPriority = priorityOptions.length
    }

    if (bPriority === -1) {
      bPriority = priorityOptions.length
    }

    return aPriority - bPriority
  })

  const materialOption = productOptions.find((o) => o.title === 'Material')
  const colorOption = productOptions.find((o) => o.title === 'Color')
  const otherOptions =
    materialOption && colorOption
      ? productOptions.filter(
          (o) => o.id !== materialOption.id && o.id !== colorOption.id
        )
      : productOptions

  const selectedMaterial =
    materialOption && options[materialOption.id]
      ? materials.find((m) => m.name === options[materialOption.id])
      : undefined

  const showOtherOptions =
    !materialOption ||
    !colorOption ||
    (selectedMaterial &&
      (selectedMaterial.colors.length < 2 || options[colorOption.id]))

  return (
    <>
      <ProductPrice product={product} variant={selectedVariant} />
      <div className="mb-8 max-w-120 max-md:text-xs md:mb-16">
        <p>{product.description}</p>
      </div>
      {hasMultipleVariants && (
        <div className="mb-4 flex flex-col gap-8 md:mb-26 md:gap-6">
          {materialOption && colorOption && (
            <>
              <div>
                <p className="mb-4">
                  Materials
                  {options[materialOption.id] && (
                    <span className="ml-6 text-grayscale-500">
                      {options[materialOption.id]}
                    </span>
                  )}
                </p>
                <ReactAria.Select
                  selectedKey={options[materialOption.id] ?? null}
                  onSelectionChange={(value) => {
                    setOptions({ [materialOption.id]: `${value}` })
                  }}
                  placeholder="Choose material"
                  className="w-full md:w-60"
                  isDisabled={!!disabled || isPending}
                  aria-label="Material"
                >
                  <UiSelectButton className="!h-12 gap-2 px-4 max-md:text-base">
                    <UiSelectValue />
                    <UiSelectIcon className="h-6 w-6" />
                  </UiSelectButton>
                  <ReactAria.Popover className="w-[--trigger-width]">
                    <UiSelectListBox>
                      {materials.map((material) => (
                        <UiSelectListBoxItem
                          key={material.id}
                          id={material.name}
                        >
                          {material.name}
                        </UiSelectListBoxItem>
                      ))}
                    </UiSelectListBox>
                  </ReactAria.Popover>
                </ReactAria.Select>
              </div>
              {selectedMaterial && (
                <div className="mb-6">
                  <p className="mb-4">
                    Colors
                    <span className="ml-6 text-grayscale-500">
                      {options[colorOption.id]}
                    </span>
                  </p>
                  <UiRadioGroup
                    value={options[colorOption.id] ?? null}
                    onChange={(value) => {
                      setOptionValue(colorOption.id, value)
                    }}
                    aria-label="Color"
                    className="flex gap-6"
                    isDisabled={!!disabled || isPending}
                  >
                    {selectedMaterial.colors.map(
                      (color) =>
                        (
                          <ReactAria.Radio
                        key={color.id}
                        value={color.name}
                        aria-label={color.name}
                        className='before:-bottom-2 relative h-8 w-8 cursor-pointer shadow-sm before:absolute before:left-0 before:h-px before:w-full before:transition-colors before:content-[''] hover:shadow data-[selected]:before:bg-black'
                        style={{ background: color.hex_code }}
                      />
                        )
                    )}
                  </UiRadioGroup>
                </div>
              )}
            </>
          )}
          {showOtherOptions &&
            otherOptions.map((option) => {
              return (
                <div key={option.id}>
                  <p className="mb-4">
                    {option.title}
                    {options[option.id] && (
                      <span className="ml-6 text-grayscale-500">
                        {options[option.id]}
                      </span>
                    )}
                  </p>
                  <ReactAria.Select
                    selectedKey={options[option.id] ?? null}
                    onSelectionChange={(value) => {
                      setOptionValue(option.id, `${value}`)
                    }}
                    placeholder={`Choose ${option.title.toLowerCase()}`}
                    className="w-full md:w-60"
                    isDisabled={!!disabled || isPending}
                    aria-label={option.title}
                  >
                    <UiSelectButton className="!h-12 gap-2 px-4 max-md:text-base">
                      <UiSelectValue />
                      <UiSelectIcon className="h-6 w-6" />
                    </UiSelectButton>
                    <ReactAria.Popover className="w-[--trigger-width]">
                      <UiSelectListBox>
                        {(option.values ?? [])
                          .filter((value) => Boolean(value.value))
                          .map((value) => (
                            <UiSelectListBoxItem
                              key={value.id}
                              id={value.value}
                            >
                              {value.value}
                            </UiSelectListBoxItem>
                          ))}
                      </UiSelectListBox>
                    </ReactAria.Popover>
                  </ReactAria.Select>
                </div>
              )
            })}
        </div>
      )}
      <div className="flex gap-4 max-sm:flex-col">
        <NumberField
          isDisabled={
            !itemsInStock || !selectedVariant || !!disabled || isPending
          }
          value={quantity}
          onChange={setQuantity}
          minValue={1}
          maxValue={itemsInStock}
          className="w-full max-md:justify-center max-md:gap-2 sm:w-35"
          aria-label="Quantity"
        />
        <Button
          onClick={handleAddToCart}
          isDisabled={!itemsInStock || !selectedVariant || !!disabled}
          isLoading={isPending}
          className="sm:flex-1"
        >
          {selectedVariant
            ? itemsInStock
              ? 'Add to cart'
              : 'Out of stock'
            : 'Select variant'}
        </Button>
      </div>
    </>
  )
}

export default withReactQueryProvider(ProductActions)
