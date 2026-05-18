import { describe, expect, it } from 'vitest'

import { deeplyMapKeys } from './object.ts'

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
})
