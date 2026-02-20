import type { TransformedToken, PlatformConfig } from 'style-dictionary/types'
import { describe, it, expect } from 'vitest'

import { typographyPxToRem } from './typography-px-to-rem.ts'

describe('typographyPxToRem', () => {
  describe('filter', () => {
    it('should filter dimension tokens with typography.font-sizes path', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'body'],
        $value: '16px',
      } as TransformedToken
      expect(typographyPxToRem.filter(token)).toBeTruthy()
    })

    it('should filter dimension tokens with typography.line-height path', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'line-height', 'normal'],
        $value: '24px',
      } as TransformedToken
      expect(typographyPxToRem.filter(token)).toBeTruthy()
    })

    it('should not filter non-dimension tokens', () => {
      const token = {
        $type: 'color',
        path: ['typography', 'font-sizes', 'body'],
        $value: '#000',
      } as TransformedToken
      expect(typographyPxToRem.filter(token)).toBeFalsy()
    })

    it('should not filter dimension tokens without typography path', () => {
      const token = {
        $type: 'dimension',
        path: ['spacing', 'small'],
        $value: '8px',
      } as TransformedToken
      expect(typographyPxToRem.filter(token)).toBeFalsy()
    })

    it('should not filter dimension tokens with typography path but not font-sizes or line-height', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'spacing'],
        $value: '8px',
      } as TransformedToken
      expect(typographyPxToRem.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    const platform = {} as PlatformConfig
    it('should convert px to rem with default base font size (16)', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'body'],
        $value: '16',
      } as TransformedToken

      expect(typographyPxToRem.transform(token, platform)).toBe('1rem')
    })

    it('should convert px to rem with custom base font size', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'heading'],
        $value: '24',
      } as TransformedToken
      const platformWithBasePxFontSize = {
        basePxFontSize: 12,
      } as PlatformConfig
      expect(
        typographyPxToRem.transform(token, platformWithBasePxFontSize),
      ).toBe('2rem')
    })

    it('should return "0" for zero values', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'line-height', 'none'],
        $value: '0px',
      } as TransformedToken

      expect(typographyPxToRem.transform(token, platform)).toBe('0')
    })

    it('should handle decimal values correctly', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'small'],
        $value: '14',
      } as TransformedToken

      expect(typographyPxToRem.transform(token, platform)).toBe('0.875rem')
    })

    it('should handle string values with px suffix', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'body'],
        $value: '16px',
      } as TransformedToken

      expect(typographyPxToRem.transform(token, platform)).toBe('1rem')
    })

    it('should throw error for invalid (NaN) values', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'invalid'],
        $value: 'invalid',
        name: 'invalidToken',
      } as TransformedToken

      expect(() => typographyPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token invalidToken: invalid',
      )
    })

    it('should throw error for empty string values', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'empty'],
        $value: '',
        name: 'emptyToken',
      } as TransformedToken

      expect(() => typographyPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token emptyToken: ',
      )
    })

    it('should throw error for undefined token name', () => {
      const token = {
        $type: 'dimension',
        path: ['typography', 'font-sizes', 'noname'],
        $value: 'abc',
      } as TransformedToken

      expect(() => typographyPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token "": abc',
      )
    })
  })
})
