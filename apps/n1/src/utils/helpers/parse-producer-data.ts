import type { Producer } from '@/types/product'
import type { ParsedProducerInfo, ProducerEntity } from '@/types/product-page'

export const parseProducerData = (
  attributes?: Producer['attributes']
): ParsedProducerInfo | null => {
  // ============================================
  // 1. GUARD CLAUSES - Validate input data
  // ============================================
  if (!attributes || attributes.length === 0) {
    return null
  }

  const sizingAttr = attributes.find(
    (attr) => attr.attributeType?.name === 'sizing_info'
  )

  if (!sizingAttr?.value) {
    return null
  }

  // ============================================
  // 2. HTML PARSING with error handling
  // ============================================
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(sizingAttr.value, 'text/html')

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      console.error('[parseProducerData] HTML parsing failed')
      return null
    }

    // ============================================
    // 3. EXTRACT SIZING GUIDE URL
    // ============================================
    const firstLink = doc.querySelector('a')
    const sizingGuideUrl = firstLink?.href || undefined

    // ============================================
    // 4. GET ALL PARAGRAPHS
    // ============================================
    const paragraphs = Array.from(doc.querySelectorAll('p'))

    // ============================================
    // 5. FIND SECTION INDEXES
    // ============================================
    const manufacturerIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Výrobce:')
    )

    const responsibleIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Osoba zodpovědná')
    )

    const distributorIndex = paragraphs.findIndex((p) =>
      p.textContent?.includes('Distributor do ČR:')
    )

    // ============================================
    // 6. PARSE MANUFACTURER SECTION
    // ============================================
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

    // ============================================
    // 7. PARSE RESPONSIBLE PERSON SECTION
    // ============================================
    let responsiblePerson: ProducerEntity | undefined

    if (responsibleIndex > -1) {
      const endIndex =
        distributorIndex > -1 ? distributorIndex : paragraphs.length

      const responsibleParagraphs = paragraphs.slice(responsibleIndex, endIndex)

      responsiblePerson = parseResponsibleSection(responsibleParagraphs)
    }

    // ============================================
    // 8. EXTRACT DISTRIBUTOR
    // ============================================
    let distributor: string | undefined

    if (distributorIndex > -1) {
      distributor = extractDistributor(paragraphs[distributorIndex])
    }

    // ============================================
    // 9. BUILD AND RETURN RESULT
    // ============================================
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

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parses manufacturer section from paragraphs
 * Expected structure:
 * - P[0]: "Výrobce: VOLCOM SAS1"
 * - P[1]: "Allée Belharra..."
 * - P[2]: "ANGLET, FRANCE"
 * - P[x]: "TAX ID: ..."
 * - P[x]: email (as link or text)
 * - P[x]: "Tel: ..."
 *
 * @param paragraphs - Array of paragraph elements from manufacturer section
 * @returns ProducerEntity or undefined if parsing fails
 */
function parseManufacturerSection(
  paragraphs: Element[]
): ProducerEntity | undefined {
  if (paragraphs.length === 0) return undefined

  // NAME: First paragraph, remove "Výrobce: " prefix
  const name =
    paragraphs[0]?.textContent?.replace(/^.*Výrobce:\s*/, '').trim() || ''

  if (!name) return undefined

  // ADDRESS: Join P[1] + P[2] (address is typically on 2 lines)
  const addressParts = [
    paragraphs[1]?.textContent?.trim(),
    paragraphs[2]?.textContent?.trim(),
  ].filter(Boolean)

  const address = addressParts.join(', ')

  // TAX ID: Find paragraph containing "TAX ID:"
  const taxId = paragraphs
    .find((p) => p.textContent?.includes('TAX ID:'))
    ?.textContent?.replace(/TAX ID:\s*/i, '')
    .trim()

  // EMAIL: Find <a> tag with mailto: or paragraph containing @
  const emailElement = paragraphs.find((p) => p.querySelector('a'))
  const email =
    emailElement?.querySelector('a')?.textContent?.trim() ||
    paragraphs.find((p) => p.textContent?.includes('@'))?.textContent?.trim()

  // PHONE: Find paragraph containing "Tel:"
  const phone = paragraphs
    .find((p) => p.textContent?.includes('Tel:'))
    ?.textContent?.replace(/Tel:\s*/i, '')
    .trim()

  return {
    name,
    address,
    taxId,
    email,
    phone,
  }
}

/**
 * Parses responsible person section
 * Expected structure:
 * - P[0]: "Osoba zodpovědná za prodej v EU:"
 * - P[1]: "LIBERATED BRANDS EUROPE SAS1"
 * - P[2]: "ALLEE BELHARRA..."
 * - P[x]: "TAX ID: ..."
 * - P[x]: email
 * - P[x]: "Tel: ..."
 *
 * @param paragraphs - Array of paragraph elements from responsible person section
 * @returns ProducerEntity or undefined if parsing fails
 */
function parseResponsibleSection(
  paragraphs: Element[]
): ProducerEntity | undefined {
  if (paragraphs.length < 2) return undefined

  // NAME: Second paragraph (first is heading "Osoba zodpovědná...")
  const name = paragraphs[1]?.textContent?.trim() || ''

  if (!name) return undefined

  // ADDRESS: P[2] and possibly more paragraphs before TAX ID
  // For Volcom data, address is on single line
  const address = paragraphs[2]?.textContent?.trim() || ''

  // TAX ID
  const taxId = paragraphs
    .find((p) => p.textContent?.includes('TAX ID:'))
    ?.textContent?.replace(/TAX ID:\s*/i, '')
    .trim()

  // EMAIL
  const emailElement = paragraphs.find((p) => p.querySelector('a'))
  const email =
    emailElement?.querySelector('a')?.textContent?.trim() ||
    paragraphs.find((p) => p.textContent?.includes('@'))?.textContent?.trim()

  // PHONE
  const phone = paragraphs
    .find((p) => p.textContent?.includes('Tel:'))
    ?.textContent?.replace(/Tel:\s*/i, '')
    .trim()

  return {
    name,
    address,
    taxId,
    email,
    phone,
  }
}

/**
 * Extracts distributor text from paragraph
 * Removes "Distributor do ČR:" prefix and returns the rest
 *
 * @param paragraph - Paragraph element containing distributor info
 * @returns Distributor text or undefined if extraction fails
 */
function extractDistributor(paragraph: Element): string | undefined {
  const text = paragraph.textContent?.trim()
  if (!text) return undefined

  // Remove "Distributor do ČR:" prefix
  return text.replace(/^.*Distributor do ČR:\s*/i, '').trim() || undefined
}
