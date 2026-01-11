import type { TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { openStory } from './helpers/storybook'

const snapshotName = (storyId: string, testInfo: TestInfo) =>
  `${storyId}-${testInfo.project.name}-${process.platform}.png`

test.describe('Storybook visual smoke', () => {
  test('Atoms/Button: Playground', async ({ page }, testInfo) => {
    const root = await openStory(page, 'atoms-button--playground')
    await expect(root).toHaveScreenshot(
      snapshotName('atoms-button--playground', testInfo),
    )
  })

  test('Atoms/Badge: Info', async ({ page }, testInfo) => {
    const root = await openStory(page, 'atoms-badge--info')
    await expect(root).toHaveScreenshot(
      snapshotName('atoms-badge--info', testInfo),
    )
  })

  test('Atoms/Checkbox: Default', async ({ page }, testInfo) => {
    const root = await openStory(page, 'atoms-checkbox--default')
    await expect(root).toHaveScreenshot(
      snapshotName('atoms-checkbox--default', testInfo),
    )
  })
})
