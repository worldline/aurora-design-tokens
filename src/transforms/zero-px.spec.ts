import type { TransformedToken } from 'style-dictionary/types'
import { describe, it, expect } from 'vitest'

import { zeroPx } from './zero-px.ts'

describe('zeroPx', () => {
  it('should convert 0px to 0', () => {
    const token = createToken({
      $type: 'dimension',
      $value: '0px',
    })
    expect(zeroPx.filter(token)).toBe(true)
    expect(zeroPx.transform(token)).toBe('0')
  })

  it('should not convert non-0px values', () => {
    const token = createToken({
      $type: 'dimension',
      $value: '8px',
    })
    expect(zeroPx.filter(token)).toBe(true)
    expect(zeroPx.transform(token)).toBe('8px')
  })

  it('should not affect non-dimension tokens', () => {
    const token = createToken({
      $type: 'color',
      $value: '#fff',
    })
    expect(zeroPx.filter(token)).toBe(false)
  })

  const createToken = (token: Partial<TransformedToken>): TransformedToken => ({
    name: '',
    path: [],
    original: {},
    filePath: '',
    isSource: false,
    ...token,
  })
})
