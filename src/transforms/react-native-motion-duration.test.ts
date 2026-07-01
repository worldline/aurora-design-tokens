import type { TransformedToken } from 'style-dictionary/types'
import { describe, expect, it } from 'vitest'

import { reactNativeMotionDuration } from './react-native-motion-duration.ts'

describe('reactNativeMotionDuration', () => {
  describe('filter', () => {
    it('should match primitive duration tokens', () => {
      const token = {
        $type: 'string',
        path: ['motion', 'primitive', 'duration', '150'],
      } as TransformedToken

      expect(reactNativeMotionDuration.filter(token)).toBe(true)
    })

    it('should not match non-duration motion tokens', () => {
      const token = {
        $type: 'string',
        path: ['motion', 'primitive', 'easing'],
      } as TransformedToken

      expect(reactNativeMotionDuration.filter(token)).toBe(false)
    })

    it('should not match non-motion duration tokens', () => {
      const token = {
        $type: 'string',
        path: ['size', 'component', 'duration'],
      } as TransformedToken

      expect(reactNativeMotionDuration.filter(token)).toBe(false)
    })
  })

  describe('transform', () => {
    it('should return already-transformed numeric values as-is', () => {
      const token = {
        path: ['motion', 'ripple', 'duration'],
        $value: 200,
      } as TransformedToken

      expect(reactNativeMotionDuration.transform(token)).toBe(200)
    })

    it('should convert millisecond strings to numbers', () => {
      const token = {
        path: ['motion', 'primitive', 'duration', '300'],
        $value: '300ms',
      } as TransformedToken

      expect(reactNativeMotionDuration.transform(token)).toBe(300)
    })

    it('should throw for non-string and non-number values', () => {
      const token = {
        path: ['motion', 'primitive', 'duration', '300'],
        $value: true,
      } as TransformedToken

      expect(() => reactNativeMotionDuration.transform(token)).toThrow(
        'Invalid motion duration token at path: motion.primitive.duration.300: expected a string value, but got boolean',
      )
    })

    it('should throw for invalid duration format', () => {
      const token = {
        path: ['motion', 'primitive', 'duration', '300'],
        $value: '300',
      } as TransformedToken

      expect(() => reactNativeMotionDuration.transform(token)).toThrow(
        'Invalid motion duration token at path: motion.primitive.duration.300: expected a duration value in milliseconds (e.g. "150ms"), but got "300"',
      )
    })
  })
})
