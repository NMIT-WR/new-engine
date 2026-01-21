import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

type StorybookEntry = {
  id: string
  name: string
  title: string
  type: string
}

type StorybookIndex = {
  entries: Record<string, StorybookEntry>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const indexPath = path.resolve(__dirname, '../storybook-static/index.json')

let storybookIndex: StorybookIndex

try {
  const raw = readFileSync(indexPath, 'utf-8')
  storybookIndex = JSON.parse(raw) as StorybookIndex
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    throw new Error(
      "Storybook index.json not found. Run 'pnpm build:storybook' first.",
    )
  }
  throw error
}

const stories = Object.values(
  (storybookIndex as StorybookIndex).entries,
).filter((entry) => entry.type === 'story')

for (const story of stories) {
  test(
    `${story.title} ${story.name} should not have visual regressions`,
    async ({ page }, workerInfo) => {
      const params = new URLSearchParams({
        id: story.id,
        viewMode: 'story',
      })

      await page.goto(`/iframe.html?${params.toString()}`)
      await page.waitForSelector('#storybook-root')
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveScreenshot(
        `${story.id}-${workerInfo.project.name}-${process.platform}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    },
  )
}
