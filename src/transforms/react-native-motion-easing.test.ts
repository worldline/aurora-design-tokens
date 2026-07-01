import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { reactNativeMotionEasing } from './react-native-motion-easing.ts'

describe('reactNativeMotionEasing', () => {
  describe('filter', () => {
    it('should match primitive easing tokens', () => {
      const token = {
        $type: 'string',
        path: ['motion', 'primitive', 'easing', 'standard'],
      } as TransformedToken

      expect(reactNativeMotionEasing.filter(token)).toBe(true)
    })

    it('should not match behavior easing tokens', () => {
      const token = {
        $type: 'string',
        path: ['motion', 'behavior', 'transition', 'easing'],
      } as TransformedToken

      expect(reactNativeMotionEasing.filter(token)).toBe(false)
    })

    it('should not match non-easing motion tokens', () => {
      const token = {
        $type: 'string',
        path: ['motion', 'behavior', 'transition', 'duration'],
      } as TransformedToken

      expect(reactNativeMotionEasing.filter(token)).toBe(false)
    })

    it('should not match non-motion easing tokens', () => {
      const token = {
        $type: 'string',
        path: ['color', 'primitive', 'easing'],
      } as TransformedToken

      expect(reactNativeMotionEasing.filter(token)).toBe(false)
    })

    it('should not match tokens with a non-string $type', () => {
      const token = {
        $type: 'dimension',
        path: ['motion', 'primitive', 'easing', 'standard'],
      } as TransformedToken

      expect(reactNativeMotionEasing.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    it('should return a bezier object for a valid cubic-bezier value', () => {
      const token = {
        path: ['motion', 'primitive', 'easing', 'standard'],
        $value: 'cubic-bezier(0.4, 0, 0.2, 1)',
      } as TransformedToken

      expect(reactNativeMotionEasing.transform(token)).toEqual({
        name: 'cubic-bezier',
        controlPoints: [0.4, 0, 0.2, 1],
      })
    })

    it('should throw for non-string $value', () => {
      const token = {
        path: ['motion', 'primitive', 'easing', 'standard'],
        $value: 42,
      } as TransformedToken

      expect(() => reactNativeMotionEasing.transform(token)).toThrow(
        'Invalid motion easing token at path: motion.primitive.easing.standard: expected a string value, but got number',
      )
    })
  })
})
