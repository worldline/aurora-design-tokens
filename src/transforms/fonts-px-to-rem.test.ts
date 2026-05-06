import type { PlatformConfig, TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { fontsPxToRem } from './fonts-px-to-rem.ts'

describe('fontsPxToRem', () => {
  describe('filter', () => {
    it('should filter dimension tokens with font-size path', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', '2xl'],
        $value: '16px',
      } as TransformedToken
      expect(fontsPxToRem.filter(token)).toBeTruthy()
    })

    it('should filter dimension tokens with line-height path', () => {
      const token = {
        $type: 'dimension',
        path: ['line-height', 'sm'],
        $value: '24px',
      } as TransformedToken
      expect(fontsPxToRem.filter(token)).toBeTruthy()
    })

    it('should not filter non-dimension tokens', () => {
      const token = {
        $type: 'color',
        path: ['font-size', 'color'],
        $value: '#000',
      } as TransformedToken
      expect(fontsPxToRem.filter(token)).toBeFalsy()
    })

    it('should not filter dimension tokens without font-size or line-height path', () => {
      const token = {
        $type: 'dimension',
        path: ['spacing', 'small'],
        $value: '8px',
      } as TransformedToken
      expect(fontsPxToRem.filter(token)).toBeFalsy()
    })
  })

  describe('transform', () => {
    const platform = {} as PlatformConfig
    it('should convert px to rem with default base font size (16)', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', '2xl'],
        $value: '16',
      } as TransformedToken

      expect(fontsPxToRem.transform(token, platform)).toBe('1rem')
    })

    it('should convert px to rem with custom base font size', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', 'xl'],
        $value: '24',
      } as TransformedToken
      const platformWithBasePxFontSize = {
        basePxFontSize: 12,
      } as PlatformConfig
      expect(fontsPxToRem.transform(token, platformWithBasePxFontSize)).toBe(
        '2rem',
      )
    })

    it('should return "0" for zero values', () => {
      const token = {
        $type: 'dimension',
        path: ['line-height', 'none'],
        $value: '0px',
      } as TransformedToken

      expect(fontsPxToRem.transform(token, platform)).toBe('0')
    })

    it('should handle decimal values correctly', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', 'sm'],
        $value: '14',
      } as TransformedToken

      expect(fontsPxToRem.transform(token, platform)).toBe('0.875rem')
    })

    it('should handle string values with px suffix', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', '2xl'],
        $value: '16px',
      } as TransformedToken

      expect(fontsPxToRem.transform(token, platform)).toBe('1rem')
    })

    it('should throw error for invalid (NaN) values', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', 'invalid'],
        $value: 'invalid',
        name: 'invalidToken',
      } as TransformedToken

      expect(() => fontsPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token invalidToken: invalid',
      )
    })

    it('should throw error for empty string values', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', 'empty'],
        $value: '',
        name: 'emptyToken',
      } as TransformedToken

      expect(() => fontsPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token emptyToken: ',
      )
    })

    it('should throw error for undefined token name', () => {
      const token = {
        $type: 'dimension',
        path: ['font-size', 'noname'],
        $value: 'abc',
      } as TransformedToken

      expect(() => fontsPxToRem.transform(token, platform)).toThrow(
        'Invalid value for token "": abc',
      )
    })
  })
})
