import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { gradient } from './gradient.ts'

describe('gradient', () => {
  it('should convert linear gradient token to css linear-gradient', () => {
    const token = createToken({
      $type: 'gradient',
      $value: {
        type: 'linear',
        angle: 180,
        stops: [
          { color: '#fff', position: 0 },
          { color: '#000', position: 1 },
        ],
      },
    })
    expect(gradient.filter(token)).toBe(true)
    expect(gradient.transform(token)).toBe(
      'linear-gradient(180deg, #fff 0%, #000 100%)',
    )
  })

  it('should convert radial gradient token to css radial-gradient', () => {
    const token = createToken({
      $type: 'gradient',
      $value: {
        type: 'radial',
        angle: 0,
        stops: [
          { color: '#fff', position: 0 },
          { color: '#000', position: 1 },
        ],
      },
    })
    expect(gradient.filter(token)).toBe(true)
    expect(gradient.transform(token)).toBe(
      'radial-gradient(circle, #fff 0%, #000 100%)',
    )
  })

  it('should throw error for invalid gradient token value', () => {
    const token = createToken({
      $type: 'gradient',
      $value: {
        invalid: 'value',
      },
    })
    expect(gradient.filter(token)).toBe(true)
    expect(() => gradient.transform(token)).toThrow(
      'Invalid gradient token at path: gradients.gradient-1',
    )
  })

  it('should throw error for gradient token with invalid stops', () => {
    const token = createToken({
      $type: 'gradient',
      $value: {
        type: 'linear',
        angle: 90,
        stops: [{ color: '#fff', position: 0 }, { color: '#000' }],
      },
    })
    expect(gradient.filter(token)).toBe(true)
    expect(() => gradient.transform(token)).toThrow(
      'Invalid gradient token at path: gradients.gradient-1',
    )
  })

  it('should not affect non-gradient tokens', () => {
    const token = createToken({
      $type: 'color',
      $value: '#fff',
    })
    expect(gradient.filter(token)).toBe(false)
  })

  const createToken = (token: Partial<TransformedToken>): TransformedToken => ({
    name: '',
    path: ['gradients', 'gradient-1'],
    original: {},
    filePath: '',
    isSource: false,
    ...token,
  })
})
