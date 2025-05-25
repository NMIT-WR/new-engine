import { MedusaService } from '@medusajs/framework/utils'
import { DataLayer } from './models/custom'

class DataLayerModuleService extends MedusaService({
  DataLayer,
}) {}

export default DataLayerModuleService
