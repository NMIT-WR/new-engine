export interface ProducerEntity {
  name: string
  address: string
  taxId?: string
  email?: string
  phone?: string
}

export interface ParsedProducerInfo {
  sizingGuideUrl?: string
  manufacturer?: ProducerEntity
  responsiblePerson?: ProducerEntity
  distributor?: string
}
