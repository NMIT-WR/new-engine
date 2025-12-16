'use client'

import { Dialog } from '@techsio/ui-kit/molecules/dialog'
import { Button } from '@techsio/ui-kit/atoms/button'
import { useState } from 'react'
import { PplWidget, type PplAccessPointData } from './ppl-widget'

interface PplPickupDialogProps {
  /** Current selected access point data */
  selectedPoint?: PplAccessPointData | null
  /** Callback when access point is selected */
  onSelect: (data: PplAccessPointData) => void
  /** Initial address for map search */
  address?: string
}

/**
 * Dialog component for selecting PPL pickup points
 *
 * Uses Dialog from @libs/ui/molecules/dialog to display
 * PPL widget in a modal overlay for better UX
 *
 * @example
 * ```tsx
 * <PplPickupDialog
 *   selectedPoint={accessPoint}
 *   onSelect={(data) => handleAccessPointSelect(data)}
 *   address="Praha"
 * />
 * ```
 */
export function PplPickupDialog({
  selectedPoint,
  onSelect,
  address,
}: PplPickupDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (data: PplAccessPointData) => {
    console.log('[PplPickupDialog] Access point selected:', data)

    // Pass data to parent
    onSelect(data)

    // Close dialog
    setOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full"
      >
        {selectedPoint
          ? `✓ ${selectedPoint.name}`
          : 'Vybrat výdejní místo'
        }
      </Button>

      <Dialog
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        customTrigger
        placement="center"
        size="xl"
        title="Vyberte výdejní místo PPL"
        description="Najděte nejbližší ParcelShop nebo ParcelBox pro vyzvednutí zásilky"
        closeOnEscape={true}
        closeOnInteractOutside={false}
        actions={
          <Button
            variant="secondary"
            theme="outlined"
            onClick={() => setOpen(false)}
          >
            Zrušit
          </Button>
        }
      >
        <div className="min-h-[500px] w-[850px]">
          <PplWidget
            onSelect={handleSelect}
            country="CZ"
            mode="default"
            address={address}
            selectedCode={selectedPoint?.code}
          />
        </div>
      </Dialog>
    </>
  )
}
