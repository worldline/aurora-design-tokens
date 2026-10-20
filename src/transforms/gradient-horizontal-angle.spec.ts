import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { gradientHorizontalAngle } from './gradient-horizontal-angle.ts'

describe('gradientHorizontalAngle', () => {
  const value = {
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#fff', position: 0 },
      { color: '#000', position: 1 },
    ],
  }

  it('should set the angle to 270 for horizontal linear gradients', () => {
    const token = createToken({
      path: ['gradient', 'surface', 'data', 'horizontal', 'primary'],
      $value: value,
    })
    expect(gradientHorizontalAngle.filter(token)).toBe(true)
    expect(gradientHorizontalAngle.transform(token)).toEqual({
      ...value,
      angle: 270,
    })
  })

  it('should not match gradients outside a horizontal group', () => {
    const token = createToken({
      path: ['gradient', 'surface', 'data', 'primary'],
      $value: value,
    })
    expect(gradientHorizontalAngle.filter(token)).toBe(false)
  })

  it('should not match horizontal radial gradients', () => {
    const token = createToken({
      path: ['gradient', 'surface', 'data', 'horizontal', 'primary'],
      $value: { ...value, type: 'radial' },
    })
    expect(gradientHorizontalAngle.filter(token)).toBe(false)
  })

  it('should not match non-gradient tokens', () => {
    const token = createToken({
      $type: 'spacing',
      path: ['button', 'padding', 'horizontal'],
      $value: '8px',
    })
    expect(gradientHorizontalAngle.filter(token)).toBe(false)
  })

  const createToken = (token: Partial<TransformedToken>): TransformedToken => ({
    name: '',
    path: [],
    $type: 'gradient',
    original: {},
    filePath: '',
    isSource: false,
    ...token,
  })
})
