import type { Producer } from '@/types/product'
import type { ParsedProducerInfo, ProducerEntity } from '@/types/product-page'

export const parseProducerData = (
  attributes?: Producer['attributes']
): ParsedProducerInfo | null => {

  if (!attributes || attributes.length === 0) {
    return null
  }

  const sizingAttr = attributes.find(
    (attr) => attr.attributeType?.name === 'sizing_info'
  )

  if (!sizingAttr?.value) {
    return null
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(sizingAttr.value, 'text/html')

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      console.error('[parseProducerData] HTML parsing failed')
      return null
    }

    const firstLink = doc.querySelector('a')
    const sizingGuideUrl = firstLink?.href || undefined
    const paragraphs = Array.from(doc.querySelectorAll('p'))
    const manufacturerIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Výrobce:')
    )

    const responsibleIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Osoba zodpovědná')
    )

    const distributorIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Distributor do ČR:')
    )

    let manufacturer: ProducerEntity | undefined

    if (manufacturerIndex > -1) {
      // Get paragraphs between manufacturerIndex and next section
      const endIndex =
        responsibleIndex > -1
          ? responsibleIndex
          : distributorIndex > -1
            ? distributorIndex
            : paragraphs.length

      const manufacturerParagraphs = paragraphs.slice(
        manufacturerIndex,
        endIndex
      )

      manufacturer = parseManufacturerSection(manufacturerParagraphs)
    }

    let responsiblePerson: ProducerEntity | undefined

    if (responsibleIndex > -1) {
      const endIndex =
        distributorIndex > -1 ? distributorIndex : paragraphs.length

      const responsibleParagraphs = paragraphs.slice(responsibleIndex, endIndex)

      responsiblePerson = parseResponsibleSection(responsibleParagraphs)
    }

    let distributor: string | undefined

    if (distributorIndex > -1) {
      distributor = extractDistributor(paragraphs[distributorIndex])
    }

    return {
      sizingGuideUrl,
      manufacturer,
      responsiblePerson,
      distributor,
    }
  } catch (error) {
    console.error('[parseProducerData] Unexpected error:', error)
    return null
  }
}

function findTaxId(paragraphs: Element[]): string | undefined {
  return paragraphs
    .find((p) => p.textContent?.includes('TAX ID:'))
    ?.textContent?.replace(/TAX ID:\s*/i, '')
    .trim()
}

function findEmail(paragraphs: Element[]): string | undefined {
  const emailElement = paragraphs.find((p) => p.querySelector('a'))
  return (
    emailElement?.querySelector('a')?.textContent?.trim() ||
    paragraphs.find((p) => p.textContent?.includes('@'))?.textContent?.trim()
  )
}

function findPhone(paragraphs: Element[]): string | undefined {
  return paragraphs
    .find((p) => p.textContent?.includes('Tel:'))
    ?.textContent?.replace(/Tel:\s*/i, '')
    .trim()
}

function parseManufacturerSection(
  paragraphs: Element[]
): ProducerEntity | undefined {
  if (paragraphs.length === 0) return undefined

  const name =
    paragraphs[0]?.textContent?.replace(/^.*Výrobce:\s*/, '').trim() || ''

  if (!name) return undefined

  const addressParts = [
    paragraphs[1]?.textContent?.trim(),
    paragraphs[2]?.textContent?.trim(),
  ].filter(Boolean)

  const address = addressParts.join(', ')

  const taxId = findTaxId(paragraphs)
  const email = findEmail(paragraphs)
  const phone = findPhone(paragraphs)

  return {
    name,
    address,
    taxId,
    email,
    phone,
  }
}


function parseResponsibleSection(
  paragraphs: Element[]
): ProducerEntity | undefined {
  if (paragraphs.length < 2) return undefined

  const name = paragraphs[1]?.textContent?.trim() || ''

  if (!name) return undefined

  const address = paragraphs[2]?.textContent?.trim() || ''

  // Use helper functions to extract contact details
  const taxId = findTaxId(paragraphs)
  const email = findEmail(paragraphs)
  const phone = findPhone(paragraphs)

  return {
    name,
    address,
    taxId,
    email,
    phone,
  }
}

function extractDistributor(paragraph: Element): string | undefined {
  const text = paragraph.textContent?.trim()
  if (!text) return undefined

  return text.replace(/^.*Distributor do ČR:\s*/i, '').trim() || undefined
}
