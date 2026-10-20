import { describe, expect, it } from 'vitest'

import { deeplyMapKeys, deepMerge } from './object.ts'

describe('object utils', () => {
  describe('deeplyMapKeys', () => {
    it('should map keys at the top level', () => {
      const result = deeplyMapKeys({ 'foo-bar': 1 }, (k) => k.toUpperCase())
      expect(result).toEqual({ 'FOO-BAR': 1 })
    })

    it('should map keys recursively in nested objects', () => {
      const input = { a: { b: { c: 42 } } }
      const result = deeplyMapKeys(input, (k) => k.toUpperCase())
      expect(result).toEqual({ A: { B: { C: 42 } } })
    })

    it('should map keys of objects inside arrays', () => {
      const input = { items: [{ foo: 1 }, { foo: 2 }] }
      const result = deeplyMapKeys(input, (k) => k.toUpperCase())
      expect(result).toEqual({ ITEMS: [{ FOO: 1 }, { FOO: 2 }] })
    })

    it('should leave primitive array items unchanged', () => {
      const input = { values: [1, 'two', true] }
      const result = deeplyMapKeys(input, (k) => k.toUpperCase())
      expect(result).toEqual({ VALUES: [1, 'two', true] })
    })

    it('should handle an empty object', () => {
      expect(deeplyMapKeys({}, (k) => k)).toEqual({})
    })

    it('should not mutate the original object', () => {
      const input = { a: { b: 1 } }
      deeplyMapKeys(input, (k) => k.toUpperCase())
      expect(input).toEqual({ a: { b: 1 } })
    })
  })

  describe('deepMerge', () => {
    it('should combine nested objects that share a parent key', () => {
      const result = deepMerge(
        { glow: { white: 1, brand: 2 } },
        { glow: { data: { primary: 3 } } },
      )
      expect(result).toEqual({
        glow: { white: 1, brand: 2, data: { primary: 3 } },
      })
    })

    it('should add keys that only exist in one object', () => {
      expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it('should throw with the full path when a leaf collides', () => {
      expect(() =>
        deepMerge(
          { glow: { data: { primary: 1 } } },
          { glow: { data: { primary: 2 } } },
        ),
      ).toThrow('Token collision at glow.data.primary')
    })

    it('should throw when an object collides with a leaf', () => {
      expect(() => deepMerge({ a: 1 }, { a: { b: 2 } })).toThrow(
        'Token collision at a',
      )
    })

    it('should not mutate the inputs', () => {
      const a = { x: { y: 1 } }
      const b = { x: { z: 2 } }
      deepMerge(a, b)
      expect(a).toEqual({ x: { y: 1 } })
      expect(b).toEqual({ x: { z: 2 } })
    })
  })
})
