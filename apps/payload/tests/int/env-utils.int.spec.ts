import { describe, it, expect, afterEach } from 'vitest'
import { getDocString, getSeoCollections, isEnabled, parseEnvList } from '@/lib/utils/env'

const ORIGINAL_ENV = { ...process.env }

const resetEnv = () => {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key]
    }
  }
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (typeof value === 'string') {
      process.env[key] = value
    }
  }
}

afterEach(() => {
  resetEnv()
})

describe('env utilities', () => {
  it('isEnabled honors defaults and explicit false values', () => {
    delete process.env.TEST_FLAG
    expect(isEnabled('TEST_FLAG', true)).toBe(true)
    expect(isEnabled('TEST_FLAG', false)).toBe(false)

    process.env.TEST_FLAG = 'false'
    expect(isEnabled('TEST_FLAG')).toBe(false)

    process.env.TEST_FLAG = '  OFF '
    expect(isEnabled('TEST_FLAG')).toBe(false)

    process.env.TEST_FLAG = 'yes'
    expect(isEnabled('TEST_FLAG')).toBe(true)
  })

  it('parseEnvList returns a cleaned list', () => {
    process.env.TEST_LIST = 'en, cs , , sk '
    expect(parseEnvList('TEST_LIST')).toEqual(['en', 'cs', 'sk'])

    delete process.env.TEST_LIST
    expect(parseEnvList('TEST_LIST')).toEqual([])
  })

  it('getSeoCollections returns enabled collections', () => {
    expect(getSeoCollections({ isArticlesEnabled: true, isPagesEnabled: true })).toEqual([
      'articles',
      'pages',
    ])
    expect(getSeoCollections({ isArticlesEnabled: true, isPagesEnabled: false })).toEqual([
      'articles',
    ])
    expect(getSeoCollections({ isArticlesEnabled: false, isPagesEnabled: false })).toEqual([])
  })

  it('getDocString returns only string values', () => {
    expect(getDocString('hello')).toBe('hello')
    expect(getDocString(null)).toBe('')
    expect(getDocString(42)).toBe('')
  })
})
