export type ProducerEntity = {
  name: string
  address: string
  taxId?: string
  email?: string
  phone?: string
}

export type ParsedProducerInfo = {
  sizingGuideUrl?: string
  manufacturer?: ProducerEntity
  responsiblePerson?: ProducerEntity
  distributor?: string
}
