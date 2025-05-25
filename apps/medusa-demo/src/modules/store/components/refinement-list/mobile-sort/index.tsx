import { Button } from '@/components/Button'
import { UiDialog, UiDialogTrigger } from '@/components/Dialog'
import { UiModal, UiModalOverlay } from '@/components/ui/Modal'
import {
  UiRadio,
  UiRadioBox,
  UiRadioGroup,
  UiRadioLabel,
} from '@/components/ui/Radio'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import * as ReactAria from 'react-aria-components'

type MobileSortType = {
  sortBy: SortOptions | undefined
  setQueryParams: (name: string, value: SortOptions) => void
}

export const MobileSort = ({ sortBy, setQueryParams }: MobileSortType) => {
  return (
    <UiDialogTrigger>
      <Button
        size="sm"
        variant="outline"
        iconName="chevron-down"
        iconPosition="end"
        className="border-grayscale-200 md:hidden"
      >
        Sort by
      </Button>
      <UiModalOverlay className="p-0">
        <UiModal
          animateFrom="bottom"
          className="w-full max-w-full rounded-none pb-21 shadow-none"
        >
          <UiDialog>
            {({ close }) => (
              <form
                onSubmit={(event) => {
                  const formData = new FormData(event.currentTarget)

                  const sortBy = formData.get('sortBy')?.toString()

                  setQueryParams('sortBy', sortBy as SortOptions)

                  close()
                }}
              >
                <UiRadioGroup
                  className="mb-5 flex flex-col"
                  name="sortBy"
                  defaultValue={sortBy}
                  aria-label="Sort by"
                >
                  <ReactAria.Label className="mb-3 block font-semibold text-md">
                    Sort by
                  </ReactAria.Label>
                  <UiRadio value="created_at" className="justify-between py-3">
                    <UiRadioLabel>Latest Arrivals</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                  <UiRadio value="price_asc" className="justify-between py-3">
                    <UiRadioLabel>Lowest price</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                  <UiRadio value="price_desc" className="justify-between py-3">
                    <UiRadioLabel>Highest price</UiRadioLabel>
                    <UiRadioBox />
                  </UiRadio>
                </UiRadioGroup>
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
