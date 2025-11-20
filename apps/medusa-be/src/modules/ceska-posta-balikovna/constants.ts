export const CESKA_POSTA_BALIKOVNA_IDENTIFIER = 'ceska-posta-balikovna'
export const CESKA_POSTA_BALIKOVNA_PLUGIN_ID = 'balikovna'
export const CESKA_POSTA_BALIKOVNA_PROVIDER_ID = `${CESKA_POSTA_BALIKOVNA_IDENTIFIER}_${CESKA_POSTA_BALIKOVNA_PLUGIN_ID}`

export const BALIKOVNA_SERVICE = {
  NB: 'NB',
  ND: 'ND',
} as const

export type BalikovnaServiceType =
  (typeof BALIKOVNA_SERVICE)[keyof typeof BALIKOVNA_SERVICE]
