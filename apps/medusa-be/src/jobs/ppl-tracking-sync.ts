import type { MedusaContainer } from '@medusajs/framework'
import type {
  IEventBusModuleService,
  IFulfillmentModuleService,
  Logger,
  Query,
} from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'
import { PplClient } from '../modules/ppl'
import type {
  PplFulfillmentData,
  PplOptions,
  PplShipmentInfo,
  PplShipmentState,
} from '../modules/ppl'
import { PPL_DELIVERED_STATES, PPL_FAILED_STATES } from '../modules/ppl'

// Types
interface FulfillmentRecord {
  id: string
  data: PplFulfillmentData | null
  shipped_at: string | null
  delivered_at: string | null
  provider_id: string
}

interface PendingFulfillment extends FulfillmentRecord {
  data: PplFulfillmentData & { shipment_number: string }
}

interface TrackingContext {
  logger: Logger
  fulfillmentService: IFulfillmentModuleService
  eventBus: IEventBusModuleService
}

const BATCH_SIZE = 100

/**
 * PPL Tracking Sync Job
 *
 * Runs every 15 minutes to sync tracking status for PPL fulfillments.
 * Emits events when shipment status changes (delivered, failed).
 *
 * Uses GET /shipment endpoint to fetch current status in batches of 100.
 */
