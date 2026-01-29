import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test as base, type Page } from '@playwright/test'

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
const resetEnv = (process.env.PLAYWRIGHT_PAGE_RESET ?? '').toLowerCase()
const shouldResetBetweenTests =
  resetEnv === ''
    ? true
    : resetEnv === '1' || resetEnv === 'true' || resetEnv === 'yes'

let storybookIndex: StorybookIndex

const test = base.extend<{ workerPage: Page }>({
  workerPage: [
    async ({ browser }, use, testInfo) => {
      const context = await browser.newContext(testInfo.project.use)
      const page = await context.newPage()
      await use(page)
      await context.close()
    },
    { scope: 'worker' },
  ],
})

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
      async ({ workerPage }, workerInfo) => {
        const params = new URLSearchParams({
          id: story.id,
          viewMode: 'story',
        })
        const mask = []

        if (shouldResetBetweenTests) {
          try {
            await workerPage.context().clearCookies()
            await workerPage.goto('about:blank')
            await workerPage.evaluate(() => {
              try {
                localStorage.clear()
                sessionStorage.clear()
              } catch {
                // storage may be unavailable in some contexts
              }
            })
          } catch {
            // reset is best-effort only
          }
        }

        await workerPage.emulateMedia({ reducedMotion: 'reduce' })
        await workerPage.goto(`/iframe.html?${params.toString()}`, {
          waitUntil: 'domcontentloaded',
        })
        await workerPage.waitForSelector('#storybook-root')
        await workerPage.addStyleTag({
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

        // Avoid networkidle here; Storybook keeps background activity that can stall tests.
        await workerPage.waitForFunction(
          () => {
            const root = document.querySelector('#storybook-root')
            return root && root.children.length > 0
          },
          null,
          { timeout: 30_000 },
        )
        await workerPage.evaluate(async () => {
          if (!('fonts' in document)) {
            return
          }
          try {
            await Promise.race([
              // @ts-expect-error - fonts can be missing in some contexts
              document.fonts.ready,
              new Promise((resolve) => setTimeout(resolve, 2000)),
            ])
          } catch {
            // ignore font readiness failures
          }
        })

        try {
          await workerPage.waitForFunction(
            () => {
              const root = document.querySelector('#storybook-root')
              if (!root) return false
              const images = root.querySelectorAll('img')
              if (images.length === 0) return true
              return Array.from(images).every((img) => {
                if (!img.src) return true
                if (img.loading === 'lazy') return true
                return img.complete
              })
            },
            null,
            { timeout: 5000 },
          )
        } catch {
          // image readiness is best-effort; avoid failing on lazy/offscreen images
        }

        const isCarouselStory =
          story.id.startsWith('molecules-carousel--') ||
          story.id.startsWith('templates-carouseltemplate--')
        if (isCarouselStory) {
          await workerPage.evaluate(async () => {
            const groups = Array.from(
              document.querySelectorAll<HTMLElement>(
                '[data-scope="carousel"][data-part="item-group"]',
              ),
            )

            for (const group of groups) {
              group.style.scrollSnapType = 'none'
              group.style.scrollBehavior = 'auto'
              group.scrollLeft = 0
              group.scrollTop = 0
            }

            const waitForStableScroll = async (el: HTMLElement) => {
              let last = el.scrollLeft + el.scrollTop
              for (let i = 0; i < 10; i += 1) {
                await new Promise<void>((resolve) =>
                  requestAnimationFrame(() => resolve()),
                )
                const current = el.scrollLeft + el.scrollTop
                if (Math.abs(current - last) < 1) return
                last = current
              }
            }

            await Promise.all(groups.map((group) => waitForStableScroll(group)))
          })
        }

        await workerPage.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() =>
                requestAnimationFrame(() => resolve()),
              ),
            ),
        )

        if (story.id === 'atoms-button--states') {
          mask.push(
            workerPage.locator('.icon-\\[svg-spinners--ring-resize\\]'),
          )
        }

        // Element screenshots are faster and avoid full-page rendering cost.
        const root = workerPage.locator('#storybook-root')
        await expect(root).toHaveScreenshot(
          `${story.id}-${workerInfo.project.name}-${process.platform}.png`,
          {
            animations: 'disabled',
            ...(mask.length > 0 ? { mask } : {}),
          },
        )
      },
    )
  }
})
