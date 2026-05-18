import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { stripUnit } from './strip-unit.ts'

describe('stripUnit', () => {
  describe('filter', () => {
    it('should match dimension tokens', () => {
      const token = { $type: 'dimension' } as TransformedToken
      expect(stripUnit.filter(token)).toBe(true)
    })

    it('should not match non-dimension tokens', () => {
      const token = { $type: 'color' } as TransformedToken
      expect(stripUnit.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    it('should parse a string value to a number', () => {
      const token = { $type: 'dimension', $value: '16px' } as TransformedToken
      expect(stripUnit.transform(token)).toBe(16)
    })

    it('should pass through a numeric value unchanged', () => {
      const token = { $type: 'dimension', $value: 8 } as TransformedToken
      expect(stripUnit.transform(token)).toBe(8)
    })

    it('should parse a decimal string value', () => {
      const token = { $type: 'dimension', $value: '1.5rem' } as TransformedToken
      expect(stripUnit.transform(token)).toBe(1.5)
    })

    it('should throw when value does not contain a number', () => {
      const token = {
        $type: 'dimension',
        path: ['some', 'path'],
        $value: 'abc',
      } as TransformedToken
      expect(() => stripUnit.transform(token)).toThrow(
        "Invalid token at path: some.path: Value 'abc' could not be converted to a number.",
      )
    })

    it('should throw when value is empty string', () => {
      const token = {
        $type: 'dimension',
        path: ['some', 'path'],
        $value: '',
      } as TransformedToken
      expect(() => stripUnit.transform(token)).toThrow(
        "Invalid token at path: some.path: Value '' could not be converted to a number.",
      )
    })
  })
})
