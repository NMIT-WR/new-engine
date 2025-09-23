import type { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import type { IEventBusModuleService, IFulfillmentModuleService, Logger, Query } from "@medusajs/framework/types"
import { PplClient } from "../modules/ppl"
import type { PplOptions, PplFulfillmentData, PplShipmentState } from "../modules/ppl"
import { PPL_DELIVERED_STATES, PPL_FAILED_STATES } from "../modules/ppl"

/**
 * PPL Tracking Sync Job
 *
 * Runs every 15 minutes to sync tracking status for PPL fulfillments.
 * Emits events when shipment status changes (delivered, failed).
 *
 * Uses GET /shipment endpoint to fetch current status in batches of 100.
 */
export default async function pplTrackingSyncJob(container: MedusaContainer) {
  const logger = container.resolve<Logger>("logger")
  const query = container.resolve<Query>(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve<IFulfillmentModuleService>(Modules.FULFILLMENT)
  const eventBus = container.resolve<IEventBusModuleService>(Modules.EVENT_BUS)

  logger.info("PPL Tracking Sync: Starting...")

  try {
    // Get PPL options from environment
    const pplOptions: PplOptions = {
      client_id: process.env.PPL_CLIENT_ID!,
      client_secret: process.env.PPL_CLIENT_SECRET!,
      environment: (process.env.PPL_ENVIRONMENT || "testing") as PplOptions["environment"],
      default_label_format: "Png",
    }

    if (!pplOptions.client_id || !pplOptions.client_secret) {
      logger.warn("PPL Tracking Sync: Missing PPL credentials, skipping")
      return
    }

    const client = new PplClient(pplOptions, logger)

    // Query fulfillments with PPL provider that are shipped but not delivered
    const { data: fulfillments } = await query.graph({
      entity: "fulfillment",
      fields: ["id", "data", "shipped_at", "delivered_at", "provider_id"],
    })

    // Filter to PPL fulfillments that are shipped but not delivered
    const pendingFulfillments = (fulfillments as any[]).filter(
      (f) =>
        f.provider_id === "ppl_ppl" && // provider_id format: {module}_{identifier}
        f.shipped_at &&
        !f.delivered_at &&
        f.data?.shipment_number
    )

    if (pendingFulfillments.length === 0) {
      logger.info("PPL Tracking Sync: No pending fulfillments to check")
      return
    }

    logger.info(
      `PPL Tracking Sync: Found ${pendingFulfillments.length} pending fulfillments`
    )

    // Batch shipment numbers (max 100 per request per API limits)
    const BATCH_SIZE = 100
    const shipmentNumbers = pendingFulfillments.map(
      (f) => (f.data as PplFulfillmentData).shipment_number
    )

    for (let i = 0; i < shipmentNumbers.length; i += BATCH_SIZE) {
      const batch = shipmentNumbers.slice(i, i + BATCH_SIZE)

      try {
        const shipmentInfos = await client.getShipmentInfo({shipmentNumbers: batch})

        // Create lookup map by shipment number
        const statusMap = new Map(
          shipmentInfos.map((info) => [info.shipmentNumber, info])
        )

        // Update each fulfillment
        for (const fulfillment of pendingFulfillments) {
          const fulfillmentData = fulfillment.data as PplFulfillmentData
          const shipmentNumber = fulfillmentData.shipment_number
          const info = statusMap.get(shipmentNumber)

          if (!info) {
            logger.debug(`PPL: No status found for ${shipmentNumber}`)
            continue
          }

          const currentStatus = fulfillmentData.last_status
          const newStatus = info.shipmentState as PplShipmentState

          // Skip if status hasn't changed
          if (currentStatus === newStatus) {
            continue
          }

          logger.info(
            `PPL: Shipment ${shipmentNumber} status changed: ${currentStatus || "unknown"} -> ${newStatus}`
          )

          // Check if delivered
          if (PPL_DELIVERED_STATES.includes(newStatus)) {
            logger.info(`PPL: Shipment ${shipmentNumber} delivered (${newStatus})`)

            const deliveredAt = info.deliveryDate
              ? new Date(info.deliveryDate)
              : new Date()

            // Update fulfillment with delivery date
            await fulfillmentService.updateFulfillment(fulfillment.id, {
              delivered_at: deliveredAt,
              data: {
                ...fulfillmentData,
                last_status: newStatus,
                last_status_date: info.stateDate,
              },
            })

            // Emit delivered event
            await eventBus.emit({
              name: "fulfillment.delivered",
              data: {
                fulfillment_id: fulfillment.id,
                shipment_number: shipmentNumber,
                delivered_at: deliveredAt.toISOString(),
                status: newStatus,
              },
            })
          }
          // Check if failed/returned
          else if (PPL_FAILED_STATES.includes(newStatus)) {
            logger.warn(`PPL: Shipment ${shipmentNumber} failed (${newStatus})`)

            // Update fulfillment data with failure status
            await fulfillmentService.updateFulfillment(fulfillment.id, {
              data: {
                ...fulfillmentData,
                last_status: newStatus,
                last_status_date: info.stateDate,
                delivery_failed: true,
              },
            })

            // Emit delivery failed event
            await eventBus.emit({
              name: "fulfillment.delivery_failed",
              data: {
                fulfillment_id: fulfillment.id,
                shipment_number: shipmentNumber,
                status: newStatus,
                status_date: info.stateDate,
              },
            })
          }
          // Still in transit - just update status
          else {
            logger.debug(`PPL: Shipment ${shipmentNumber} status: ${newStatus}`)

            await fulfillmentService.updateFulfillment(fulfillment.id, {
              data: {
                ...fulfillmentData,
                last_status: newStatus,
                last_status_date: info.stateDate,
              },
            })
          }
        }
      } catch (error) {
        logger.warn(
          `PPL Tracking Sync: Failed to fetch batch status: ${error instanceof Error ? error.message : String(error)}`
        )
        // Continue with next batch
      }
    }

    logger.info("PPL Tracking Sync: Completed")
  } catch (error) {
    logger.error(
      'PPL Tracking Sync failed',
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

export const config = {
  name: "ppl-tracking-sync",
  schedule: "*/15 * * * *", // Every 15 minutes
}
