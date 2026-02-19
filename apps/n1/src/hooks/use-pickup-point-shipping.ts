import { useState } from "react"
import type { ShippingMethodData } from "@/services/cart-service"
import type { PplAccessPointData } from "@/utils/address-helpers"
import {
  accessPointToAddress,
  accessPointToShippingData,
  isPPLParcelOption,
} from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"

export type PickupPointState = {
  /** ID shipping option čekající na výběr access pointu */
  pendingOptionId: string | null
  /** Zda je dialog otevřený */
  isDialogOpen: boolean
  /** Vybraný access point */
  selectedPoint: PplAccessPointData | null
}

export type UsePickupPointShippingReturn = {
  // State
  state: PickupPointState

  // Queries
  /** Zda je access point vybrán */
  hasSelection: boolean
  /** Zda vybraná shipping option vyžaduje access point */
  requiresAccessPoint: (optionName?: string) => boolean

  // Actions
  /** Otevře dialog pro výběr access pointu */
  openDialog: (optionId: string) => void
  /** Zavře dialog */
  closeDialog: () => void
  /** Nastaví vybraný access point */
  selectPoint: (point: PplAccessPointData) => void
  /** Vymaže výběr */
  clearSelection: () => void
  /** Reset celého stavu */
  reset: () => void

  // Data transformers
  /** Vrátí ShippingMethodData pro API call */
  getShippingData: () => ShippingMethodData | null
  /** Vrátí AddressFormData pro shipping address */
  getShippingAddress: (
    billingAddress: AddressFormData
  ) => AddressFormData | null
}

const INITIAL_STATE: PickupPointState = {
  pendingOptionId: null,
  isDialogOpen: false,
  selectedPoint: null,
}

export function usePickupPointShipping(): UsePickupPointShippingReturn {
  const [state, setState] = useState<PickupPointState>(INITIAL_STATE)

  const openDialog = (optionId: string) => {
    setState({
      pendingOptionId: optionId,
      isDialogOpen: true,
      selectedPoint: null,
    })
  }

  const closeDialog = () => {
    setState((prev) => ({
      ...prev,
      isDialogOpen: false,
    }))
  }

  const selectPoint = (point: PplAccessPointData) => {
    setState((prev) => ({
      ...prev,
      selectedPoint: point,
      isDialogOpen: false,
    }))
  }

  const clearSelection = () => {
    setState((prev) => ({
      ...prev,
      selectedPoint: null,
      pendingOptionId: null,
    }))
  }

  const reset = () => {
    setState(INITIAL_STATE)
  }

  const requiresAccessPoint = (optionName?: string): boolean => {
    if (!optionName) {
      return false
    }
    return isPPLParcelOption(optionName)
  }

  const getShippingData = (): ShippingMethodData | null => {
    if (!state.selectedPoint) {
      return null
    }
    return accessPointToShippingData(state.selectedPoint)
  }

  const getShippingAddress = (
    billingAddress: AddressFormData
  ): AddressFormData | null => {
    if (!state.selectedPoint) {
      return null
    }
    return accessPointToAddress(state.selectedPoint, billingAddress)
  }

  return {
    state,
    hasSelection: state.selectedPoint !== null,
    requiresAccessPoint,
    openDialog,
    closeDialog,
    selectPoint,
    clearSelection,
    reset,
    getShippingData,
    getShippingAddress,
  }
}
