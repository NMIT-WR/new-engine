#!/usr/bin/env node

/**
 * Token Usage Validation Script
 * 
 * Validates that all Tailwind classes in components have corresponding token definitions.
 * Follows Tailwind v4 theme variable namespace rules for precise mapping.
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

// Tailwind v4 namespace to utility prefix mappings
const NAMESPACE_MAPPINGS = {
  'color': ['bg', 'text', 'border', 'fill', 'stroke', 'outline', 'ring', 'shadow', 'accent', 'caret', 'decoration'],
  'spacing': ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'gap', 'w', 'h', 'max-w', 'min-w', 'max-h', 'min-h', 'top', 'right', 'bottom', 'left', 'inset'],
  'text': ['text'],
  'font-weight': ['font'],
  'font': ['font'],
  'radius': ['rounded'],
  'shadow': ['shadow', 'drop-shadow'],
  'blur': ['blur'],
  'opacity': ['opacity'],
  'border': ['border']
}

// Standard Tailwind utilities to ignore (not custom tokens)
const IGNORE_PATTERNS = [
  // Layout & positioning
  /^(flex|grid|block|inline|hidden|absolute|relative|fixed|sticky)$/,
  /^(items|justify|content|self)-(start|end|center|stretch|between|around|evenly)$/,
  /^(flex|grid)-(row|col|flow|wrap|nowrap)$/,
  /^(order|col|row)-(start|end|\d+)$/,
  
  // Standard spacing (without custom tokens)
  /^(p|m|gap|w|h|max-w|min-w|max-h|min-h|top|right|bottom|left|inset|space)-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|full|screen|min|max|fit)$/,
  
  // Standard colors including transparent
  /^(bg|text|border)-(transparent|current|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-?\d{0,3}$/,
  /^(bg|text|border)-(transparent|current|black|white|inherit)$/,
  
  // Standard typography
  /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  /^font-(sans|serif|mono)$/,
  /^(leading|tracking)-(none|tight|snug|normal|relaxed|loose|wide|wider|widest)$/,
  
  // Standard borders & effects
  /^(border|rounded)-(none|sm|md|lg|xl|2xl|3xl|full)$/,
  /^border-(0|2|4|8)$/,
  /^shadow-(sm|md|lg|xl|2xl|inner|none)$/,
  /^opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/,
  
  // Pseudo-classes and state modifiers
  /^(hover|focus|active|disabled|group-hover|group-focus):/,
  /^data-\[.+\]:/,
  
  // Responsive prefixes
  /^(sm|md|lg|xl|2xl):/,
  
  // Transform & animation
  /^(transform|rotate|scale|translate|skew|transition|duration|ease|delay|animate)-.+$/,
  
  // Special edge cases
  /^w-\(--reference-width\)$/,  // Dynamic width references
  /^max-h-\(--available-height\)$/, // Dynamic height references
  /^\*:max-h-\(--available-height\)$/, // Selector prefixes
  /^left-(1\/2)$/, // Fractional positioning
  
  // Misc utilities
  /^(sr-only|not-sr-only|pointer-events|select|resize|appearance|cursor|outline|ring)-.+$/
]

/**
 * Extract Tailwind classes from TypeScript/JSX content
 */
