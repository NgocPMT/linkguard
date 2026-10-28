import { describe, expect, it } from 'bun:test'
import { formatDuration, isValidHttpUrl, normalizeUrl } from '../../src/shared/utils'

describe('URL & Utility Helpers', () => {
  it('validates http and https protocols', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true)
    expect(isValidHttpUrl('http://localhost:3000')).toBe(true)
    expect(isValidHttpUrl('ftp://example.com')).toBe(false)
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isValidHttpUrl('invalid-url')).toBe(false)
  })

  it('normalizes relative URLs against a base URL', () => {
    const base = 'https://example.com/blog/'
    expect(normalizeUrl('/about', base)).toBe('https://example.com/about')
    expect(normalizeUrl('post-1', base)).toBe('https://example.com/blog/post-1')
    expect(normalizeUrl('../contact', base)).toBe('https://example.com/contact')
  })

  it('strips url fragment hashes and trailing slashes', () => {
    expect(normalizeUrl('https://example.com/page/#section')).toBe('https://example.com/page')
    expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page')
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/')
  })

  it('formats millisecond durations cleanly', () => {
    expect(formatDuration(450)).toBe('450ms')
    expect(formatDuration(1500)).toBe('1.5s')
    expect(formatDuration(3200)).toBe('3.2s')
  })
})
