import { Button } from '@techsio/ui-kit/atoms/button'
import { Dialog } from '@techsio/ui-kit/molecules/dialog'
import type { ReactNode } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger' | 'secondary'
  isLoading?: boolean
  loadingText?: string
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Potvrdit',
  cancelText = 'Zrušit',
  confirmVariant = 'danger',
  isLoading = false,
  loadingText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={({ open }) => onOpenChange(open)}
      role="alertdialog"
      title={title}
      description={description}
      customTrigger
      size="sm"
      placement="center"
      closeOnInteractOutside={!isLoading}
      closeOnEscape={!isLoading}
      className="shadow-none"
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText || confirmText : confirmText}
          </Button>
        </>
      }
    />
  )
}