function extractTailwindClasses(content, filePath) {
  const classes = new Set()
  
  // Match className props (string values)
  const classNameMatches = content.matchAll(/className\s*=\s*["'`]([^"'`]+)["'`]/g)
  for (const match of classNameMatches) {
    const classString = match[1]
    classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
  }
  
  // Match className arrays: className: ['class1', 'class2'] or className={['class1', 'class2']}
  const classNameArrayMatches = content.matchAll(/className\s*[:=]\s*(?:\{)?\s*\[([^\]]+)\]/g)
  for (const match of classNameArrayMatches) {
    const arrayContent = match[1]
    // Extract strings from array elements
    const stringMatches = arrayContent.matchAll(/['"`]([^'"`]+)['"`]/g)
    for (const stringMatch of stringMatches) {
      const classString = stringMatch[1]
      classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    }
  }
  
  // Match template literals in className
  const templateMatches = content.matchAll(/className\s*=\s*`([^`]+)`/g)
  for (const match of templateMatches) {
    const classString = match[1]
    // Extract static classes, ignore interpolations
    const staticParts = classString.split(/\$\{[^}]+\}/)
    staticParts.forEach(part => {
      part.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    })
  }
  
  // Match tailwind-variants tv() configurations
  const tvMatches = content.matchAll(/tv\s*\(\s*\{[\s\S]*?\}\s*\)/g)
  for (const match of tvMatches) {
    const tvConfig = match[0]
    
    // Extract from slots (arrays)
    const slotMatches = tvConfig.matchAll(/\[\s*['"`]([^'"`]+)['"`]/g)
    for (const slotMatch of slotMatches) {
      const classString = slotMatch[1]
      classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    }
    
    // Extract from variant values
    const variantMatches = tvConfig.matchAll(/:\s*\{\s*[^}]*['"`]([^'"`]+)['"`]/g)
    for (const variantMatch of variantMatches) {
      const classString = variantMatch[1]
      classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    }
  }
  
  // Match clsx/cn utility calls
  const clsxMatches = content.matchAll(/(?:clsx|cn)\s*\(\s*([^)]+)\)/g)
  for (const match of clsxMatches) {
    const args = match[1]
    const stringMatches = args.matchAll(/['"`]([^'"`]+)['"`]/g)
    for (const stringMatch of stringMatches) {
      const classString = stringMatch[1]
      classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    }
  }
  
  // Match any quoted strings that might be CSS classes (broader approach)
  const quotedStringMatches = content.matchAll(/['"`]([^'"`]*(?:bg-|text-|border-|p-|m-|w-|h-|flex|grid|rounded)[^'"`]*)['"`]/g)
  for (const match of quotedStringMatches) {
    const classString = match[1]
    // Only extract if it looks like CSS classes
    if (/^[a-z-\s:[\]()]+$/i.test(classString)) {
      classString.split(/\s+/).forEach(cls => cls && classes.add(cls.trim()))
    }
  }
  
  return Array.from(classes).filter(cls => cls.length > 0)
}

/**
 * Map Tailwind utility class to possible CSS custom properties
 */
function mapClassToPossibleTokens(className) {
  // Remove state modifiers (hover:, focus:, data-[...]:, etc.)
  const baseClass = className.replace(/^[^:]*:/, '').replace(/^data-\[[^\]]+\]:/, '')
  
  // Parse utility class: prefix-value (non-greedy matching)
  // Match known prefixes first, then everything else as value
  const knownPrefixes = Object.values(NAMESPACE_MAPPINGS).flat()
  let prefix = null
  let value = null
  
  // Try to match against known prefixes (longest first to handle cases like 'ring-offset')
  const sortedPrefixes = knownPrefixes.sort((a, b) => b.length - a.length)
  
  for (const knownPrefix of sortedPrefixes) {
    if (baseClass.startsWith(`${knownPrefix}-`)) {
      prefix = knownPrefix
      value = baseClass.slice(knownPrefix.length + 1) // +1 for the dash
      break
    }
  }
  
  if (!prefix || !value) return []
  
  const possibleTokens = []
  
  // Find which namespaces this prefix could belong to
  for (const [namespace, prefixes] of Object.entries(NAMESPACE_MAPPINGS)) {
    if (prefixes.includes(prefix)) {
      // Special handling for font-weight
      if (namespace === 'font-weight') {
        possibleTokens.push(`--font-weight-${value}`)
      } else {
        possibleTokens.push(`--${namespace}-${value}`)
      }
    }
  }
  
  // Add specific namespace alternatives for spacing-related utilities
  if (['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe'].includes(prefix)) {
    possibleTokens.push(`--padding-${value}`)
  }
  
  if (['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me', '-m', '-mx', '-my', '-mt', '-mr', '-mb', '-ml', '-ms', '-me'].includes(prefix)) {
    possibleTokens.push(`--margin-${value}`)
  }
  
  if (['gap'].includes(prefix)) {
    possibleTokens.push(`--gap-${value}`)
  }
  
  if (['w', 'min-w', 'max-w'].includes(prefix)) {
    possibleTokens.push(`--width-${value}`)
  }
  
  if (['h', 'min-h', 'max-h'].includes(prefix)) {
    possibleTokens.push(`--height-${value}`)
  }
  
  return possibleTokens
}

/**
 * Load all defined tokens from CSS files
 */
function loadDefinedTokens() {
  const tokens = new Set()
  const tokenFiles = glob.sync('src/tokens/**/*.css')
  
  for (const file of tokenFiles) {
    const content = fs.readFileSync(file, 'utf8')
    
    // Match CSS custom properties
    const tokenMatches = content.matchAll(/--([a-z][a-z0-9-]*)\s*:/g)
    for (const match of tokenMatches) {
      tokens.add(`--${match[1]}`)
    }
  }
  
  return tokens
}

/**
 * Check if a class should be ignored
 */
function shouldIgnoreClass(className) {
  // Remove state modifiers for checking
  const baseClass = className.replace(/^[^:]*:/, '').replace(/^data-\[[^\]]+\]:/, '')
  
  return IGNORE_PATTERNS.some(pattern => pattern.test(baseClass))
}

/**
 * Main validation function
 */
function validateTokenUsage() {
  console.log('🔍 Validating token usage in components...\n')
  
  const definedTokens = loadDefinedTokens()
  console.log(`📋 Found ${definedTokens.size} defined tokens`)
  
  const componentFiles = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx']
  })
  
  let totalErrors = 0
  const errorsByFile = new Map()
  
  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8')
    const classes = extractTailwindClasses(content, file)
    const fileErrors = []
    
    for (const className of classes) {
      if (shouldIgnoreClass(className)) continue
      
      const possibleTokens = mapClassToPossibleTokens(className)
      if (possibleTokens.length === 0) continue
      
      // Check if ANY of the possible tokens exists
      const hasMatchingToken = possibleTokens.some(token => definedTokens.has(token))
      
      if (!hasMatchingToken) {
        fileErrors.push({
          className,
          expectedTokens: possibleTokens,
          line: content.split('\n').findIndex(line => line.includes(className)) + 1
        })
      }
    }
    
    if (fileErrors.length > 0) {
      errorsByFile.set(file, fileErrors)
      totalErrors += fileErrors.length
    }
  }
  
  // Report results
  if (totalErrors === 0) {
    console.log('✅ All component classes have corresponding token definitions!')
    return true
  } else {
    console.log(`❌ Found ${totalErrors} missing token definitions:\n`)
    
    for (const [file, errors] of errorsByFile) {
      console.log(`📄 ${file}:`)
      for (const error of errors) {
        const tokenList = error.expectedTokens.join(' OR ')
        console.log(`  Line ${error.line}: ${error.className} → Missing token: ${tokenList}`)
      }
      console.log()
    }
    
    return false
  }
}

/**
 * Run validation
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const success = validateTokenUsage()
    process.exit(success ? 0 : 1)
  } catch (error) {
    console.error('💥 Validation failed:', error.message)
    process.exit(1)
  }
}

export { validateTokenUsage, mapClassToPossibleTokens, extractTailwindClasses }