import type { Locator, Page } from '@playwright/test'

const ROOT_SELECTOR = '#storybook-root'
const DISABLE_ANIMATIONS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`

export async function openStory(
  page: Page,
  storyId: string,
): Promise<Locator> {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`)
  await page.waitForSelector(ROOT_SELECTOR, { state: 'visible' })
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root')
    return root && root.children.length > 0
  })
  await page.addStyleTag({ content: DISABLE_ANIMATIONS })
  await page.evaluate(() => document.fonts.ready)
  return page.locator(ROOT_SELECTOR)
}
