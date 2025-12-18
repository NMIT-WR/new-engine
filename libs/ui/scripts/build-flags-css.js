#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { compile } from "tailwindcss"

const require = createRequire(import.meta.url)

const scriptFilePath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptFilePath), "..")

const flagsEntryPath = path.join(packageRoot, "src/tokens/flags.css")
const flagsMappingPath = path.join(packageRoot, "src/icons/flags.ts")
const outputPath = path.join(packageRoot, "dist/flags.css")

function extractFlagIconClasses(source) {
  const matches =
    source.match(/icon-\[flag--[a-z0-9]+(?:-[a-z0-9]+)*-4x3\]/g) ?? []
  return Array.from(new Set(matches)).sort()
}

async function loadStylesheet(id, base) {
  const resolvedPath = id.startsWith(".")
    ? path.resolve(base, id)
    : require.resolve(id, { paths: [base] })

  const content = await fs.readFile(resolvedPath, "utf8")
  return { path: resolvedPath, base: path.dirname(resolvedPath), content }
}

async function loadModule(id, base) {
  const resolvedPath = id.startsWith(".")
    ? path.resolve(base, id)
    : require.resolve(id, { paths: [base] })

  const imported = await import(resolvedPath)
  return {
    path: resolvedPath,
    base: path.dirname(resolvedPath),
    module: imported.default ?? imported,
  }
}

async function main() {
  const [entrySource, mappingSource] = await Promise.all([
    fs.readFile(flagsEntryPath, "utf8"),
    fs.readFile(flagsMappingPath, "utf8"),
  ])

  const candidates = extractFlagIconClasses(mappingSource)
  if (candidates.length === 0) {
    throw new Error(`No flag icon classes found in ${flagsMappingPath}`)
  }

  const compiler = await compile(entrySource, {
    base: packageRoot,
    from: flagsEntryPath,
    loadStylesheet,
    loadModule,
  })

  const css = compiler.build(candidates)

  if (css.trim().length === 0) {
    throw new Error(
      "Generated flag CSS is empty - check Tailwind configuration and candidates"
    )
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, css)

  console.log(
    `Generated flags CSS: ${css.length} bytes (${candidates.length} candidates)`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
