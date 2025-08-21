#!/usr/bin/env node

/**
 * Token Definition Validation Script
 * 
 * Identifies unused tokens with smart exception handling.
 * Analyzes dependency graphs and reference chains to determine actual usage.
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

// Configuration for validation
const CONFIG = {
  // Tokens to always consider "used" (whitelist)
  whitelistPatterns: [
    /^--color-primary$/,
    /^--color-secondary$/,
    /^--color-danger$/,
    /^--color-warning$/,
    /^--color-success$/,
    /^--color-info$/,
    /^--spacing-(xs|sm|md|lg|xl)$/,
    /^--text-(xs|sm|md|lg|xl)$/,
    /^--radius-(sm|md|lg)$/,
    // Base system tokens
    /^--color-.*-(50|100|200|300|400|500|600|700|800|900)$/,
    /^--state-(hover|focus|active|disabled)$/
  ],
  
  // Patterns to ignore completely
  ignorePatterns: [
    /^--tw-/, // Tailwind internal variables
    /_test$/,
    /_debug$/
  ],
  
  // File patterns to exclude from usage scanning
  excludeFiles: [
    '**/*.stories.tsx',
    '**/*.test.tsx',
    '**/*.spec.tsx',
    '**/node_modules/**'
  ]
}

/**
 * Parse CSS tokens from a file
 */
function parseTokensFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const tokens = new Map()
  
  // Match CSS custom properties with their values
  const tokenRegex = /--([\w-]+)\s*:\s*([^;]+);/g
  let match
  
  while ((match = tokenRegex.exec(content)) !== null) {
    const [fullMatch, name, value] = match
    const tokenName = `--${name}`
    
    tokens.set(tokenName, {
      value: value.trim(),
      file: filePath,
      line: content.substring(0, match.index).split('\n').length
    })
  }
  
  return tokens
}

/**
 * Load all defined tokens from CSS files
 */
function loadAllTokens() {
  const allTokens = new Map()
  const tokenFiles = glob.sync('src/tokens/components/**/*.css')
  
  for (const file of tokenFiles) {
    const tokens = parseTokensFromFile(file)
    for (const [name, data] of tokens) {
      allTokens.set(name, data)
    }
  }
  
  return allTokens
}

/**
 * Extract token references from CSS value
 */
