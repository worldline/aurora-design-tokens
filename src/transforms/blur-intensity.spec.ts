import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { blurIntensity } from './blur-intensity.ts'

describe('blurIntensity', () => {
  describe('filter', () => {
    it('should match blur tokens', () => {
      const token = { $type: 'blur' } as TransformedToken
      expect(blurIntensity.filter(token)).toBe(true)
    })

    it('should not match non-blur tokens', () => {
      const token = { $type: 'dimension' } as TransformedToken
      expect(blurIntensity.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    it('should convert px blur to Expo-inspired intensity when string', () => {
      const token = { $type: 'blur', $value: '16px' } as TransformedToken
      expect(blurIntensity.transform(token)).toBe(80)
    })

    it('should convert px blur to Expo-inspired intensity when number', () => {
      const token = { $type: 'blur', $value: 16 } as unknown as TransformedToken
      expect(blurIntensity.transform(token)).toBe(80)
    })

    it('should cap intensity at 100', () => {
      const token = { $type: 'blur', $value: '30px' } as TransformedToken
      expect(blurIntensity.transform(token)).toBe(100)
    })

    it('should round to nearest integer', () => {
      const token = { $type: 'blur', $value: '5px' } as TransformedToken
      expect(blurIntensity.transform(token)).toBe(25)
    })

    it('should throw for non-numeric values', () => {
      const token = {
        $type: 'blur',
        $value: 'auto',
        path: ['overlay-background-blur'],
      } as TransformedToken
      expect(() => blurIntensity.transform(token)).toThrow(
        "Invalid blur token at path: overlay-background-blur: Value 'auto' could not be converted to a number.",
      )
    })
  })
})
