/**
 * Default product list fields for Medusa API
 */
export const PRODUCT_LIST_FIELDS =
  'id,title,handle,thumbnail,' +
  'variants.title,' +
  'variants.manage_inventory,' +
  'variants.inventory_quantity,' +
  'variants.calculated_price,'

/**
 * Detailed product fields for single product view
 */
export const PRODUCT_DETAILED_FIELDS =
  'id,title,subtitle,description,handle,thumbnail,images.id,images.url,' +
  'producer.title,producer.attributes.value,producer.attributes.attributeType.name,' +
  'variants.id,variants.title,variants.sku,variants.ean,variants.upc,' +
  'variants.material,variants.allow_backorder,variants.manage_inventory,' +
  'variants.inventory_quantity,' +
  'variants.calculated_price,' +
  'categories.id,categories.parent_category_id'

/**
 * Default product limit per page
 */
export const PRODUCT_LIMIT = 24

/**
 * Default country code
 */
export const DEFAULT_COUNTRY_CODE = 'cz'

/**
 * Default currency
 */
export const DEFAULT_CURRENCY = 'czk'