export default async function pplTrackingSyncJob(container: MedusaContainer) {
  const logger = container.resolve<Logger>('logger')

  // Check if PPL service is enabled
  if (process.env.PPL_ENABLED !== '1') {
    logger.debug('PPL Tracking Sync: PPL service is disabled (PPL_ENABLED != 1), skipping')
    return
  }

  const query = container.resolve<Query>(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve<IFulfillmentModuleService>(
    Modules.FULFILLMENT
  )
  const eventBus = container.resolve<IEventBusModuleService>(Modules.EVENT_BUS)

  logger.info('PPL Tracking Sync: Starting...')

  try {
    const client = createPplClient(logger)
    if (!client) {
      return
    }

    const pendingFulfillments = await fetchPendingFulfillments(query)

    if (pendingFulfillments.length === 0) {
      logger.info('PPL Tracking Sync: No pending fulfillments to check')
      return
    }

    logger.info(
      `PPL Tracking Sync: Found ${pendingFulfillments.length} pending fulfillments`
    )

    const ctx: TrackingContext = { logger, fulfillmentService, eventBus }
    await processFulfillmentsInBatches(ctx, client, pendingFulfillments)

    logger.info('PPL Tracking Sync: Completed')
  } catch (error) {
    logger.error(
      'PPL Tracking Sync failed',
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

export const config = {
  name: 'ppl-tracking-sync',
  schedule: '*/15 * * * *', // Every 15 minutes
}

// Helper functions

function createPplClient(logger: Logger): PplClient | null {
  const pplOptions: PplOptions = {
    client_id: process.env.PPL_CLIENT_ID!,
    client_secret: process.env.PPL_CLIENT_SECRET!,
    environment: (process.env.PPL_ENVIRONMENT ||
      'testing') as PplOptions['environment'],
    default_label_format: 'Png',
  }

  if (!pplOptions.client_id || !pplOptions.client_secret) {
    logger.warn('PPL Tracking Sync: Missing PPL credentials, skipping')
    return null
  }

  return new PplClient(pplOptions, logger)
}

async function fetchPendingFulfillments(
  query: Query
): Promise<PendingFulfillment[]> {
  const { data: fulfillments } = await query.graph({
    entity: 'fulfillment',
    fields: ['id', 'data', 'shipped_at', 'delivered_at', 'provider_id'],
  })

  return (fulfillments as FulfillmentRecord[]).filter(
    (f): f is PendingFulfillment =>
      f.provider_id === 'ppl_ppl' &&
      f.shipped_at !== null &&
      !f.delivered_at &&
      typeof f.data?.shipment_number === 'string'
  )
}

async function processFulfillmentsInBatches(
  ctx: TrackingContext,
  client: PplClient,
  fulfillments: PendingFulfillment[]
): Promise<void> {
  // Create lookup map: shipment_number -> fulfillment
  const fulfillmentMap = new Map(
    fulfillments.map((f) => [f.data.shipment_number, f])
  )
  const shipmentNumbers = [...fulfillmentMap.keys()]

  for (let i = 0; i < shipmentNumbers.length; i += BATCH_SIZE) {
    const batch = shipmentNumbers.slice(i, i + BATCH_SIZE)
    await processBatch(ctx, client, batch, fulfillmentMap)
  }
}

async function processBatch(
  ctx: TrackingContext,
  client: PplClient,
  shipmentNumbers: string[],
  fulfillmentMap: Map<string, PendingFulfillment>
): Promise<void> {
  try {
    const shipmentInfos = await client.getShipmentInfo({ shipmentNumbers })

    for (const info of shipmentInfos) {
      const fulfillment = fulfillmentMap.get(info.shipmentNumber)
      if (fulfillment) {
        await processFulfillmentStatus(ctx, fulfillment, info)
      }
    }
  } catch (error) {
    ctx.logger.warn(
      `PPL Tracking Sync: Failed to fetch batch status: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

async function processFulfillmentStatus(
  ctx: TrackingContext,
  fulfillment: PendingFulfillment,
  info: PplShipmentInfo
): Promise<void> {
  const fulfillmentData = fulfillment.data
  const currentStatus = fulfillmentData.last_status
  const newStatus = info.shipmentState as PplShipmentState

  if (currentStatus === newStatus) {
    return
  }

  ctx.logger.info(
    `PPL: Shipment ${fulfillmentData.shipment_number} status changed: ${currentStatus || 'unknown'} -> ${newStatus}`
  )

  if (PPL_DELIVERED_STATES.includes(newStatus)) {
    await handleDelivered(ctx, fulfillment, info, newStatus)
  } else if (PPL_FAILED_STATES.includes(newStatus)) {
    await handleFailed(ctx, fulfillment, info, newStatus)
  } else {
    await handleInTransit(ctx, fulfillment, info, newStatus)
  }
}

async function handleDelivered(
  ctx: TrackingContext,
  fulfillment: PendingFulfillment,
  info: PplShipmentInfo,
  newStatus: PplShipmentState
): Promise<void> {
  const { logger, fulfillmentService, eventBus } = ctx
  const fulfillmentData = fulfillment.data

  logger.info(
    `PPL: Shipment ${fulfillmentData.shipment_number} delivered (${newStatus})`
  )

  const deliveredAt = info.deliveryDate
    ? new Date(info.deliveryDate)
    : new Date()

  await fulfillmentService.updateFulfillment(fulfillment.id, {
    delivered_at: deliveredAt,
    data: {
      ...fulfillmentData,
      last_status: newStatus,
      last_status_date: info.stateDate,
    },
  })

  await eventBus.emit({
    name: 'fulfillment.delivered',
    data: {
      fulfillment_id: fulfillment.id,
      shipment_number: fulfillmentData.shipment_number,
      delivered_at: deliveredAt.toISOString(),
      status: newStatus,
    },
  })
}

async function handleFailed(
  ctx: TrackingContext,
  fulfillment: PendingFulfillment,
  info: PplShipmentInfo,
  newStatus: PplShipmentState
): Promise<void> {
  const { logger, fulfillmentService, eventBus } = ctx
  const fulfillmentData = fulfillment.data

  logger.warn(
    `PPL: Shipment ${fulfillmentData.shipment_number} failed (${newStatus})`
  )

  await fulfillmentService.updateFulfillment(fulfillment.id, {
    data: {
      ...fulfillmentData,
      last_status: newStatus,
      last_status_date: info.stateDate,
      delivery_failed: true,
    },
  })

  await eventBus.emit({
    name: 'fulfillment.delivery_failed',
    data: {
      fulfillment_id: fulfillment.id,
      shipment_number: fulfillmentData.shipment_number,
      status: newStatus,
      status_date: info.stateDate,
    },
  })
}

async function handleInTransit(
  ctx: TrackingContext,
  fulfillment: PendingFulfillment,
  info: PplShipmentInfo,
  newStatus: PplShipmentState
): Promise<void> {
  const { logger, fulfillmentService } = ctx
  const fulfillmentData = fulfillment.data

  logger.debug(
    `PPL: Shipment ${fulfillmentData.shipment_number} status: ${newStatus}`
  )

  await fulfillmentService.updateFulfillment(fulfillment.id, {
    data: {
      ...fulfillmentData,
      last_status: newStatus,
      last_status_date: info.stateDate,
    },
  })
}
