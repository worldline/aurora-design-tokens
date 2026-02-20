import type { TransformedToken } from 'style-dictionary/types'
import { describe, it, expect } from 'vitest'

import { reverseShadowOrder } from './reverse-shadow-order.ts'

describe('reverseShadowOrder', () => {
  it('should reverse the order of shadow values in an array', () => {
    const token = createToken({
      $type: 'shadow',
      $value: [shadow1, shadow2, shadow3],
    })

    expect(reverseShadowOrder.filter(token)).toBe(true)
    expect(reverseShadowOrder.transform(token)).toEqual([
      shadow3,
      shadow2,
      shadow1,
    ])
  })

  it('should handle a single shadow value', () => {
    const token = createToken({
      $type: 'shadow',
      $value: [shadow1],
    })

    expect(reverseShadowOrder.filter(token)).toBe(true)
    expect(reverseShadowOrder.transform(token)).toEqual([shadow1])
  })

  it('should only filter shadow tokens with array values', () => {
    const token = createToken({
      $type: 'shadow',
      $value: [shadow1],
    })
    expect(reverseShadowOrder.filter(token)).toBe(true)
  })

  it('should not filter shadow tokens with non-array values', () => {
    const token = createToken({
      $type: 'shadow',
      $value: shadow1,
    })
    expect(reverseShadowOrder.filter(token)).toBe(false)
  })

  it('should not filter non-shadow tokens', () => {
    const colorToken = createToken({
      $type: 'color',
      $value: '#fff',
    })
    expect(reverseShadowOrder.filter(colorToken)).toBe(false)
  })

  it('should handle empty shadow array', () => {
    const token = createToken({
      $type: 'shadow',
      $value: [],
    })

    expect(reverseShadowOrder.filter(token)).toBe(true)
    expect(reverseShadowOrder.transform(token)).toEqual([])
  })

  const createToken = (token: Partial<TransformedToken>): TransformedToken => ({
    name: '',
    path: [],
    original: {},
    filePath: '',
    isSource: false,
    ...token,
  })

  const shadow1 = {
    offsetX: '0px',
    offsetY: '1px',
    blur: '2px',
    spread: '0px',
    color: '#000',
  }

  const shadow2 = {
    offsetX: '0px',
    offsetY: '4px',
    blur: '8px',
    spread: '0px',
    color: '#000',
  }

  const shadow3 = {
    offsetX: '0px',
    offsetY: '8px',
    blur: '16px',
    spread: '0px',
    color: '#000',
  }
})
