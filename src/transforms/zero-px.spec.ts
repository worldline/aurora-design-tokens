import type { TransformedToken } from 'style-dictionary/types'
import { describe, it, expect } from 'vitest'

import { zeroPx } from './zero-px.ts'

describe('zeroPx', () => {
  describe('dimension tokens', () => {
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
  })

  describe('shadow tokens', () => {
    it('should convert 0px values in shadow tokens to 0', () => {
      const token = createToken({
        $type: 'shadow',
        $value: [
          {
            offsetX: '0px',
            offsetY: '4px',
            blur: '0px',
            spread: '2px',
            color: '#000',
          },
        ],
      })
      expect(zeroPx.filter(token)).toBe(true)
      expect(zeroPx.transform(token)).toEqual([
        {
          offsetX: '0',
          offsetY: '4px',
          blur: '0',
          spread: '2px',
          color: '#000',
        },
      ])
    })
  })

  it('should only affect dimension and shadow tokens', () => {
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