function extractTokenReferences(value) {
  const references = new Set()
  
  // Match var() functions
  const varMatches = value.matchAll(/var\(\s*(--[\w-]+)/g)
  for (const match of varMatches) {
    references.add(match[1])
  }
  
  // Match oklch() from function references
  const oklchMatches = value.matchAll(/oklch\([^)]*var\(\s*(--[\w-]+)/g)
  for (const match of oklchMatches) {
    references.add(match[1])
  }
  
  return references
}

/**
 * Build dependency graph of token references
 */
function buildTokenDependencyGraph(allTokens) {
  const dependencyGraph = new Map()
  const reverseDependencyGraph = new Map()
  
  for (const [tokenName, tokenData] of allTokens) {
    const references = extractTokenReferences(tokenData.value)
    dependencyGraph.set(tokenName, references)
    
    // Build reverse dependencies
    for (const ref of references) {
      if (!reverseDependencyGraph.has(ref)) {
        reverseDependencyGraph.set(ref, new Set())
      }
      reverseDependencyGraph.get(ref).add(tokenName)
    }
  }
  
  return { dependencyGraph, reverseDependencyGraph }
}

/**
 * Map CSS token to possible Tailwind utility classes
 */
function tokenToUtilityClasses(tokenName) {
  const classes = new Set()
  
  // Simplified token parsing
  const tokenParts = tokenName.slice(2).split('-') // Remove '--' and split
  if (tokenParts.length < 2) return classes
  
  const primaryNamespace = tokenParts[0]
  const subNamespace = tokenParts.length > 2 ? tokenParts[1] : null
  const key = tokenParts.slice(subNamespace ? 2 : 1).join('-')
  
  // Complete namespace to utility prefix mappings per Tailwind v4 docs
  const mappings = {
    // Color namespace - most extensive
    'color': [
      'bg', 'text', 'border', 'outline', 'decoration', 'shadow', 'inset-shadow',
      'ring', 'ring-offset', 'inset-ring', 'accent', 'caret', 'fill', 'stroke'
    ],
    
    // Spacing namespace - very extensive (general spacing)
    'spacing': [
      // Padding
      'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe',
      // Margin (including negative variants)
      'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
      '-m', '-mx', '-my', '-mt', '-mr', '-mb', '-ml', '-ms', '-me',
      // Width & Height
      'w', 'h', 'min-w', 'min-h', 'max-w', 'max-h',
      // Position
      'inset', 'inset-x', 'inset-y', 'top', 'right', 'bottom', 'left', 'start', 'end',
      '-inset', '-inset-x', '-inset-y', '-top', '-right', '-bottom', '-left', '-start', '-end',
      // Layout
      'gap', 'space-x', 'space-y'
    ],
    
    // Specific spacing namespaces (more specific than general spacing)
    'padding': [
      'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe'
    ],
    'margin': [
      'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
      '-m', '-mx', '-my', '-mt', '-mr', '-mb', '-ml', '-ms', '-me'
    ],
    'gap': ['gap'],
    
    // Width namespace (when not using spacing)
    'width': ['w', 'min-w', 'max-w'],
    
    // Height namespace (when not using spacing)  
    'height': ['h', 'min-h', 'max-h'],
    
    // Typography
    'text': ['text'], // Font size
    'font': ['font'], // Font family
    'tracking': ['tracking'], // Letter spacing
    'leading': ['leading'], // Line height
    
    // Border & Effects
    'radius': ['rounded'],
    'shadow': ['shadow'],
    'inset-shadow': ['inset-shadow'],
    'drop-shadow': ['drop-shadow'],
    'blur': ['blur'],
    'perspective': ['perspective'],
    
    // Layout
    'aspect': ['aspect'],
    
    // Animation
    'ease': ['ease'],
    'animate': ['animate'],
    
    // Other
    'opacity': ['opacity'],
    'border': ['border'],
    
    // Special cases that don't map to utilities directly
    'z': [], // z-index values, handled differently
    'arrow': [], // Custom properties for arrows, not utilities
    'tree': [], // Custom component-specific properties
    'textarea': [], // Custom component properties
    'tooltip': [] // Custom component properties
  }
  
  // Simplified namespace and key handling
  let namespace = primaryNamespace
  let tokenKey = key
  
  // Handle special font-weight case
  if (primaryNamespace === 'font' && subNamespace === 'weight') {
    namespace = 'font-weight'
  } else if (subNamespace && mappings[`${primaryNamespace}-${subNamespace}`]) {
    namespace = `${primaryNamespace}-${subNamespace}`
  } else if (subNamespace) {
    tokenKey = `${subNamespace}-${key}`
  }
  
  // Skip custom properties that don't map to utilities
  const customPropertyPrefixes = [
    'arrow', 'tree', 'tooltip', 'textarea', 'z', 'opacity-bg', 'opacity-borderless',
    'spacing-translate', 'spacing-pc', 'spacing-menu-submenu'
  ]
  
  if (customPropertyPrefixes.some(prefix => tokenName.includes(`--${prefix}`))) {
    return classes
  }
  
  const prefixes = mappings[namespace] || mappings[primaryNamespace] || []
  
  for (const prefix of prefixes) {
    if (namespace === 'font-weight') {
      // Special case: --font-weight-bold → font-bold (strip "weight")
      classes.add(`font-${tokenKey}`)
    } else {
      classes.add(`${prefix}-${tokenKey}`)
    }
  }
  
  return classes
}

/**
 * Search for token usage in component files (cached version)
 */
function findTokenUsageInComponentsCache(tokenName, componentFilesCache) {
  const usage = new Set()
  const possibleClasses = tokenToUtilityClasses(tokenName)
  
  if (possibleClasses.size === 0) return usage
  
  for (const [file, content] of componentFilesCache) {
    // Check for direct var() usage
    if (content.includes(`var(${tokenName})`)) {
      usage.add(`${file} (direct var() reference)`)
    }
    
    // Check for utility class usage (simplified patterns)
    for (const className of possibleClasses) {
      const escapedClass = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      
      // Simplified patterns - covers most cases
      const patterns = [
        // Matches: 'class', hover:class, data-[...]:class, sm:class
        new RegExp(`\\b(?:[a-z-]+:|data-\\[[^\\]]+\\]:|(?:sm|md|lg|xl|2xl):)?${escapedClass}\\b`),
        // Matches inside quotes with optional spacing
        new RegExp(`['"\`][^'"\`]*\\s${escapedClass}\\s[^'"\`]*['"\`]`)
      ]
      
      for (const pattern of patterns) {
        const match = content.search(pattern)
        if (match !== -1) {
          // Efficient line number calculation
          const lineNumber = content.substring(0, match).split('\n').length
          usage.add(`${file}:${lineNumber} (class: ${className})`)
          break
        }
      }
    }
  }
  
  return usage
}

/**
 * Search for token usage in CSS files (var() references)
 */
function findTokenUsageInCSS(tokenName, allTokens) {
  const usage = new Set()
  
  // Check usage in other tokens (reuse already loaded token data)
  for (const [otherTokenName, tokenData] of allTokens) {
    if (otherTokenName === tokenName) continue
    
    if (tokenData.value.includes(`var(${tokenName})`)) {
      usage.add(`${tokenData.file}:${tokenData.line} (referenced by ${otherTokenName})`)
    }
  }
  
  // Check usage directly in CSS properties using already loaded files
  const processedFiles = new Set()
  
  for (const [, tokenData] of allTokens) {
    const file = tokenData.file
    if (processedFiles.has(file)) continue
    
    processedFiles.add(file)
    
    try {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n')
      
      lines.forEach((line, index) => {
        // Skip custom property definitions
        if (line.trim().startsWith(`${tokenName}:`)) return
        
        // Look for var() usage in CSS properties
        if (line.includes(`var(${tokenName})`) && !line.includes(`${tokenName}:`)) {
          usage.add(`${file}:${index + 1} (CSS property)`)
        }
      })
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  return usage
}

/**
 * Check if token should be whitelisted
 */
function isWhitelisted(tokenName) {
  return CONFIG.whitelistPatterns.some(pattern => pattern.test(tokenName))
}

/**
 * Check if token should be ignored
 */
function shouldIgnoreToken(tokenName) {
  return CONFIG.ignorePatterns.some(pattern => pattern.test(tokenName))
}

/**
 * Find all tokens that depend on a given token (recursive)
 */
function findDependentTokens(tokenName, reverseDependencyGraph, visited = new Set()) {
  if (visited.has(tokenName)) return new Set()
  
  visited.add(tokenName)
  const dependents = new Set()
  
  const directDependents = reverseDependencyGraph.get(tokenName) || new Set()
  for (const dependent of directDependents) {
    dependents.add(dependent)
    const transitiveDependents = findDependentTokens(dependent, reverseDependencyGraph, visited)
    for (const transitive of transitiveDependents) {
      dependents.add(transitive)
    }
  }
  
  return dependents
}

/**
 * Main validation function
 */
function validateTokenDefinitions() {
  console.log('🔍 Analyzing token definitions and usage...')
  
  const allTokens = loadAllTokens()
  console.log(`📋 Found ${allTokens.size} total tokens\n`)
  
  const { dependencyGraph, reverseDependencyGraph } = buildTokenDependencyGraph(allTokens)
  
  // Cache component files content for reuse
  const componentFilesCache = new Map()
  const componentFiles = glob.sync('src/**/*.{ts,tsx}', {
    ignore: CONFIG.excludeFiles
  })
  
  for (const file of componentFiles) {
    try {
      componentFilesCache.set(file, fs.readFileSync(file, 'utf8'))
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}: ${error.message}`)
    }
  }
  
  const unusedTokens = []
  const usedTokens = new Set()
  let checkedCount = 0
  
  for (const [tokenName, tokenData] of allTokens) {
    checkedCount++
    
    if (shouldIgnoreToken(tokenName)) {
      continue
    }
    
    if (isWhitelisted(tokenName)) {
      usedTokens.add(tokenName)
      continue
    }
    
    // Check component usage with cached content
    const componentUsage = findTokenUsageInComponentsCache(tokenName, componentFilesCache)
    
    // Check CSS usage
    const cssUsage = findTokenUsageInCSS(tokenName, allTokens)
    
    const totalUsage = new Set([...componentUsage, ...cssUsage])
    
    if (totalUsage.size > 0) {
      usedTokens.add(tokenName)
    } else {
      // Check if any dependent tokens are used
      const dependents = findDependentTokens(tokenName, reverseDependencyGraph)
      const usedDependents = Array.from(dependents).filter(dep => usedTokens.has(dep))
      
      if (usedDependents.length > 0) {
        usedTokens.add(tokenName)
      } else {
        unusedTokens.push({
          name: tokenName,
          file: tokenData.file,
          line: tokenData.line,
          value: tokenData.value
        })
      }
    }
  }
  
  // Report results
  console.log(`\n📊 Validation Summary:`)
  console.log(`   Total tokens: ${allTokens.size}`)
  console.log(`   Used tokens: ${usedTokens.size}`)
  console.log(`   Unused tokens: ${unusedTokens.length}`)
  
  if (unusedTokens.length === 0) {
    console.log('\n✅ All tokens are being used!')
    return true
  } else {
    console.log(`\n⚠️  Found ${unusedTokens.length} potentially unused tokens:\n`)
    
    // Group by file
    const tokensByFile = new Map()
    for (const token of unusedTokens) {
      if (!tokensByFile.has(token.file)) {
        tokensByFile.set(token.file, [])
      }
      tokensByFile.get(token.file).push(token)
    }
    
    for (const [file, tokens] of tokensByFile) {
      console.log(`📄 ${file}:`)
      for (const token of tokens) {
        console.log(`  Line ${token.line}: ${token.name} = ${token.value}`)
      }
      console.log()
    }
    
    console.log('💡 Note: These tokens might be used in ways not detected by this script.')
    console.log('   Consider:\n   - Dynamic class generation\n   - External usage\n   - Future planned usage\n')
    
    return false
  }
}

/**
 * Run validation
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const success = validateTokenDefinitions()
    process.exit(success ? 0 : 1)
  } catch (error) {
    console.error('💥 Validation failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

export { validateTokenDefinitions, buildTokenDependencyGraph, findTokenUsageInComponentsCache }