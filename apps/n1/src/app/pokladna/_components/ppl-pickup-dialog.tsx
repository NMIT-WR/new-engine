'use client'

import { Dialog } from '@techsio/ui-kit/molecules/dialog'
import { Button } from '@techsio/ui-kit/atoms/button'
import { PplWidget, type PplAccessPointData } from './ppl-widget'

interface PplPickupDialogProps {
  /** Whether dialog is open (controlled) */
  open: boolean
  /** Current selected access point data */
  selectedPoint?: PplAccessPointData | null
  /** Callback when access point is selected */
  onSelect: (data: PplAccessPointData) => void
  /** Callback when dialog is closed without selection */
  onClose: () => void
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
 *   open={showDialog}
 *   selectedPoint={accessPoint}
 *   onSelect={(data) => handleAccessPointSelect(data)}
 *   onClose={() => setShowDialog(false)}
 *   address="Praha"
 * />
 * ```
 */
export function PplPickupDialog({
  open,
  selectedPoint,
  onSelect,
  onClose,
  address,
}: PplPickupDialogProps) {
  const handleSelect = (data: PplAccessPointData) => {
    console.log('[PplPickupDialog] Access point selected:', data)

    // Pass data to parent (parent will close dialog)
    onSelect(data)
  }

  const handleOpenChange = ({ open: isOpen }: { open: boolean }) => {
    if (!isOpen) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      customTrigger
      placement="center"
      size="xl"
      title="Vyberte výdejní místo PPL"
      description="Najděte nejbližší ParcelShop nebo ParcelBox pro vyzvednutí zásilky"
      closeOnEscape={true}
      closeOnInteractOutside={false}
      actions={
        <Button variant="secondary" theme="outlined" onClick={onClose}>
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
  )
}
