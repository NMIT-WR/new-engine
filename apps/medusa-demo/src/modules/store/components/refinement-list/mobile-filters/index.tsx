import * as ReactAria from 'react-aria-components'

import { Button } from '@/components/Button'
import { UiDialog, UiDialogTrigger } from '@/components/Dialog'
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
  UiCheckboxLabel,
} from '@/components/ui/Checkbox'
import { UiModal, UiModalOverlay } from '@/components/ui/Modal'

type MobileFIltersType = {
  collections?: Record<string, string>
  collection?: string[]
  categories?: Record<string, string>
  category?: string[]
  types?: Record<string, string>
  type?: string[]
  setMultipleQueryParams: (params: Record<string, string | string[]>) => void
}

export const MobileFilters = ({
  collections,
  collection,
  categories,
  category,
  types,
  type,
  setMultipleQueryParams,
}: MobileFIltersType) => {
  return (
    <UiDialogTrigger>
      <Button
        size="sm"
        variant="outline"
        iconName="plus"
        iconPosition="end"
        className="border-grayscale-200 md:hidden"
      >
        Filter
      </Button>
      <UiModalOverlay className="p-0">
        <UiModal
          animateFrom="bottom"
          className="top-36 w-full max-w-full pb-26"
        >
          <UiDialog>
            {({ close }) => (
              <form
                onSubmit={(event) => {
                  const formData = new FormData(event.currentTarget)

                  const collection = formData
                    .getAll('collection')
                    .map((value) => value.toString())
                  const category = formData
                    .getAll('category')
                    .map((value) => value.toString())
                  const type = formData
                    .getAll('type')
                    .map((value) => value.toString())

                  setMultipleQueryParams({
                    collection,
                    category,
                    type,
                  })

                  close()
                }}
              >
                {collections && Object.keys(collections).length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="collection"
                    defaultValue={collection ?? []}
                  >
                    <ReactAria.Label className="mb-3 block font-semibold text-md">
                      Collections
                    </ReactAria.Label>
                    {Object.entries(collections).map(([key, value]) => (
                      <UiCheckbox
                        key={key}
                        value={key}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{value}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                {collections &&
                  Object.keys(collections).length > 0 &&
                  ((categories && Object.keys(categories).length > 0) ||
                    (types && Object.keys(types).length > 0)) && (
                    <hr className="my-3 text-grayscale-200" />
                  )}
                {categories && Object.keys(categories).length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="category"
                    defaultValue={category ?? []}
                  >
                    <ReactAria.Label className="mb-3 block font-semibold text-md">
                      Categories
                    </ReactAria.Label>
                    {Object.entries(categories).map(([key, value]) => (
                      <UiCheckbox
                        key={key}
                        value={key}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{value}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                {categories &&
                  Object.keys(categories).length > 0 &&
                  types &&
                  Object.keys(types).length > 0 && (
                    <hr className="my-3 text-grayscale-200" />
                  )}
                {types && Object.keys(types).length > 0 && (
                  <ReactAria.CheckboxGroup
                    className="flex flex-col"
                    name="type"
                    defaultValue={type ?? []}
                  >
                    <ReactAria.Label className="mb-3 block font-semibold text-md">
                      Types
                    </ReactAria.Label>
                    {Object.entries(types).map(([key, value]) => (
                      <UiCheckbox
                        key={key}
                        value={key}
                        className="justify-between py-3"
                      >
                        <UiCheckboxLabel>{value}</UiCheckboxLabel>
                        <UiCheckboxBox>
                          <UiCheckboxIcon />
                        </UiCheckboxBox>
                      </UiCheckbox>
                    ))}
                  </ReactAria.CheckboxGroup>
                )}
                <footer className="fixed bottom-0 left-0 flex h-21 w-full items-center border-grayscale-100 border-t bg-white px-6">
                  <Button type="submit" isFullWidth>
                    Show results
                  </Button>
                </footer>
              </form>
            )}
          </UiDialog>
        </UiModal>
      </UiModalOverlay>
    </UiDialogTrigger>
  )
}
