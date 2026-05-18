import { describe, expect, it } from 'vitest'

import { decapitalize, kebabCaseToCamelCase } from './string.ts'

describe('string utils', () => {
  describe('kebabCaseToCamelCase', () => {
    it('should convert a single-hyphen kebab string', () => {
      expect(kebabCaseToCamelCase('foo-bar')).toBe('fooBar')
    })

    it('should convert multiple hyphens', () => {
      expect(kebabCaseToCamelCase('foo-bar-baz')).toBe('fooBarBaz')
    })

    it('should handle digits after hyphens', () => {
      expect(kebabCaseToCamelCase('foo-2bar')).toBe('foo2bar')
    })

    it('should return a string with no hyphens unchanged', () => {
      expect(kebabCaseToCamelCase('foobar')).toBe('foobar')
    })

    it('should return an empty string unchanged', () => {
      expect(kebabCaseToCamelCase('')).toBe('')
    })
  })

  describe('decapitalize', () => {
    it('should lowercase the first character', () => {
      expect(decapitalize('Hello')).toBe('hello')
    })

    it('should leave subsequent characters unchanged', () => {
      expect(decapitalize('FooBar')).toBe('fooBar')
    })

    it('should not change an already-lowercase string', () => {
      expect(decapitalize('hello')).toBe('hello')
    })
  })
})
