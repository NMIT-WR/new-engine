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

const storyFilter = (process.env.TEST_STORIES ?? '')
  .split(',')
  .map((storyId) => storyId.trim())
  .filter(Boolean)

const selectedStories =
  storyFilter.length > 0
    ? stories.filter((story) => storyFilter.includes(story.id))
    : stories

if (storyFilter.length > 0 && selectedStories.length === 0) {
  throw new Error(
    `No stories matched TEST_STORIES=${storyFilter.join(',')}`,
  )
}

test.describe.parallel('storybook visual', () => {
  for (const story of selectedStories) {
    test(
      `${story.title} ${story.name} should not have visual regressions`,
      async ({ page }, workerInfo) => {
        const params = new URLSearchParams({
          id: story.id,
          viewMode: 'story',
        })
        const mask = []

        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(`/iframe.html?${params.toString()}`)
        await page.waitForSelector('#storybook-root')
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
              caret-color: transparent !important;
            }
            html {
              scroll-behavior: auto !important;
            }
          `,
        })
        await page.waitForLoadState('networkidle')

        if (story.id === 'atoms-button--states') {
          mask.push(page.locator('.icon-\\[svg-spinners--ring-resize\\]'))
        }

        await expect(page).toHaveScreenshot(
          `${story.id}-${workerInfo.project.name}-${process.platform}.png`,
          {
            fullPage: true,
            animations: 'disabled',
            ...(mask.length > 0 ? { mask } : {}),
          },
        )
      },
    )
  }
})
